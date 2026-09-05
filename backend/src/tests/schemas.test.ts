import { describe, it, expect } from 'vitest';
import { GeneratedIdeaSchema, GeneratedIdeasResponseSchema } from '../ai/schemas/idea.schema.js';
import { ProjectPlanSchemaZod } from '../ai/schemas/plan.schema.js';
import { MentorAnalysisResponseSchema } from '../ai/schemas/mentor.schema.js';

describe('Zod AI Schemas Strict Validation', () => {
  it('validates generated idea schema strictly', () => {
    const validIdea = {
      title: 'MediScan AI: Clinical Decision Support',
      pitch: 'An intelligent triage assistant analyzing patient vitals and symptom logs.',
      problem: 'Emergency triage bottlenecks lead to prolonged hospital wait times and diagnostic delays.',
      solution: 'Deploy lightweight models with explainable attribution heatmaps to prioritize urgent cases.',
      targetUsers: ['Emergency nurses', 'Physicians'],
      whyItMatters: 'Directly improves patient outcomes and reduces diagnostic errors.',
      difficulty: 'Intermediate',
      feasibilityScore: 85,
      impactScore: 90,
      noveltyScore: 78,
      skillFitScore: 88,
      demoValueScore: 92,
      estimatedScopeWeeks: 12,
      techStackSummary: ['Python', 'FastAPI', 'PyTorch', 'MongoDB'],
      keyFeaturesSummary: ['Vitals intake', 'Explainable heatmaps', 'Urgency classification'],
      risks: ['Sensitivity to false negatives'],
    };

    const parsed = GeneratedIdeaSchema.safeParse(validIdea);
    expect(parsed.success).toBe(true);

    const invalidIdea = { ...validIdea, feasibilityScore: 150 }; // Out of range (>100)
    const invalidParsed = GeneratedIdeaSchema.safeParse(invalidIdea);
    expect(invalidParsed.success).toBe(false);
  });

  it('validates 10-phase capstone plan schema strictly', () => {
    const validPlan = {
      mustHaveFeatures: [
        { title: 'Core Model Inference', description: 'Real-time prediction engine.', complexity: 'High' },
        { title: 'Data Pipeline', description: 'Cleanses and normalizes input data.', complexity: 'Medium' },
      ],
      goodToHaveFeatures: [
        { title: 'Telemetry Dashboard', description: 'Visualizes model latency.', complexity: 'Low' },
      ],
      futureFeatures: [
        { title: 'Mobile App', description: 'Companion app on iOS/Android.', complexity: 'High' },
      ],
      techStackDetailed: {
        frontend: [{ name: 'React', rationale: 'Component architecture' }],
        backend: [{ name: 'Node.js', rationale: 'Fast asynchronous IO' }],
        database: [{ name: 'MongoDB Atlas', rationale: 'Flexible JSON documents' }],
        ai: [{ name: 'Groq Cloud', rationale: 'Ultra-fast inference' }],
        apis: [{ name: 'REST', rationale: 'Standardized communication' }],
        deployment: [{ name: 'Docker', rationale: 'Container portability' }],
        tools: [{ name: 'Vitest', rationale: 'Fast test runner' }],
      },
      architectureSummary: 'A 3-tier architecture with React frontend, Express backend, MongoDB Atlas storage, and Groq LLM API.',
      roadmapPhases: [
        { phaseNum: 1, title: 'Requirements', durationWeeks: 1, tasks: ['Survey literature'], deliverables: ['PRD'] },
        { phaseNum: 2, title: 'Architecture', durationWeeks: 1, tasks: ['Design components'], deliverables: ['Diagrams'] },
        { phaseNum: 3, title: 'Database Setup', durationWeeks: 1, tasks: ['Schema design'], deliverables: ['Atlas connection'] },
        { phaseNum: 4, title: 'Backend Core', durationWeeks: 2, tasks: ['REST endpoints'], deliverables: ['API collection'] },
        { phaseNum: 5, title: 'Frontend UI', durationWeeks: 2, tasks: ['Build views'], deliverables: ['Web client'] },
        { phaseNum: 6, title: 'AI Integration', durationWeeks: 2, tasks: ['Integrate Groq'], deliverables: ['Pipeline test'] },
        { phaseNum: 7, title: 'Testing', durationWeeks: 1, tasks: ['Unit tests'], deliverables: ['Test report'] },
        { phaseNum: 8, title: 'Deployment', durationWeeks: 1, tasks: ['Docker build'], deliverables: ['Live URL'] },
        { phaseNum: 9, title: 'Documentation', durationWeeks: 1, tasks: ['Thesis draft'], deliverables: ['Report PDF'] },
        { phaseNum: 10, title: 'Final Defense', durationWeeks: 1, tasks: ['Slide deck'], deliverables: ['Live Demo'] },
      ],
      improvements: ['Add automated benchmarking', 'Package core library'],
    };

    const parsed = ProjectPlanSchemaZod.safeParse(validPlan);
    expect(parsed.success).toBe(true);
  });

  it('validates mentor review schema strictly', () => {
    const validReview = {
      strengths: ['Clear real-world domain value', 'Mature tech stack selection'],
      weaknesses: ['Scope bloat risk for one semester', 'Baseline benchmark missing'],
      missingFeatures: ['Comparative evaluation metrics', 'Explainability dashboard'],
      technicalPitfalls: ['Latency on synchronous API calls', 'Data distribution drift'],
      feasibilityScore: 82,
      complexityScore: 75,
      actionableImprovements: [
        { area: 'Core Scope', suggestion: 'Focus on 1 workflow', expectedBenefit: 'Reliable live demo' },
        { area: 'Metrics', suggestion: 'Compare against baseline', expectedBenefit: 'Hard statistical defense' },
      ],
      differentiationAdvice: 'Emphasize explainable attributions and automated remediation.',
      futureScopeIdeas: ['Federated learning', 'Edge compilation'],
    };

    const parsed = MentorAnalysisResponseSchema.safeParse(validReview);
    expect(parsed.success).toBe(true);
  });
});
