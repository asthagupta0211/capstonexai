import { MentorReview, IMentorReview } from '../models/MentorReview.js';
import { GenerationHistory } from '../models/GenerationHistory.js';
import { isDbConnected } from '../config/db.js';
import { GroqAiService } from '../ai/groqClient.js';

export class MentorService {
  private static ensureDbConnected() {
    if (!isDbConnected()) {
      throw new Error(
        'Database is not connected. Please ensure your MONGODB_URI in .env is configured and pointing to your MongoDB Atlas cluster.'
      );
    }
  }

  /**
   * Analyzes an existing project idea strictly via live Groq LLM & persists in MongoDB Atlas
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

    const created = await MentorReview.create({
      userId,
      projectTitle: idea.title,
      originalPitch: idea.pitch,
      ...analysis,
    });

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
      // Non-blocking
    }

    return { review: created, modelUsed };
  }

  /**
   * Lists past mentor reviews from MongoDB Atlas
   */
  static async listReviews(userId: string): Promise<IMentorReview[]> {
    this.ensureDbConnected();
    return await MentorReview.find({ userId }).sort({ createdAt: -1 });
  }
}
