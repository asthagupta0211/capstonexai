import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { ProfileController } from '../controllers/profile.controller.js';
import { IdeaController } from '../controllers/idea.controller.js';
import { PlanController } from '../controllers/plan.controller.js';
import { MentorController } from '../controllers/mentor.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { isDbConnected } from '../config/db.js';
import { env } from '../config/env.js';

const router = Router();

// --- System Diagnostics & Real Connection Status ---
router.get('/health', (req: Request, res: Response) => {
  const dbConnected = isDbConnected();
  const groqConfigured = !!(env.GROQ_API_KEY && env.GROQ_API_KEY.trim() !== '');

  res.status(200).json({
    success: true,
    data: {
      status: dbConnected && groqConfigured ? 'healthy' : 'configuration_required',
      database: dbConnected
        ? 'Connected to MongoDB Atlas'
        : 'Disconnected (Set MONGODB_URI in .env to connect)',
      aiProvider: groqConfigured
        ? `Connected to Groq Cloud (${env.GROQ_MODEL})`
        : 'Disconnected (Set GROQ_API_KEY from https://console.groq.com/keys in .env)',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
});

// --- Authentication Routes ---
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth/me', requireAuth, AuthController.getMe);

// --- Student Profile Routes ---
router.post('/profile', requireAuth, ProfileController.upsert);
router.get('/profile', requireAuth, ProfileController.get);

// --- Idea Generation & Exploration ---
router.post('/ideas/generate', requireAuth, aiRateLimiter, IdeaController.generate);
router.get('/ideas', requireAuth, IdeaController.list);
router.get('/ideas/:id', requireAuth, IdeaController.getById);
router.patch('/ideas/:id/save', requireAuth, IdeaController.toggleSave);
router.delete('/ideas/:id', requireAuth, IdeaController.remove);

// --- Detailed Blueprint & 10-Phase Roadmap ---
router.post('/ideas/:id/plan', requireAuth, aiRateLimiter, PlanController.generateOrGet);
router.get('/ideas/:id/plan', requireAuth, PlanController.generateOrGet);
router.get('/plans/export/:id', requireAuth, PlanController.exportMarkdown);

// --- AI Mentor Lab ---
router.post('/mentor/analyze', requireAuth, aiRateLimiter, MentorController.analyze);
router.get('/mentor/reviews', requireAuth, MentorController.list);

export default router;
