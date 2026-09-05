import { Request, Response } from 'express';
import { IdeaService } from '../services/idea.service.js';
import { ProfileService } from '../services/profile.service.js';

export class IdeaController {
  static async generate(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      // Read profile either from nested body.profile, top-level body, or from saved profile
      let profile = req.body.profile || (req.body.skills ? req.body : null);
      if (!profile || !profile.skills || profile.skills.length === 0) {
        profile = await ProfileService.getProfile(userId);
      }

      if (!profile || !profile.skills || profile.skills.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Student profile with at least one skill is required before generating ideas.',
        });
        return;
      }

      const result = await IdeaService.generateIdeas(userId, profile);
      res.status(200).json({
        success: true,
        data: {
          ideas: result.ideas,
          modelUsed: result.modelUsed,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to generate project ideas.' });
    }
  }

  static async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      const onlySaved = req.query.saved === 'true';
      const ideas = await IdeaService.listIdeas(userId, onlySaved);
      res.status(200).json({ success: true, data: { ideas } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch ideas.' });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      const idea = await IdeaService.getIdeaById(id, userId);
      if (!idea) {
        res.status(404).json({ success: false, error: 'Project idea not found.' });
        return;
      }

      res.status(200).json({ success: true, data: { idea } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to fetch idea.' });
    }
  }

  static async toggleSave(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      const updated = await IdeaService.toggleSaveIdea(id, userId);
      res.status(200).json({ success: true, data: { idea: updated } });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Failed to toggle bookmark.' });
    }
  }

  static async remove(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      const deleted = await IdeaService.deleteIdea(id, userId);
      if (!deleted) {
        res.status(404).json({ success: false, error: 'Project idea not found or already removed.' });
        return;
      }

      res.status(200).json({ success: true, message: 'Idea removed successfully.' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to delete idea.' });
    }
  }
}
