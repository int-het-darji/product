/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import http from "http";
import { Socket } from "net"; // Import Socket
import app from "./app";
import { Database } from "./config";
import { logger } from "./utils/logger";
import redis from "./config/redis";

// Create HTTP server
const server = http.createServer(app);

// Track active connections
const connections: { [key: string]: Socket } = {};

server.on("connection", (conn: Socket) => {
  const key = `${conn.remoteAddress}:${conn.remotePort}`;
  connections[key] = conn;
  conn.on("close", () => {
    delete connections[key];
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await Database.init();
    logger.info("Database initialized successfully");

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    });
  } catch (error: any) {
    logger.error({ err: error }, "Failed to initialize database");
    process.exit(1);
  }
};

const redisConn = async () => {
  try {
    const pong = await redis.ping()
    logger.info(`Redis Connected ${pong}`)
  } catch (error) {
    logger.error({err: error}, "Failed to load redis");
    process.exit(1)
  }
}

// Handle server startup errors
server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    logger.error(`Port ${process.env.PORT || 5000} is already in use`);
    gracefulShutdown();
  } else {
    logger.error({ err: error }, "Server error");
    gracefulShutdown();
  }
});

// Handle uncaught exceptions
// process.on("uncaughtException", (error: Error) => {
//   logger.error("Uncaught Exception:", error.stack || error.message);
//   gracefulShutdown();
// });

// Handle unhandled promise rejections
// process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
//   logger.error("Unhandled Rejection at:", promise, "Reason:", reason);
//   gracefulShutdown();
// });

// Handle SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  logger.info("Received SIGINT. Initiating graceful shutdown...");
  gracefulShutdown();
});

// Graceful shutdown function
function gracefulShutdown() {
  logger.info("Initiating graceful shutdown...");

  // Log active connections
  server.getConnections((err, count) => {
    if (err) {
      logger.error({ err }, "Error getting active connections");
    } else {
      logger.info(`Active connections: ${count}`);
    }
  });

  // Close all active connections
  for (const key in connections) {
    logger.info(`Destroying connection: ${key}`);
    connections[key].destroy();
  }

  // Stop accepting new connections
  server.close(() => {
    logger.info("Server closed");
    Database.shutdown()
      .then(() => {
        logger.info("Database connection closed");
        logger.info("Server closed");
        process.exit(0);
      })
      .catch((error) => {
        logger.error({ err: error }, "Error closing database");
        logger.info("Server closed");
        process.exit(1);
      });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error("Forcing server shutdown");
    process.exit(1);
  }, 10000);
}

// Start the server
startServer();
// redis connection
redisConn();

// Enhanced TypeScript types for Express Request
declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        display_name: string;
        role: string;
        current_device_id: string;
        permissions: string[];
      };
      userAgentInfo: {
        browser: string;
        version: string;
        os: string;
        device: string;
        ip: string;
      };
    }
  }
}
