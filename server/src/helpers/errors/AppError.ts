/**
 * Custom application error class for consistent error handling.
 * Extends the native JavaScript Error object.
 */

type Data = {
  accessTokenExpired?: boolean;
  refreshTokenExpired?: boolean;
  signOut?: boolean;
  [key: string]: any;
};

class AppError extends Error {
  /** HTTP status code associated with the error */
  public readonly statusCode: number;

  /** Optional additional data to provide context */
  public readonly data?: Record<string, any>;

  /**
   * @param statusCode HTTP status code (e.g., 400, 404, 500)
   * @param message Error message for debugging/logging
   * @param stack Optional stack trace (auto-generated if not provided)
   * @param data Optional additional data to provide context about the error
   */
  constructor(
    statusCode: number,
    message: string,
    data: Data = {},
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture or set stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
