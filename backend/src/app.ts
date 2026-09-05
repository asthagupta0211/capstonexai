import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiV1Routes from './routes/api.v1.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible modern UI font and script loading
    crossOriginEmbedderPolicy: false,
  })
);

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5000', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

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
