import { z } from 'zod';

export const VivaQuestionSchema = z.object({
  id: z.string().default('q1'),
  question: z.string().min(10),
  category: z.enum(['Architecture & Stack', 'Scalability & Performance', 'Security & Edge Cases', 'Data & Algorithmic Trade-offs', 'Academic Novelty']),
  examinerIntent: z.string().min(10),
  trapToAvoid: z.string().min(10),
  modelAnswer: z.string().min(20),
});

export const VivaDefenseResponseSchema = z.object({
  overallDefenseReadinessScore: z.number().int().min(1).max(100),
  examinerPerspectiveSummary: z.string().min(20),
  criticalVulnerabilities: z.array(z.string()).min(2),
  questions: z.array(VivaQuestionSchema).min(3).max(7),
});

export type VivaQuestion = z.infer<typeof VivaQuestionSchema>;
export type VivaDefenseResponse = z.infer<typeof VivaDefenseResponseSchema>;
