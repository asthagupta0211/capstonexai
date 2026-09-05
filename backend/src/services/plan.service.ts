import { ProjectPlan, IProjectPlan } from '../models/ProjectPlan.js';
import { GenerationHistory } from '../models/GenerationHistory.js';
import { isDbConnected } from '../config/db.js';
import { GroqAiService } from '../ai/groqClient.js';
import { IdeaService } from './idea.service.js';

export class PlanService {
  private static ensureDbConnected() {
    if (!isDbConnected()) {
      throw new Error(
        'Database is not connected. Please ensure your MONGODB_URI in .env is configured and pointing to your MongoDB Atlas cluster.'
      );
    }
  }

  /**
   * Generates or fetches detailed project plan for an idea using live Groq LLM & MongoDB Atlas
   */
  static async generateOrGetPlan(ideaId: string, userId: string): Promise<{ plan: IProjectPlan; modelUsed: string }> {
    this.ensureDbConnected();

    const idea = await IdeaService.getIdeaById(ideaId, userId);
    if (!idea) {
      throw new Error('Project idea not found or access denied.');
    }

    // Check if plan already exists in MongoDB Atlas
    const existing = await ProjectPlan.findOne({ ideaId });
    if (existing) {
      return { plan: existing, modelUsed: 'cached-from-mongodb' };
    }

    // Generate new plan via live Groq LLM
    const startTime = Date.now();
    const { plan, modelUsed } = await GroqAiService.generatePlan({
      title: idea.title,
      pitch: idea.pitch,
      techStack: idea.techStackSummary || [],
      weeks: idea.estimatedScopeWeeks || 12,
    });
    const latencyMs = Date.now() - startTime;

    const created = await ProjectPlan.create({
      ideaId,
      ...plan,
    });

    try {
      await GenerationHistory.create({
        userId,
        actionType: 'CREATE_PLAN',
        profileSnapshot: { ideaId, title: idea.title },
        modelName: modelUsed,
        isFallback: false,
        latencyMs,
      });
    } catch {
      // Non-blocking
    }

    return { plan: created, modelUsed };
  }

  /**
   * Exports project plan as formatted Markdown
   */
  static async exportPlanAsMarkdown(ideaId: string, userId: string): Promise<string> {
    this.ensureDbConnected();
    const idea = await IdeaService.getIdeaById(ideaId, userId);
    if (!idea) {
      throw new Error('Project idea not found.');
    }

    const { plan } = await this.generateOrGetPlan(ideaId, userId);

    let md = `# Capstone Project Blueprint: ${idea.title}\n\n`;
    md += `> **One-Line Pitch:** ${idea.pitch}\n\n`;
    md += `## 1. Problem Statement\n${idea.problem}\n\n`;
    md += `## 2. Proposed Solution\n${idea.solution}\n\n`;
    md += `**Target Users:** ${idea.targetUsers.join(', ')}\n\n`;
    md += `**Why It Matters:** ${idea.whyItMatters}\n\n`;
    md += `## 3. Evaluation Metrics\n`;
    md += `- **Difficulty:** ${idea.difficulty}\n`;
    md += `- **Feasibility Score:** ${idea.feasibilityScore}/100\n`;
    md += `- **Impact Score:** ${idea.impactScore}/100\n`;
    md += `- **Novelty Score:** ${idea.noveltyScore}/100\n`;
    md += `- **Skill Fit Score:** ${idea.skillFitScore}/100\n`;
    md += `- **Demo Value Score:** ${idea.demoValueScore}/100\n`;
    md += `- **Estimated Duration:** ${idea.estimatedScopeWeeks} weeks\n\n`;

    md += `## 4. Feature Breakdown\n\n`;
    md += `### Must-Have Features (MVP)\n`;
    for (const f of plan.mustHaveFeatures) {
      md += `- **${f.title}** (${f.complexity} Complexity): ${f.description}\n`;
    }
    md += `\n### Good-to-Have Features\n`;
    for (const f of plan.goodToHaveFeatures) {
      md += `- **${f.title}** (${f.complexity} Complexity): ${f.description}\n`;
    }
    md += `\n### Future Scope Features\n`;
    for (const f of plan.futureFeatures) {
      md += `- **${f.title}** (${f.complexity} Complexity): ${f.description}\n`;
    }

    md += `\n## 5. Technology Stack & Rationale\n\n`;
    const tech = plan.techStackDetailed;
    if (tech) {
      if (tech.frontend?.length) md += `**Frontend:** ` + tech.frontend.map((t: any) => `${t.name} (*${t.rationale}*)`).join('; ') + `\n\n`;
      if (tech.backend?.length) md += `**Backend:** ` + tech.backend.map((t: any) => `${t.name} (*${t.rationale}*)`).join('; ') + `\n\n`;
      if (tech.database?.length) md += `**Database:** ` + tech.database.map((t: any) => `${t.name} (*${t.rationale}*)`).join('; ') + `\n\n`;
      if (tech.ai?.length) md += `**AI / Core Engine:** ` + tech.ai.map((t: any) => `${t.name} (*${t.rationale}*)`).join('; ') + `\n\n`;
      if (tech.apis?.length) md += `**APIs & Protocols:** ` + tech.apis.map((t: any) => `${t.name} (*${t.rationale}*)`).join('; ') + `\n\n`;
      if (tech.deployment?.length) md += `**Deployment:** ` + tech.deployment.map((t: any) => `${t.name} (*${t.rationale}*)`).join('; ') + `\n\n`;
      if (tech.tools?.length) md += `**Development Tools:** ` + tech.tools.map((t: any) => `${t.name} (*${t.rationale}*)`).join('; ') + `\n\n`;
    }

    md += `## 6. System Architecture Summary\n${plan.architectureSummary}\n\n`;

    md += `## 7. 10-Phase Development Roadmap\n\n`;
    for (const p of plan.roadmapPhases) {
      md += `### Phase ${p.phaseNum}: ${p.title} (${p.durationWeeks} Weeks)\n`;
      md += `**Key Tasks:**\n`;
      for (const t of p.tasks) md += `- ${t}\n`;
      md += `**Deliverables:**\n`;
      for (const d of p.deliverables) md += `- [ ] ${d}\n`;
      md += `\n`;
    }

    md += `## 8. Strategic Improvements\n`;
    for (const imp of plan.improvements) {
      md += `- ${imp}\n`;
    }

    return md;
  }
}
