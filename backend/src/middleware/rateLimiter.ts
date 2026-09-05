import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

// General API Rate Limiter
export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS, // 15 minutes
  max: env.RATE_LIMIT_MAX_REQUESTS, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

// Stricter Rate Limiter for AI Generation endpoints
export const aiRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // 30 generations per 10 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'AI generation quota exceeded for this session. Please wait 10 minutes or use Demo mode.',
  },
});
