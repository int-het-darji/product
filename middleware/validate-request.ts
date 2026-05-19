import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError as ValidationErrorInterface, FieldValidationError } from "express-validator";
import { ValidationError } from "../utils";

// Type guard to check if error is FieldValidationError
const isFieldValidationError = (error: ValidationErrorInterface): error is FieldValidationError => {
  return "path" in error && "location" in error;
};

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Categorize errors for specific handling (only for FieldValidationError)
    const invalidPathParams = errors.array().filter(error => isFieldValidationError(error) && error.location === "params");
    if (invalidPathParams.length) {
      throw new ValidationError(errors.array(), "Invalid path parameters");
    }

    const requiredQueryParams = errors.array().filter(
      error => isFieldValidationError(error) && error.location === "query" && error.value === undefined
    );
    if (requiredQueryParams.length) {
      throw new ValidationError(errors.array(), "Missing required query parameters");
    }

    const invalidQueryParams = errors.array().filter(error => isFieldValidationError(error) && error.location === "query");
    if (invalidQueryParams.length) {
      throw new ValidationError(errors.array(), "Invalid query parameters");
    }

    const requiredBodyParams = errors.array().filter(
      error => isFieldValidationError(error) && error.location === "body" && error.value === undefined
    );
    if (requiredBodyParams.length) {
      throw new ValidationError(errors.array(), "Missing required body parameters");
    }

    // Default case for other validation errors
    throw new ValidationError(errors.array(), "Invalid request parameters");
  }

  next();
};