import { ProjectIdea, IProjectIdea } from '../models/ProjectIdea.js';
import { GenerationHistory } from '../models/GenerationHistory.js';
import { isDbConnected } from '../config/db.js';
import { GroqAiService } from '../ai/groqClient.js';

export class IdeaService {
  private static ensureDbConnected() {
    if (!isDbConnected()) {
      throw new Error(
        'Database is not connected. Please ensure your MONGODB_URI in .env is configured and pointing to your MongoDB Atlas cluster.'
      );
    }
  }

  /**
   * Generates ideas using live Groq LLM and persists them in MongoDB Atlas
   */
  static async generateIdeas(userId: string, profile: any): Promise<{ ideas: IProjectIdea[]; modelUsed: string }> {
    this.ensureDbConnected();

    const startTime = Date.now();
    const { ideas, modelUsed } = await GroqAiService.generateIdeas(profile);
    const latencyMs = Date.now() - startTime;

    const savedIdeas: IProjectIdea[] = [];

    for (const item of ideas) {
      const created = await ProjectIdea.create({
        userId,
        ...item,
        isSaved: false,
      });
      savedIdeas.push(created);
    }

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
      // Non-blocking history logging
    }

    return {
      ideas: savedIdeas,
      modelUsed,
    };
  }

  /**
   * Lists ideas for user from MongoDB Atlas
   */
  static async listIdeas(userId: string, onlySaved: boolean = false): Promise<IProjectIdea[]> {
    this.ensureDbConnected();
    const query: any = { userId };
    if (onlySaved) {
      query.isSaved = true;
    }
    return await ProjectIdea.find(query).sort({ createdAt: -1 });
  }

  /**
   * Gets a single idea by ID from MongoDB Atlas
   */
  static async getIdeaById(id: string, userId: string): Promise<IProjectIdea | null> {
    this.ensureDbConnected();
    return await ProjectIdea.findOne({ _id: id, userId });
  }

  /**
   * Toggles save status for an idea in MongoDB Atlas
   */
  static async toggleSaveIdea(id: string, userId: string): Promise<IProjectIdea> {
    this.ensureDbConnected();
    const idea = await ProjectIdea.findOne({ _id: id, userId });
    if (!idea) {
      throw new Error('Project idea not found or access denied.');
    }
    idea.isSaved = !idea.isSaved;
    await idea.save();
    return idea;
  }

  /**
   * Deletes an idea from MongoDB Atlas
   */
  static async deleteIdea(id: string, userId: string): Promise<boolean> {
    this.ensureDbConnected();
    const result = await ProjectIdea.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }
}
