import { ValidationError as ExpressValidationError } from "express-validator";

// Base custom error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  serialize() {
    return {
      success: false,
      code: this.statusCode,
      message: this.message,
    };
  }
}

// Validation error for express-validator errors
export class ValidationError extends AppError {
  constructor(public errors: ExpressValidationError[], message: string = "Validation failed") {
    super(message, 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serialize() {
    return {
      success: false,
      code: 4001,
      message: this.message,
      details: {
        parameters: this.errors.map(error => ({
          name: "path" in error ? error.path : undefined,
          location: "location" in error ? error.location : undefined,
          value: "value" in error ? error.value : undefined,
          message: error.msg,
        })),
      },
    };
  }
}

// Authentication error for token-related issues
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

// Authorization error for permission issues
export class AuthorizationError extends AppError {
  constructor(message: string = "Authorization failed") {
    super(message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

// Not found error for missing resources
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// export class BadRequestError extends AppError {
//   constructor(message: string = "Bad request") {
//     super(message, 400);
//     Object.setPrototypeOf(this, BadRequestError.prototype);
//   }
// }

// Conflict error for duplicate resource
export class ConflictError extends AppError {
  constructor(message: string = "Conflict with existing resource") {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

// Internal server error for unexpected issues
export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error") {
    super(message, 500);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

// Helper to create custom errors
export const customError = (message: string, statusCode: number): AppError => {
  switch (statusCode) {
    case 400:
      return new ValidationError([], message);
    case 401:
      return new AuthenticationError(message);
    case 403:
      return new AuthorizationError(message);
    case 404:
      return new NotFoundError(message);
    case 409:
      return new ConflictError(message);
    case 500:
      return new InternalServerError(message);
    default:
      return new AppError(message, statusCode);
  }
};
