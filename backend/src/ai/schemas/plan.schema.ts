import { z } from 'zod';

export type ComplexityLevel = 'Low' | 'Medium' | 'High';

export interface FeatureItem {
  title: string;
  description: string;
  complexity: ComplexityLevel;
}

export interface TechRecommendation {
  name: string;
  rationale: string;
}

export interface RoadmapPhase {
  phaseNum: number;
  title: string;
  durationWeeks: number;
  tasks: string[];
  deliverables: string[];
}

export interface ProjectPlanZod {
  mustHaveFeatures: FeatureItem[];
  goodToHaveFeatures: FeatureItem[];
  futureFeatures: FeatureItem[];
  techStackDetailed: {
    frontend: TechRecommendation[];
    backend: TechRecommendation[];
    database: TechRecommendation[];
    ai: TechRecommendation[];
    apis: TechRecommendation[];
    deployment: TechRecommendation[];
    tools: TechRecommendation[];
  };
  architectureSummary: string;
  roadmapPhases: RoadmapPhase[];
  improvements: string[];
}

export const FeatureItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  complexity: z.preprocess(
    (val: any) => {
      const clean = String(val || '').toLowerCase();
      if (clean.includes('high')) return 'High';
      if (clean.includes('low')) return 'Low';
      return 'Medium';
    },
    z.enum(['Low', 'Medium', 'High'])
  ) as z.ZodType<ComplexityLevel, any, any>,
});

export const TechRecommendationSchema = z.object({
  name: z.string().min(1),
  rationale: z.string().min(1),
});

export const RoadmapPhaseSchema = z.object({
  phaseNum: z.preprocess((val: any) => parseInt(String(val || 1), 10) || 1, z.number().int()) as z.ZodType<number, any, any>,
  title: z.string().min(1),
  durationWeeks: z.preprocess((val: any) => parseFloat(String(val || 1)) || 1, z.number()) as z.ZodType<number, any, any>,
  tasks: z.array(z.string()).min(1),
  deliverables: z.array(z.string()).min(1),
});

export const ProjectPlanSchemaZod: z.ZodType<ProjectPlanZod, any, any> = z.object({
  mustHaveFeatures: z.array(FeatureItemSchema).min(1),
  goodToHaveFeatures: z.array(FeatureItemSchema),
  futureFeatures: z.array(FeatureItemSchema),
  techStackDetailed: z.object({
    frontend: z.array(TechRecommendationSchema),
    backend: z.array(TechRecommendationSchema),
    database: z.array(TechRecommendationSchema),
    ai: z.array(TechRecommendationSchema),
    apis: z.array(TechRecommendationSchema),
    deployment: z.array(TechRecommendationSchema),
    tools: z.array(TechRecommendationSchema),
  }),
  architectureSummary: z.string().min(1),
  roadmapPhases: z.array(RoadmapPhaseSchema).min(1),
  improvements: z.array(z.string()),
}) as z.ZodType<ProjectPlanZod, any, any>;
