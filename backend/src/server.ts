import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { initKeepAlive } from './services/keepAlive.service.js';
import { logger } from './utils/logger.js';

async function startServer() {
  logger.info('Initializing AI Project Idea Generator & Mentor Backend...');

  // Connect Database (MongoDB Atlas)
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
    logger.info(`API Base URL: http://localhost:${env.PORT}/api/v1`);
    logger.info(`Health Check: http://localhost:${env.PORT}/api/v1/health`);

    // Start keep-alive service to prevent Render from going to sleep
    initKeepAlive();
  });
}

startServer().catch((err) => {
  logger.error('Fatal startup error:', err);
  process.exit(1);
});

