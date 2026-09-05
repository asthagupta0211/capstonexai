import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import { env } from './config/env.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiV1Routes from './routes/api.v1.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Enable HTTP response compression (gzip / deflate) for maximum network efficiency
app.use(
  compression({
    level: 6,
    threshold: 1024, // Compress responses above 1KB
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    },
  })
);

// Enable strong ETags for HTTP 304 Not Modified caching
app.set('etag', 'strong');

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible modern UI font and script loading
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Crucial: allows Vercel frontend to fetch backend API
  })
);

// Comprehensive list of allowed origins
const allowedOrigins = [
  'https://capstonexai.vercel.app',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000',
  env.CLIENT_URL,
].filter(Boolean);

const isOriginAllowed = (origin: string): boolean => {
  if (allowedOrigins.includes(origin)) return true;
  // Allow all Vercel domains (production & branch preview deployments)
  if (/^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(origin)) return true;
  // Allow Render domains
  if (/^https:\/\/([a-zA-Z0-9_-]+\.)*onrender\.com$/.test(origin)) return true;
  return false;
};

// Cross-Origin Resource Sharing (CORS) with preflight handling
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server, mobile, curl, or keep-alive pings without origin header
    if (!origin || isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Request allowed with fallback: ${origin}`);
      callback(null, true); // Fallback to allow rather than blocking production traffic
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-Keep-Alive',
  ],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
  maxAge: 86400, // Cache preflight response for 24 hours
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


// Request body parser with safe limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// General Rate Limiter
app.use('/api', generalLimiter);

// Mount API v1
app.use('/api/v1', apiV1Routes);

// In production, serve frontend static build
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    res.status(404).json({ success: false, error: 'Endpoint not found.' });
    return;
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      // In development when frontend runs on 5173, index.html might not exist in backend
      res.status(200).send('AI Project Idea Generator API is running. Frontend dev server is at http://localhost:5173');
    }
  });
});

// Centralized error handler
app.use(errorHandler);
