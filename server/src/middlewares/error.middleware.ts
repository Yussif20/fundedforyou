import { env } from "@/env";
import AppError from "@/helpers/errors/AppError";
import handleZodError from "@/helpers/errors/handleZodError";
import { logger } from "@/utils/logger";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const getTimeStamp = () => {
  const now = new Date();
  return now.toTimeString().split(" ")[0]; // HH:MM:SS
};

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorDetails: Record<string, any> = {};

  // Handle various error types
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode || 400;
    message = simplifiedError?.message || "Invalid input";
    errorDetails = simplifiedError?.errorDetails || {};
  } else if (err?.code === "P2002") {
    statusCode = 409;
    const field = err.meta?.target?.join(", ") || "unknown field";
    message = `Duplicate value exists for: ${field}. Please use a different value.`;
    errorDetails = { code: err.code, target: err.meta?.target };
  } else if (err?.code === "P2003") {
    statusCode = 400;
    message = `Invalid reference: foreign key constraint failed on field ${err.meta?.field_name}.`;
    errorDetails = {
      code: err.code,
      field: err.meta?.field_name,
      model: err.meta?.modelName,
    };
  } else if (err?.code === "P2011") {
    statusCode = 400;
    message = `Missing value: field ${err.meta?.field_name} cannot be null.`;
    errorDetails = { code: err.code, field: err.meta?.field_name };
  } else if (err?.code === "P2025") {
    statusCode = 404;
    message = `${err?.meta?.modelName} Not Found!!`;
    errorDetails = { code: err.code, cause: err.meta?.cause };
  } else if (err instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data provided for Prisma operation.";
    errorDetails = { message: err.message };
    
    // Log the full Prisma validation error for debugging
    logger.error(`Prisma Validation Error Details: ${err.message}`, { type: 'PRISMA-ERROR' });
  } else if (err instanceof PrismaClientKnownRequestError) {
    statusCode = 400;
    message = "Prisma operation failed. Please check your request.";
    errorDetails = { code: err.code, meta: err.meta };
  } else if (err instanceof PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Unexpected database error occurred. Please try again later.";
    errorDetails = { error: err.message };
  } else if (err instanceof AppError) {
    statusCode = err.statusCode || 500;
    message = err.message || "Application error occurred.";
    errorDetails =
      env.NODE_ENV === "development"
        ? { stack: err.stack, ...(err.data || {}) }
        : err.data || {};
  } else if (err?.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON format in request body.";
    errorDetails = {
      issues: [
        {
          path: "body",
          message:
            "The server could not parse your input. Please provide valid JSON (use double quotes and proper commas).",
        },
      ],
    };
  } else if (err instanceof Error && err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired. Please log in again.";
    errorDetails = env.NODE_ENV === "development" ? { stack: err.stack } : {};
  } else if (err instanceof Error) {
    statusCode = (err as any)?.statusCode || 500;
    message = err.message || "An unexpected error occurred.";
    errorDetails = env.NODE_ENV === "development" ? { stack: err.stack } : {};
  }

  // Send unified response
  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errorDetails,
  });

  // Determine log type for colors
  let logType: "success" | "warning" | "error" | "info" = "info";
  if (statusCode >= 500) logType = "error";
  else if (statusCode >= 400) logType = "warning";
  else if (statusCode >= 300) logType = "info";
  else if (statusCode >= 200) logType = "success";

  // Log main error summary
  logger[logType](`${statusCode} ${message}`, { type: "ERROR" });

  // Log device and request info
  logger.info(
    `${req.headers["user-agent"] || "Unknown"} | ip: ${
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress
    } | ${req.method} ${req.url}`,
    { type: "Device" }
  );

  // Log request body
  logger.info(req.body ? JSON.stringify(req.body) : "No data provided", {
    type: "Data",
  });

  // Log detailed error info
};

export default errorMiddleware;
