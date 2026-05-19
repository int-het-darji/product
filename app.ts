import express, { json, urlencoded, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { errorHandler } from "./middleware/error-handler";
import { rateLimiter } from "./middleware/rate-limiter";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import { logger } from "./utils/logger";
import router from "./routes";
import path from "path";

// Initialize express app
const app = express();

// Environment-based configuration
const isProduction = process.env.NODE_ENV === "production";

// Morgan logging setup
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
    skip: () => !isProduction, // Skip logging in development
  })
);

// Security middleware
app.use(helmet());
app.use(hpp());
app.use(cookieParser());

// Request parsing middleware
app.use(
  json({
    limit: "50mb",
  })
);
app.use(
  urlencoded({
    extended: true,
    limit: "50mb",
  })
);

// Compression middleware
app.use(compression());

// CORS configuration
const corsOrigins = [
  // Development origins
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8080",
  "http://192.168.0.226:3000",
  "http://192.168.2.68:3000",
  "http://10.205.93.185:3000",
  
  // Local network origins (for development)
  // "http://192.168.1.74:30080",
  // "http://192.168.1.74:30081",
  // "http://192.168.1.74:8080",
  
  // Internet-accessible origins (for production)
  // "http://103.240.169.92",
  // "https://103.240.169.92",
  
  // Environment variable origins (if provided)
  ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : [])
];

// Remove duplicates and filter out undefined valuesc
const allowedOrigins = [...new Set(corsOrigins.filter(Boolean))];

// // Log CORS configuration for debugging
// logger.info(`CORS allowed origins: ${JSON.stringify(allowedOrigins)}`);
// logger.info(`CORS_ORIGIN env var: ${process.env.CORS_ORIGIN || 'not set'}`);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Log blocked origins for debugging
      logger.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // 24 hours
  })
);

// Rate limiting
app.use(rateLimiter());

// Request timeout
app.use((req: Request, res: Response, next: NextFunction) => {
  req.setTimeout(15000, () => {
    logger.error(`Request timeout for ${req.method} ${req.url}`);
    res.status(504).json({ error: "Request timeout" });
  });
  next();
});

// API routes (no prefix - handled by ingress)
app.use("/api", router);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Static file hosting for React SPA
// The frontend build will be copied to build/public at deploy/runtime.
const staticDir = path.resolve(__dirname, "public");
app.use(express.static(staticDir));

// SPA fallback: send index.html for non-API routes (Express v5 + path-to-regexp v6)
// Use a regex that matches any path not starting with /api
app.get(/^\/(?!api).*/, (req: Request, res: Response) => {
  return res.sendFile(path.join(staticDir, "index.html"));
});

// Error handling middleware
app.use(errorHandler);

export default app;
