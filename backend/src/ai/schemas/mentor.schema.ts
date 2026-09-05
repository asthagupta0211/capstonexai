import { z } from 'zod';

export const ActionableImprovementSchema = z.object({
  area: z.string().min(2),
  suggestion: z.string().min(10),
  expectedBenefit: z.string().min(10),
});

export const MentorAnalysisResponseSchema = z.object({
  strengths: z.array(z.string()).min(2),
  weaknesses: z.array(z.string()).min(2),
  missingFeatures: z.array(z.string()).min(2),
  technicalPitfalls: z.array(z.string()).min(2),
  feasibilityScore: z.number().int().min(1).max(100),
  complexityScore: z.number().int().min(1).max(100),
  actionableImprovements: z.array(ActionableImprovementSchema).min(2),
  differentiationAdvice: z.string().min(20),
  futureScopeIdeas: z.array(z.string()).min(2),
});

export type MentorAnalysisResponse = z.infer<typeof MentorAnalysisResponseSchema>;
