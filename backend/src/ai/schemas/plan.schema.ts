import { z } from 'zod';

export const FeatureItemSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  complexity: z.enum(['Low', 'Medium', 'High']),
});

export const TechRecommendationSchema = z.object({
  name: z.string().min(2),
  rationale: z.string().min(10),
});

export const RoadmapPhaseSchema = z.object({
  phaseNum: z.number().int().min(1).max(10),
  title: z.string().min(3),
  durationWeeks: z.number().min(0.5).max(12),
  tasks: z.array(z.string()).min(1),
  deliverables: z.array(z.string()).min(1),
});

export const ProjectPlanSchemaZod = z.object({
  mustHaveFeatures: z.array(FeatureItemSchema).min(2),
  goodToHaveFeatures: z.array(FeatureItemSchema).min(1),
  futureFeatures: z.array(FeatureItemSchema).min(1),
  techStackDetailed: z.object({
    frontend: z.array(TechRecommendationSchema).min(1),
    backend: z.array(TechRecommendationSchema).min(1),
    database: z.array(TechRecommendationSchema).min(1),
    ai: z.array(TechRecommendationSchema).min(1),
    apis: z.array(TechRecommendationSchema).min(1),
    deployment: z.array(TechRecommendationSchema).min(1),
    tools: z.array(TechRecommendationSchema).min(1),
  }),
  architectureSummary: z.string().min(30),
  roadmapPhases: z.array(RoadmapPhaseSchema).min(8).max(12),
  improvements: z.array(z.string()).min(2),
});

export type ProjectPlanZod = z.infer<typeof ProjectPlanSchemaZod>;
