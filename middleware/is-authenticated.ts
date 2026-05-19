import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
// import { Database } from "../config";
import { UserRow } from "../interfaces";
import { User } from "../models";
import { AuthenticationError, AuthorizationError, decodeToken, NotFoundError } from "../utils";


export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Extract token from Authorization header or cookie
  let token: string | undefined;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new AuthenticationError("Please login to access the resource");
  }

  // Decode token
  const decoded = await decodeToken(token);
  if (!decoded || typeof decoded === "string") {
    throw new AuthenticationError("Expired or invalid token");
  }

  // Extract userId and deviceId from decoded payload
  const { userId, deviceId } = decoded as JwtPayload & { userId: string; deviceId: string };
  if (!userId || !deviceId) {
    throw new AuthenticationError("Invalid token payload");
  }

  // Query user from database
  const user = await User.findById(userId) as unknown as UserRow;
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!user.is_enabled) {
    throw new AuthorizationError("User account is disabled");
  }

  // Validate deviceId in logged_in_devices
  if (!user.logged_in_devices || !Array.isArray(user.logged_in_devices)) {
    throw new AuthenticationError("No logged-in devices found for user");
  }

  const device = user.logged_in_devices.find((d: { device_id: string; expiration_date_time: string }) => d.device_id === deviceId);
  if (!device) {
    throw new AuthenticationError("Device not authorized");
  }

  // Check if device session is expired
  const expirationDateTime = new Date(device.expiration_date_time);
  if (expirationDateTime < new Date()) {
    throw new AuthenticationError("Device session expired");
  }

  // Attach user data to req.currentUser
  req.currentUser = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    display_name: user.display_name,
    role: user.role,
    current_device_id: deviceId,
    permissions: user.permissions,
  };

  next();
};
