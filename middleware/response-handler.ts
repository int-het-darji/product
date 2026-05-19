/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
// import { Database } from "../config";
import { ReferenceValue } from "../interfaces";
import { logger } from "../utils";


// Interfaces for logging objects
interface RequestLogObj {
  requestId: string;
  timestamp: number;
  method: string;
  route: string;
  userData?: ReferenceValue;
  ip: string;
  headers: {
    userAgent: string;
    contentType: string;
    contentLength: string;
    accept: string;
  };
  body: string;
  queryParams: { [key: string]: string };
  pathParams: { [key: string]: string };
}

interface ResponseLogObj {
  timestamp: number;
  statusCode: number;
  body: string;
}

// Interface for audit log data
interface AuditLogData {
  targetType?: string;
  targetId?: string;
  action?: string;
  oldData?: any;
  newData?: any;
  modifiedProperties?: any;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      request: RequestLogObj;
      response: ResponseLogObj;
      auditLogData?: AuditLogData;
    }
  }
}

// Extend Express Response interface
declare global {
  namespace Express {
    interface Response {
      sendResponse: (data: any, statusCode: number, auditLogData?: AuditLogData) => void;
    }
  }
}

// Custom sendResponse method
export const responseHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Initialize request log object
  // const request = {
  //   requestId: uuidv4(),
  //   timestamp: Date.now(),
  //   method: req.method,
  //   route: req.originalUrl.split("?").shift() as string,
  //   userData: {
  //     id: req.currentUser?.id || null,
  //     value: req.currentUser?.display_name || null,
  //   },
  //   ip: req.ip ?? "",
  //   headers: {
  //     userAgent: req.headers["user-agent"] || "",
  //     contentType: req.headers["content-type"] || "",
  //     contentLength: req.headers["content-length"] || "",
  //     accept: req.headers["accept"] || "",
  //   },
  //   body: "",
  //   queryParams: {} as { [key: string]: string },
  //   pathParams: {} as { [key: string]: string },
  // };

  // Populate query and path parameters
  // if (req.query && Object.keys(req.query).length) {
  //   request.queryParams = req.query as { [key: string]: string };
  // }

  // if (req.params && Object.keys(req.params).length) {
  //   request.pathParams = req.params as { [key: string]: string };
  // }

  // Replace path parameters in route with placeholders
  // const pathParams = Object.keys(req.params);
  // if (pathParams.length) {
  //   pathParams.forEach(param => {
  //     request.route = request.route.replace(req.params[param], `:${param}`);
  //   });
  // }

  // Stringify request body
  // if (req.body && Object.keys(req.body).length) {
  //   try {
  //     request.body = JSON.stringify(req.body);
  //   } catch (error: any) {
  //     logger.warn("Failed to stringify request body", error );
  //   }
  // }

  // Initialize response log object
  const response = {
    timestamp: 0,
    statusCode: 0,
    body: "",
  };

  // Attach to request
  // req.request = request;
  // req.response = response;

  // Custom sendResponse method
  res.sendResponse = async (
    data: any,
    statusCode: number = 200,
    // auditLogData: {
    //   targetType?: string;
    //   targetId?: string;
    //   action?: string;
    //   oldData?: any;
    //   newData?: any;
    //   modifiedProperties?: string[];
    // } = {}
  ): Promise<void> => {
    try {
      // Update response log
      req.response.statusCode = statusCode;
      // req.response.body = JSON.stringify(data);
      // req.response.timestamp = Date.now();

      // Prepare audit log data
      // req.auditLogData = {
      //   targetType: auditLogData.targetType,
      //   targetId: auditLogData.targetId,
      //   action: auditLogData.action || req.method.toUpperCase(),
      //   oldData: auditLogData.oldData,
      //   newData: auditLogData.newData,
      //   modifiedProperties: auditLogData.modifiedProperties,
      // };

      // Log to audit_logs table
      // await Database.query(
      //   `INSERT INTO audit_logs (
      //     id, request_id, user_data, method, route, status_code,
      //     request_body, response_body, target_type, target_id, action,
      //     old_data, new_data, modified_properties, created_at
      //   ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      //   [
      //     uuidv4(),
      //     req.request.requestId,
      //     JSON.stringify({
      //       id: req.currentUser?.id || null,
      //       value: req.currentUser?.display_name || null,
      //     }),
      //     req.request.method,
      //     req.request.route,
      //     req.response.statusCode,
      //     req.request.body || null,
      //     req.response.body || null,
      //     req.auditLogData.targetType || null,
      //     req.auditLogData.targetId || null,
      //     req.auditLogData.action,
      //     req.auditLogData.oldData ? JSON.stringify(req.auditLogData.oldData) : null,
      //     req.auditLogData.newData ? JSON.stringify(req.auditLogData.newData) : null,
      //     req.auditLogData.modifiedProperties ? JSON.stringify(req.auditLogData.modifiedProperties) : null,
      //     new Date(),
      //   ]
      // );

      // Send response
      res.status(statusCode).json({
        success: true,
        code: statusCode,
        data,
      });
    } catch (error: unknown) {
      // const err = error as Error;
      // logger.error("Failed to log audit data", { error: err.message, stack: err.stack });
      // @ts-ignore
      logger.error("Failed to log audit data", error as unknown);
      // Proceed with response even if logging fails
      res.status(statusCode).json({
        success: true,
        code: statusCode,
        data: JSON.stringify(data),
      });
    }
  };
  next();
};
