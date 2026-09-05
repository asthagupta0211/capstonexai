import { StudentProfile, IStudentProfile } from '../models/StudentProfile.js';
import { isDbConnected } from '../config/db.js';
import { appCache } from '../utils/cache.js';

export interface ProfileInput {
  skills: string[];
  interests: string[];
  preferredDomain: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  availableWeeks: number;
  hoursPerWeek: number;
  preferredTech?: string[];
  projectConstraints?: string[];
}

/**
 * Service managing student profile persistence and retrieval.
 * Optimizes read latency with .lean() lookups and TTL caching.
 */
export class ProfileService {
  private static ensureDbConnected(): void {
    if (!isDbConnected()) {
      throw new Error(
        'Database is not connected. Please ensure your MONGODB_URI in .env is configured and pointing to your MongoDB Atlas cluster.'
      );
    }
  }

  /**
   * Upserts student profile directly in MongoDB Atlas and invalidates cache
   *
   * @param userId - ID of authenticated student
   * @param data - Profile fields
   * @returns Updated student profile document
   */
  static async upsertProfile(userId: string, data: ProfileInput): Promise<IStudentProfile> {
    this.ensureDbConnected();
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Invalidate profile cache
    appCache.del(`profile:${userId}`);

    return profile!;
  }

  /**
   * Retrieves profile by user id from cache or MongoDB Atlas with .lean()
   *
   * @param userId - ID of user
   * @returns Plain student profile object or null
   */
  static async getProfile(userId: string): Promise<IStudentProfile | null> {
    this.ensureDbConnected();

    const cacheKey = `profile:${userId}`;
    const cached = appCache.get<IStudentProfile>(cacheKey);
    if (cached) return cached;

    const result = (await StudentProfile.findOne({ userId }).lean()) as unknown as IStudentProfile | null;
    if (result) {
      appCache.set(cacheKey, result, 120000); // 2 min TTL
    }
    return result;
  }
}
