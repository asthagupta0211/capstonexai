import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(`❌ [Internal Error] ${req.method} ${req.url}:`, err.message || err);

  const statusCode = err.statusCode || err.status || 500;
  const userSafeMessage =
    statusCode >= 500
      ? 'An unexpected error occurred while processing your request. Please try again or use Demo mode.'
      : err.message || 'Request failed';

  res.status(statusCode).json({
    success: false,
    error: userSafeMessage,
    // Only in development show hint, NEVER leak stack traces or keys
    ...(env.NODE_ENV === 'development' && { devHint: err.message }),
  });
}
