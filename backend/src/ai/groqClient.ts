import Groq from 'groq-sdk';
import { env } from '../config/env.js';
import { PromptBuilder } from './promptBuilder.js';
import { AiValidator } from './validator.js';
import { GeneratedIdea, GeneratedIdeasResponseSchema } from './schemas/idea.schema.js';
import { ProjectPlanZod, ProjectPlanSchemaZod } from './schemas/plan.schema.js';
import { MentorAnalysisResponse, MentorAnalysisResponseSchema } from './schemas/mentor.schema.js';

let groqInstance: Groq | null = null;

function getGroqClient(): Groq {
  if (!env.GROQ_API_KEY || env.GROQ_API_KEY.trim() === '') {
    throw new Error(
      'GROQ_API_KEY is not set in your .env file. Please get your free API key from https://console.groq.com/keys and add it to .env.'
    );
  }
  if (!groqInstance) {
    groqInstance = new Groq({ apiKey: env.GROQ_API_KEY });
  }
  return groqInstance;
}

export class GroqAiService {
  /**
   * Generates project ideas strictly via live Groq LLM
   */
  static async generateIdeas(profile: any): Promise<{ ideas: GeneratedIdea[]; modelUsed: string }> {
    const groq = getGroqClient();

    console.log(`🚀 [Groq AI] Calling live model: ${env.GROQ_MODEL} for idea generation...`);
    const { system, user } = PromptBuilder.buildIdeaGenerationPrompt(profile);

    const completion = await groq.chat.completions.create({
      model: env.GROQ_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 3500,
    });

    const content = completion.choices[0]?.message?.content || '';
    if (!content.trim()) {
      throw new Error('Groq returned an empty response. Please check your API quota or prompt.');
    }

    const validation = AiValidator.validate(content, GeneratedIdeasResponseSchema);
    if (!validation.success || !validation.data) {
      throw new Error(`Groq structured JSON validation failed: ${validation.error}`);
    }

    return {
      ideas: validation.data.ideas,
      modelUsed: env.GROQ_MODEL,
    };
  }

  /**
   * Generates deep-dive blueprint and 10-phase roadmap strictly via live Groq LLM
   */
  static async generatePlan(idea: {
    title: string;
    pitch: string;
    techStack: string[];
    weeks: number;
  }): Promise<{ plan: ProjectPlanZod; modelUsed: string }> {
    const groq = getGroqClient();

    console.log(`🚀 [Groq AI] Calling live model: ${env.GROQ_MODEL} for capstone blueprint...`);
    const { system, user } = PromptBuilder.buildPlanPrompt(idea);

    const completion = await groq.chat.completions.create({
      model: env.GROQ_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content || '';
    if (!content.trim()) {
      throw new Error('Groq returned an empty response. Please check your API quota or prompt.');
    }

    const validation = AiValidator.validate(content, ProjectPlanSchemaZod);
    if (!validation.success || !validation.data) {
      throw new Error(`Groq blueprint JSON validation failed: ${validation.error}`);
    }

    return {
      plan: validation.data,
      modelUsed: env.GROQ_MODEL,
    };
  }

  /**
   * Analyzes an existing project idea strictly via live Groq LLM in Mentor Mode
   */
  static async analyzeIdea(idea: {
    title: string;
    pitch: string;
    intendedTech?: string;
    targetAudience?: string;
  }): Promise<{ analysis: MentorAnalysisResponse; modelUsed: string }> {
    const groq = getGroqClient();

    console.log(`🚀 [Groq AI] Calling live model: ${env.GROQ_MODEL} for Mentor Critique...`);
    const { system, user } = PromptBuilder.buildMentorPrompt(idea);

    const completion = await groq.chat.completions.create({
      model: env.GROQ_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
      max_tokens: 3000,
    });

    const content = completion.choices[0]?.message?.content || '';
    if (!content.trim()) {
      throw new Error('Groq returned an empty response. Please check your API quota or prompt.');
    }

    const validation = AiValidator.validate(content, MentorAnalysisResponseSchema);
    if (!validation.success || !validation.data) {
      throw new Error(`Groq mentor review validation failed: ${validation.error}`);
    }

    return {
      analysis: validation.data,
      modelUsed: env.GROQ_MODEL,
    };
  }
}
