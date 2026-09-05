import { MentorReview, IMentorReview } from '../models/MentorReview.js';
import { GenerationHistory } from '../models/GenerationHistory.js';
import { isDbConnected } from '../config/db.js';
import { GroqAiService } from '../ai/groqClient.js';
import { appCache } from '../utils/cache.js';

/**
 * Service providing Faculty-Grade AI Mentorship, critique, and viva defense evaluations.
 * Optimized with .lean() lookups and TTL caching.
 */
export class MentorService {
  private static ensureDbConnected(): void {
    if (!isDbConnected()) {
      throw new Error(
        'Database is not connected. Please ensure your MONGODB_URI in .env is configured and pointing to your MongoDB Atlas cluster.'
      );
    }
  }

  /**
   * Analyzes an existing project idea strictly via live Groq LLM & persists in MongoDB Atlas
   *
   * @param userId - Requesting user ID
   * @param idea - Proposal payload to critique
   * @returns Review feedback with academic rubrics
   */
  static async analyzeIdea(
    userId: string,
    idea: {
      title: string;
      pitch: string;
      intendedTech?: string;
      targetAudience?: string;
    }
  ): Promise<{ review: IMentorReview; modelUsed: string }> {
    this.ensureDbConnected();

    const startTime = Date.now();
    const { analysis, modelUsed } = await GroqAiService.analyzeIdea(idea);
    const latencyMs = Date.now() - startTime;

    const created = (await MentorReview.create({
      userId,
      projectTitle: idea.title,
      originalPitch: idea.pitch,
      ...analysis,
    })) as unknown as IMentorReview;

    // Invalidate review cache for user
    appCache.invalidatePrefix(`reviews:${userId}`);

    try {
      await GenerationHistory.create({
        userId,
        actionType: 'MENTOR_REVIEW',
        profileSnapshot: { title: idea.title },
        modelName: modelUsed,
        isFallback: false,
        latencyMs,
      });
    } catch {
      // Non-blocking telemetry
    }

    return { review: created, modelUsed };
  }

  /**
   * Lists past mentor reviews from cache or MongoDB Atlas with .lean()
   *
   * @param userId - ID of authenticated user
   * @returns List of plain mentor review objects
   */
  static async listReviews(userId: string): Promise<IMentorReview[]> {
    this.ensureDbConnected();

    const cacheKey = `reviews:${userId}`;
    const cached = appCache.get<IMentorReview[]>(cacheKey);
    if (cached) return cached;

    const results = (await MentorReview.find({ userId })
      .sort({ createdAt: -1 })
      .lean()) as unknown as IMentorReview[];

    appCache.set(cacheKey, results, 60000);
    return results;
  }
}
