import { Request, Response, NextFunction } from 'express';

/**
 * Deep sanitization function to strip NoSQL injection operators ($gt, $ne, $where, etc.)
 * and prohibit dot notation keys that could lead to prototype pollution or MongoDB operator exploits.
 */
function sanitizeValue(value: any): any {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  const cleanObject: Record<string, any> = {};
  for (const key of Object.keys(value)) {
    // Prohibit keys starting with $ (MongoDB operator injection) or containing . (dot-notation traversal)
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    cleanObject[key] = sanitizeValue(value[key]);
  }

  return cleanObject;
}

/**
 * Express Middleware protecting against NoSQL Injection and Parameter Pollution
 */
export const noSqlSanitizer = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
};
