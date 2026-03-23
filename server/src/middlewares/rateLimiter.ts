import AppError from "@/helpers/errors/AppError";
import rateLimit from "express-rate-limit";
import httpStatusCode from "http-status";

const rateLimiterMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 100, // max 100 requests per IP
  message: "Too many requests from this IP, please try again later.",
});

export default rateLimiterMiddleware;

export const requestsLimiter = (time = 10, limit = 50, message?: string) =>
  rateLimit({
    windowMs: time * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: any, _res: any /*, next?: any */) => {
      // calculate remaining time in seconds
      const retryAfter = Math.ceil(
        (req.rateLimit?.resetTime?.getTime() - Date.now()) / 1000,
      );
      throw new AppError(
        httpStatusCode.TOO_MANY_REQUESTS,
        message || `Too many requests. Try again in ${retryAfter} seconds.`,
        {
          errorType: "rate_limit",
          remainingTime: retryAfter,
        },
      );
    },
  });
