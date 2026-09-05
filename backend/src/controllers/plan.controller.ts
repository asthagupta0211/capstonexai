import { Request, Response } from 'express';
import { PlanService } from '../services/plan.service.js';

export class PlanController {
  static async generateOrGet(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id; // ideaId
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      const result = await PlanService.generateOrGetPlan(id, userId);
      res.status(200).json({
        success: true,
        data: {
          plan: result.plan,
          modelUsed: result.modelUsed,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to generate project blueprint.' });
    }
  }

  static async exportMarkdown(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      const markdown = await PlanService.exportPlanAsMarkdown(id, userId);
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', `attachment; filename="capstone_blueprint_${id}.md"`);
      res.send(markdown);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to export project blueprint.' });
    }
  }
}
