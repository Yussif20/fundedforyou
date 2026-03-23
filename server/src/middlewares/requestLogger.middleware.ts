import { logger } from "@/utils/logger";
import { NextFunction, Request, Response } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = process.hrtime(); // Start timer

  const ip =
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    "Unknown IP";
  const userAgent = req.headers["user-agent"] || "Unknown Device";

  // Combine request details
  const requestDetails: Record<string, any> = {
    Device: `${userAgent} | ip: ${ip}`,
  };

  if (req.body && Object.keys(req.body).length > 0)
    requestDetails.Body = req.body;
  if (req.query && Object.keys(req.query).length > 0)
    requestDetails.query = req.query;
  if (req.params && Object.keys(req.params).length > 0)
    requestDetails.params = req.params;

  // Log request and combined details
  logger.warning(`${req.method} || Body: ${req.body}`, { type: "REQUEST" });

  // When response finishes, log status
  res.on("finish", () => {
    const diff = process.hrtime(start);
    const duration = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2); // in ms

    const statusCode = res.statusCode;

    // Determine log type for colors
    let logType: "success" | "warning" | "error" | "info" = "info";
    if (statusCode >= 500) logType = "error";
    else if (statusCode >= 400) logType = "warning";
    else if (statusCode >= 200) logType = "success";

    logger[logType](`${statusCode} → ${req.originalUrl} (${duration} ms)`, {
      type: "RESPONSE",
    });
  });

  next();
};

export default requestLogger;
