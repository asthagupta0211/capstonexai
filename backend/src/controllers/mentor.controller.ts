import { Request, Response } from 'express';
import { MentorService } from '../services/mentor.service.js';

export class MentorController {
  static async analyze(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      const title = req.body.title;
      const pitch = req.body.pitch || req.body.description || req.body.concept;
      const intendedTech = req.body.intendedTech || (Array.isArray(req.body.teamSkills) ? req.body.teamSkills.join(', ') : req.body.teamSkills) || req.body.skills || req.body.techStack;
      const targetAudience = req.body.targetAudience || req.body.domain || req.body.targetUsers;

      if (!title || !pitch) {
        res.status(400).json({
          success: false,
          error: 'Project title and concept / pitch are required for AI Mentor critique.',
        });
        return;
      }

      const result = await MentorService.analyzeIdea(userId, {
        title,
        pitch,
        intendedTech: typeof intendedTech === 'string' ? intendedTech : JSON.stringify(intendedTech),
        targetAudience,
      });

      res.status(200).json({
        success: true,
        data: {
          review: result.review,
          modelUsed: result.modelUsed,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to analyze project idea.' });
    }
  }

  static async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      const reviews = await MentorService.listReviews(userId);
      res.status(200).json({ success: true, data: { reviews } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch reviews.' });
    }
  }
}
