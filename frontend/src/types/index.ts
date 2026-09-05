export interface StudentProfile {
  skills: string[];
  interests: string[];
  preferredDomain: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  availableWeeks: number;
  hoursPerWeek: number;
  preferredTech: string[];
  projectConstraints: string[];
}

export interface ProjectIdea {
  id: string;
  userId?: string;
  title: string;
  pitch: string;
  problem: string;
  solution: string;
  targetUsers: string[];
  whyItMatters: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  feasibilityScore: number;
  impactScore: number;
  noveltyScore: number;
  skillFitScore: number;
  demoValueScore: number;
  estimatedScopeWeeks: number;
  techStackSummary: string[];
  keyFeaturesSummary: string[];
  risks: string[];
  isSaved?: boolean;
}

export interface FeatureItem {
  title: string;
  description: string;
  complexity: 'Low' | 'Medium' | 'High';
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

export interface ProjectPlan {
  id: string;
  ideaId: string;
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

export interface ActionableImprovement {
  area: string;
  suggestion: string;
  expectedBenefit: string;
}

export interface MentorReview {
  id?: string;
  projectTitle: string;
  originalPitch: string;
  strengths: string[];
  weaknesses: string[];
  missingFeatures: string[];
  technicalPitfalls: string[];
  feasibilityScore: number;
  complexityScore: number;
  actionableImprovements: ActionableImprovement[];
  differentiationAdvice: string;
  futureScopeIdeas: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}
