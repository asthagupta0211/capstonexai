import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { initKeepAlive } from './services/keepAlive.service.js';

async function startServer() {
  console.log('⚡ Initializing AI Project Idea Generator & Mentor Backend...');

  // Connect Database (MongoDB Atlas)
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode.`);
    console.log(`🔗 API Base URL: http://localhost:${env.PORT}/api/v1`);
    console.log(`🏥 Health Check: http://localhost:${env.PORT}/api/v1/health`);

    // Start keep-alive service to prevent Render from going to sleep
    initKeepAlive();
  });
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});

