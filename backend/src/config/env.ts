import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config(); // Also check local backend/.env

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().default(''),
  MONGODB_DB_NAME: z.string().default('capstonex'),
  JWT_SECRET: z.string().min(16).default('dev_secret_ai_project_mentor_jwt_key_2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  GROQ_API_KEY: z.string().default(''),
  GROQ_MODEL: z.string().default('openai/gpt-oss-120b'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  RENDER_EXTERNAL_URL: z.string().default(''),
  KEEP_ALIVE_INTERVAL_MINUTES: z.coerce.number().int().positive().default(10),
});

const parsedEnv = envSchema.safeParse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
  RENDER_EXTERNAL_URL: process.env.RENDER_EXTERNAL_URL || process.env.KEEP_ALIVE_URL,
  KEEP_ALIVE_INTERVAL_MINUTES: process.env.KEEP_ALIVE_INTERVAL_MINUTES,
});

if (!parsedEnv.success) {
  console.error('❌ [Invalid Environment Configuration]:', JSON.stringify(parsedEnv.error.format(), null, 2));
  throw new Error('Environment variable validation failed');
}

export const env = {
  ...parsedEnv.data,
  IS_PRODUCTION: parsedEnv.data.NODE_ENV === 'production',
};

export type Env = typeof env;
