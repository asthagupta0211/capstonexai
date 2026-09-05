import { z } from 'zod';

export const GeneratedIdeaSchema = z.object({
  title: z.string().min(5).max(120),
  pitch: z.string().min(15).max(250),
  problem: z.string().min(25),
  solution: z.string().min(25),
  targetUsers: z.array(z.string()).min(1),
  whyItMatters: z.string().min(20),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  feasibilityScore: z.number().int().min(1).max(100),
  impactScore: z.number().int().min(1).max(100),
  noveltyScore: z.number().int().min(1).max(100),
  skillFitScore: z.number().int().min(1).max(100),
  demoValueScore: z.number().int().min(1).max(100),
  estimatedScopeWeeks: z.number().int().min(2).max(52),
  techStackSummary: z.array(z.string()).min(2),
  keyFeaturesSummary: z.array(z.string()).min(2),
  risks: z.array(z.string()).min(1),
});

export const GeneratedIdeasResponseSchema = z.object({
  ideas: z.array(GeneratedIdeaSchema).min(1).max(6),
});

export type GeneratedIdea = z.infer<typeof GeneratedIdeaSchema>;
export type GeneratedIdeasResponse = z.infer<typeof GeneratedIdeasResponseSchema>;
