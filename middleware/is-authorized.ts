import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../utils";

export const isAuthorized = (requiredPermissions: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Ensure req.currentUser exists (set by isAuthenticated middleware)
    if (!req.currentUser) {
      throw new AuthorizationError("User not authenticated");
    }

    // Normalize requiredPermissions to an array
    const permissionsToCheck = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    // Check if user has all required permissions
    const userPermissions = req.currentUser.permissions || [];
    const hasAllPermissions = permissionsToCheck.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasAllPermissions) {
      throw new AuthorizationError(
        `You do not have permission to access this resource`
      );
    }

    next();
  };
};