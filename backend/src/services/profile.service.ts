import { StudentProfile, IStudentProfile } from '../models/StudentProfile.js';
import { isDbConnected } from '../config/db.js';

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

export class ProfileService {
  private static ensureDbConnected() {
    if (!isDbConnected()) {
      throw new Error(
        'Database is not connected. Please ensure your MONGODB_URI in .env is configured and pointing to your MongoDB Atlas cluster.'
      );
    }
  }

  /**
   * Upserts student profile directly in MongoDB Atlas
   */
  static async upsertProfile(userId: string, data: ProfileInput): Promise<IStudentProfile> {
    this.ensureDbConnected();
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return profile!;
  }

  /**
   * Retrieves profile by user id from MongoDB Atlas
   */
  static async getProfile(userId: string): Promise<IStudentProfile | null> {
    this.ensureDbConnected();
    return await StudentProfile.findOne({ userId });
  }
}
