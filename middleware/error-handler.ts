/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
// import { v4 as uuidv4 } from "uuid";
// import { Database } from "../config";
import { AppError, ValidationError, AuthenticationError, InternalServerError, logger } from "../utils";

// Interface for standardized error response
interface ErrorResponse {
  success: boolean;
  code: number;
  message: string;
  details?: any;
  error?: string; // Only included in development
}

export const errorHandler = async (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Promise<void> => {
  let statusCode = (err as AppError).statusCode || 500;
  let response: ErrorResponse = {
    success: false,
    code: statusCode,
    message: "Internal server error",
  };

  // Handle specific error types
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    response = err.serialize();
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    response = new AuthenticationError("Invalid or expired token").serialize();
  } else if ((err as any).code === '23505') {
    statusCode = 400;
    response = new ValidationError([], "Duplicate entry detected").serialize();
  } else {
    // Treat unhandled errors as internal server errors
    response = new InternalServerError().serialize();
  }

  // Log to audit_logs
  // try {
  //   const requestId = req.request?.requestId || uuidv4();
  //   await Database.query(
  //     `INSERT INTO audit_logs (
  //       id, request_id, user_data, method, route, status_code,
  //       request_body, response_body, created_at, error
  //     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
  //     [
  //       uuidv4(),
  //       requestId,
  //       JSON.stringify({
  //         id: req.currentUser?.id || null,
  //         value: req.currentUser?.display_name || null,
  //       }),
  //       req.method,
  //       req.originalUrl.split("?").shift() || req.path,
  //       statusCode,
  //       req.request?.body || "{}",
  //       JSON.stringify(response),
  //       new Date(),
  //       JSON.stringify({
  //         error: err.name,
  //         message: err.message,
  //         stack: err.stack,
  //         path: req.path,
  //         method: req.method,
  //         statusCode,
  //       })
  //     ]
  //   );
  // } catch (logError) {
  //   logger.error("Failed to log error to audit_logs", logError as any);
  // }

  // Log the error
  logger.error({
    error: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode,
  });

  // Include detailed error in development
  if (process.env.NODE_ENV === "development") {
    response.error = err.stack || err.message;
  }

  // Send response
  res.status(statusCode).json(response);
};