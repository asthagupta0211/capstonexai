import { GroqAiService } from '../ai/groqClient.js';
import { appCache } from '../utils/cache.js';
import { VivaDefenseResponse } from '../ai/schemas/viva.schema.js';

export interface VivaIdeaInput {
  title: string;
  pitch: string;
  intendedTech?: string;
  targetAudience?: string;
}

export class VivaService {
  /**
   * Generates or retrieves cached Viva Voce Defense questions & model answers
   */
  static async simulateDefense(
    userId: string,
    idea: VivaIdeaInput
  ): Promise<{ defense: VivaDefenseResponse; modelUsed: string }> {
    const cacheKey = `viva:${idea.title.toLowerCase().trim()}:${(idea.intendedTech || '').toLowerCase().trim()}`;
    const cached = appCache.get<VivaDefenseResponse>(cacheKey);

    if (cached) {
      return { defense: cached, modelUsed: 'cache' };
    }

    const result = await GroqAiService.generateVivaDefense(idea);

    // Cache defense result for 2 hours
    appCache.set(cacheKey, result.defense, 7200);

    return result;
  }
}
