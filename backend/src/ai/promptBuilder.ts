export class PromptBuilder {
  /**
   * Builds prompt for Idea Generation
   */
  static buildIdeaGenerationPrompt(profile: {
    skills: string[];
    interests: string[];
    preferredDomain: string;
    difficultyLevel: string;
    availableWeeks: number;
    hoursPerWeek: number;
    preferredTech?: string[];
    projectConstraints?: string[];
  }): { system: string; user: string } {
    const system = `You are a Senior Software Architect and University Capstone Project Mentor.
Your task is to generate 3 to 4 distinct, innovative, highly feasible, and academically rigorous final-year project ideas tailored strictly to the student's profile.

CRITICAL INSTRUCTIONS:
1. Return ONLY a valid, parseable JSON object matching the exact structure below. Do not wrap in markdown or include conversational text.
2. Ensure recommendations are REALISTIC for an undergraduate or master's final-year student within the specified timeline.
3. Every idea must be differentiated and avoid cliché projects (e.g. do not suggest basic e-commerce, simple blog, generic todo apps).
4. Feasibility, impact, novelty, skillFit, and demoValue scores must be integers strictly between 1 and 100.
5. All technologies recommended must be real, established, and currently available.

REQUIRED JSON FORMAT:
{
  "ideas": [
    {
      "title": "Project Title",
      "pitch": "One or two sentence compelling pitch",
      "problem": "Clear real-world problem statement",
      "solution": "Concrete technical solution proposed",
      "targetUsers": ["User group 1", "User group 2"],
      "whyItMatters": "Academic, industry, or societal importance",
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "feasibilityScore": 85,
      "impactScore": 90,
      "noveltyScore": 80,
      "skillFitScore": 88,
      "demoValueScore": 92,
      "estimatedScopeWeeks": 12,
      "techStackSummary": ["Tech1", "Tech2", "Tech3"],
      "keyFeaturesSummary": ["Feature 1", "Feature 2", "Feature 3"],
      "risks": ["Risk 1", "Risk 2"]
    }
  ]
}`;

    const user = `<STUDENT_PROFILE>
- Skills: ${profile.skills.join(', ') || 'Not specified'}
- Interests: ${profile.interests.join(', ') || 'General CS/Engineering'}
- Preferred Domain: ${profile.preferredDomain}
- Target Difficulty: ${profile.difficultyLevel}
- Available Timeline: ${profile.availableWeeks} weeks (${profile.hoursPerWeek} hours/week)
- Preferred Technologies: ${(profile.preferredTech && profile.preferredTech.join(', ')) || 'Flexible'}
- Constraints: ${(profile.projectConstraints && profile.projectConstraints.join(', ')) || 'None'}
</STUDENT_PROFILE>

Generate 3-4 top-tier final-year capstone project ideas that maximize both feasibility and presentation demo impact.`;

    return { system, user };
  }

  /**
   * Builds prompt for Deep-Dive Project Blueprint and 10-Phase Roadmap
   */
  static buildPlanPrompt(idea: {
    title: string;
    pitch: string;
    techStack: string[];
    weeks: number;
  }): { system: string; user: string } {
    const system = `You are a Principal Software Architect detailing a comprehensive final-year capstone project blueprint.
CRITICAL: You must return ONLY a single JSON object (NOT an array, must start with '{' and end with '}') matching EXACTLY this JSON structure with these exact keys (no markdown fences, no extra text):
{
  "mustHaveFeatures": [
    { "title": "Core Module 1", "description": "Clear technical description of essential MVP feature.", "complexity": "Medium" },
    { "title": "Core Module 2", "description": "Clear technical description of essential MVP feature.", "complexity": "High" }
  ],
  "goodToHaveFeatures": [
    { "title": "Enhancement 1", "description": "Useful feature after MVP is stable.", "complexity": "Medium" }
  ],
  "futureFeatures": [
    { "title": "Scale Expansion", "description": "Future enterprise or production enhancement.", "complexity": "High" }
  ],
  "techStackDetailed": {
    "frontend": [{ "name": "Frontend Framework", "rationale": "Why this is optimal for the project" }],
    "backend": [{ "name": "Backend Framework", "rationale": "Why this handles the workload" }],
    "database": [{ "name": "Database System", "rationale": "Why this data model fits" }],
    "ai": [{ "name": "AI Model / Framework", "rationale": "Inference and training justification" }],
    "apis": [{ "name": "API Protocol", "rationale": "Integration design rationale" }],
    "deployment": [{ "name": "Cloud / Hosting", "rationale": "Hosting and CI/CD strategy" }],
    "tools": [{ "name": "Development Tools", "rationale": "Testing and linting rationale" }]
  },
  "architectureSummary": "Detailed explanation of system architecture, data flow, component interactions, and security boundaries.",
  "roadmapPhases": [
    { "phaseNum": 1, "title": "Requirements & Survey", "durationWeeks": 1, "tasks": ["Literature review", "Gather requirements"], "deliverables": ["SRS Document"] },
    { "phaseNum": 2, "title": "Architecture & Design", "durationWeeks": 1, "tasks": ["System architecture", "ERD & API design"], "deliverables": ["Architecture Diagram"] },
    { "phaseNum": 3, "title": "Database & Setup", "durationWeeks": 1, "tasks": ["Setup DB schemas", "Environment configuration"], "deliverables": ["Initialized Database"] },
    { "phaseNum": 4, "title": "Backend/API Development", "durationWeeks": 1.5, "tasks": ["Develop REST endpoints", "Implement authentication"], "deliverables": ["Functional API"] },
    { "phaseNum": 5, "title": "Frontend Implementation", "durationWeeks": 1.5, "tasks": ["Build user interface", "State management setup"], "deliverables": ["Interactive UI"] },
    { "phaseNum": 6, "title": "AI & Algorithm Integration", "durationWeeks": 2, "tasks": ["Train or fine-tune models", "Connect AI inference pipeline"], "deliverables": ["AI Service"] },
    { "phaseNum": 7, "title": "Testing & Security Audit", "durationWeeks": 1, "tasks": ["Unit and integration tests", "Vulnerability scans"], "deliverables": ["Test Report"] },
    { "phaseNum": 8, "title": "Deployment & CI/CD", "durationWeeks": 1, "tasks": ["Containerize services", "Deploy cloud instance"], "deliverables": ["Live Deployment"] },
    { "phaseNum": 9, "title": "Documentation & Thesis", "durationWeeks": 1, "tasks": ["Write project report", "Prepare documentation"], "deliverables": ["Final Report"] },
    { "phaseNum": 10, "title": "Final Demo & Presentation", "durationWeeks": 1, "tasks": ["Prepare demo video", "Create presentation slides"], "deliverables": ["Demo Video & Slides"] }
  ],
  "improvements": [
    "First concrete recommendation for competitive excellence",
    "Second actionable recommendation for real-world impact"
  ]
}`;

    const user = `<PROJECT_DETAILS>
Title: ${idea.title}
Pitch: ${idea.pitch}
Baseline Tech Stack: ${idea.techStack.join(', ')}
Target Weeks: ${idea.weeks} weeks
</PROJECT_DETAILS>

Generate the complete production blueprint and 10-phase roadmap.`;

    return { system, user };
  }

  /**
   * Builds prompt for AI Mentor Mode
   */
  static buildMentorPrompt(idea: {
    title: string;
    pitch: string;
    intendedTech?: string;
    targetAudience?: string;
  }): { system: string; user: string } {
    const system = `You are an expert University Capstone Evaluator and Technical Mentor.
Critique the student's project idea objectively. Provide constructive, highly actionable feedback.

Return ONLY a valid JSON object with the following structure:
{
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "missingFeatures": ["Missing Feature 1", "Missing Feature 2", "Missing Feature 3"],
  "technicalPitfalls": ["Pitfall 1", "Pitfall 2", "Pitfall 3"],
  "feasibilityScore": 80,
  "complexityScore": 75,
  "actionableImprovements": [
    {
      "area": "Core Scope",
      "suggestion": "Specific advice",
      "expectedBenefit": "Why this helps the student pass evaluation"
    }
  ],
  "differentiationAdvice": "How to make this project uniquely stand out from cliché student projects",
  "futureScopeIdeas": ["Future idea 1", "Future idea 2", "Future idea 3"]
}`;

    const user = `<STUDENT_PROPOSED_PROJECT>
Title: ${idea.title}
Pitch / Concept: ${idea.pitch}
Intended Tech: ${idea.intendedTech || 'Not specified'}
Target Audience: ${idea.targetAudience || 'General users'}
</STUDENT_PROPOSED_PROJECT>

Perform a thorough architectural and evaluation critique of this project.`;

    return { system, user };
  }

  /**
   * Builds prompt for Viva Voce Final Defense Simulator
   */
  static buildVivaDefensePrompt(idea: {
    title: string;
    pitch: string;
    intendedTech?: string;
    targetAudience?: string;
  }): { system: string; user: string } {
    const system = `You are an exacting External Academic Examiner, University Defense Committee Head, and Principal Software Architect.
Your task is to conduct a realistic, high-pressure Viva Voce (Final Project Defense) cross-examination for a student presenting their capstone project.

CRITICAL INSTRUCTIONS:
1. Return ONLY a valid, parseable JSON object matching the exact structure below. Do not wrap in markdown or conversational greetings.
2. Every question must be TAILORED SPECIFICALLY to the student's project, stated technologies, and problem domain. Avoid generic questions like "How did you test your code?".
3. Focus on:
   - Architecture & Stack Justification (e.g. why choice X over standard alternative Y).
   - Scalability, concurrency bottlenecks, and cold-start latency.
   - Security vulnerabilities, data integrity, and failure handling.
   - Algorithmic trade-offs (loss functions, dataset bias, ACID vs BASE).
4. For each question, provide:
   - "examinerIntent": What the examiner is really testing (e.g. assessing whether student actually wrote the code or copy-pasted).
   - "trapToAvoid": The common amateur mistake students say that causes examiners to deduct marks.
   - "modelAnswer": The exact, bulletproof technical response the student should present to score top marks.

REQUIRED JSON FORMAT:
{
  "overallDefenseReadinessScore": 78,
  "examinerPerspectiveSummary": "Summary of how a university committee will perceive this project scope",
  "criticalVulnerabilities": [
    "Vulnerability 1 that examiners will target immediately",
    "Vulnerability 2 in the chosen stack or design"
  ],
  "questions": [
    {
      "id": "q1",
      "question": "Specific, probing technical question directly citing their stack and pitch",
      "category": "Architecture & Stack" | "Scalability & Performance" | "Security & Edge Cases" | "Data & Algorithmic Trade-offs" | "Academic Novelty",
      "examinerIntent": "Underlying intention behind this cross-examination question",
      "trapToAvoid": "Amateur answer or trap that leads to aggressive follow-ups",
      "modelAnswer": "Comprehensive, technical, and confident model response to score maximum marks"
    }
  ]
}`;

    const user = `<STUDENT_CAPSTONE_DEFENSE>
Project Title: ${idea.title}
Concept Pitch: ${idea.pitch}
Tech Stack: ${idea.intendedTech || 'Not specified'}
Target Users / Domain: ${idea.targetAudience || 'General CS/IT'}
</STUDENT_CAPSTONE_DEFENSE>

Generate 5 rigorous, project-specific Viva defense questions with examiner traps and model defense answers.`;

    return { system, user };
  }
}
