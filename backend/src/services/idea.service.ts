import { ProjectIdea, IProjectIdea } from '../models/ProjectIdea.js';
import { GenerationHistory } from '../models/GenerationHistory.js';
import { isDbConnected } from '../config/db.js';
import { GroqAiService } from '../ai/groqClient.js';
import { appCache } from '../utils/cache.js';

/**
 * Service orchestrating Capstone Project Idea generation, retrieval, and caching.
 * Implements Cache-Aside pattern and batch operations for optimal efficiency.
 */
export class IdeaService {
  private static ensureDbConnected(): void {
    if (!isDbConnected()) {
      throw new Error(
        'Database is not connected. Please ensure your MONGODB_URI in .env is configured and pointing to your MongoDB Atlas cluster.'
      );
    }
  }

  /**
   * Generates ideas using live Groq LLM and persists them in MongoDB Atlas using high-efficiency batch inserts.
   *
   * @param userId - ID of authenticated user
   * @param profile - Student profile configuration
   * @returns Generated ideas and LLM model metadata
   */
  static async generateIdeas(userId: string, profile: any): Promise<{ ideas: IProjectIdea[]; modelUsed: string }> {
    this.ensureDbConnected();

    const startTime = Date.now();
    const { ideas, modelUsed } = await GroqAiService.generateIdeas(profile);
    const latencyMs = Date.now() - startTime;

    // High-Efficiency Batch Insert: 1 single round-trip instead of N serial awaits
    const docsToInsert = ideas.map((item) => ({
      userId,
      ...item,
      isSaved: false,
    }));

    const savedIdeas = (await ProjectIdea.insertMany(docsToInsert)) as unknown as IProjectIdea[];

    // Invalidate user idea cache on mutation
    appCache.invalidatePrefix(`ideas:${userId}`);

    try {
      await GenerationHistory.create({
        userId,
        actionType: 'GENERATE_IDEAS',
        profileSnapshot: profile,
        modelName: modelUsed,
        isFallback: false,
        latencyMs,
      });
    } catch {
      // Non-blocking history telemetry
    }

    return {
      ideas: savedIdeas,
      modelUsed,
    };
  }

  /**
   * Lists ideas for user from cache or MongoDB Atlas with .lean() for zero Mongoose hydration overhead.
   *
   * @param userId - ID of authenticated user
   * @param onlySaved - Optional filter for bookmarked ideas
   * @returns List of plain project idea objects
   */
  static async listIdeas(userId: string, onlySaved: boolean = false): Promise<IProjectIdea[]> {
    this.ensureDbConnected();

    const cacheKey = `ideas:${userId}:${onlySaved}`;
    const cached = appCache.get<IProjectIdea[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const query: any = { userId };
    if (onlySaved) {
      query.isSaved = true;
    }

    // .lean() strips heavy Mongoose document wrappers, reducing memory by 70%
    const results = (await ProjectIdea.find(query)
      .sort({ createdAt: -1 })
      .lean()) as unknown as IProjectIdea[];

    // Cache with 60s TTL
    appCache.set(cacheKey, results, 60000);

    return results;
  }

  /**
   * Gets a single idea by ID using .lean() optimization
   *
   * @param id - Project idea ID
   * @param userId - Owner user ID
   */
  static async getIdeaById(id: string, userId: string): Promise<IProjectIdea | null> {
    this.ensureDbConnected();
    const cacheKey = `idea:${id}:${userId}`;
    const cached = appCache.get<IProjectIdea>(cacheKey);
    if (cached) return cached;

    const result = (await ProjectIdea.findOne({ _id: id, userId }).lean()) as unknown as IProjectIdea | null;
    if (result) {
      appCache.set(cacheKey, result, 60000);
    }
    return result;
  }

  /**
   * Toggles bookmark save status for an idea and invalidates cache
   *
   * @param id - Idea ID
   * @param userId - Owner user ID
   */
  static async toggleSaveIdea(id: string, userId: string): Promise<IProjectIdea> {
    this.ensureDbConnected();
    const idea = await ProjectIdea.findOne({ _id: id, userId });
    if (!idea) {
      throw new Error('Project idea not found or access denied.');
    }
    idea.isSaved = !idea.isSaved;
    await idea.save();

    // Cache Invalidation
    appCache.invalidatePrefix(`ideas:${userId}`);
    appCache.del(`idea:${id}:${userId}`);

    return idea;
  }

  /**
   * Deletes an idea from MongoDB Atlas and clears associated caches
   *
   * @param id - Idea ID
   * @param userId - Owner user ID
   */
  static async deleteIdea(id: string, userId: string): Promise<boolean> {
    this.ensureDbConnected();
    const result = await ProjectIdea.deleteOne({ _id: id, userId });

    if (result.deletedCount > 0) {
      appCache.invalidatePrefix(`ideas:${userId}`);
      appCache.del(`idea:${id}:${userId}`);
      return true;
    }
    return false;
  }
}
