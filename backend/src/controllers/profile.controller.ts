import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service.js';

export class ProfileController {
  static async upsert(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      const {
        skills,
        interests,
        preferredDomain,
        difficultyLevel,
        availableWeeks,
        hoursPerWeek,
        preferredTech,
        projectConstraints,
      } = req.body;

      if (!skills || !Array.isArray(skills)) {
        res.status(400).json({ success: false, error: 'Skills array is required.' });
        return;
      }

      const profile = await ProfileService.upsertProfile(userId, {
        skills,
        interests: interests || [],
        preferredDomain: preferredDomain || 'Artificial Intelligence & Machine Learning',
        difficultyLevel: difficultyLevel || 'Intermediate',
        availableWeeks: Number(availableWeeks) || 12,
        hoursPerWeek: Number(hoursPerWeek) || 15,
        preferredTech: preferredTech || [],
        projectConstraints: projectConstraints || [],
      });

      res.status(200).json({ success: true, data: { profile } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to update student profile.' });
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      const profile = await ProfileService.getProfile(userId);
      res.status(200).json({ success: true, data: { profile } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || 'Failed to retrieve profile.' });
    }
  }
}
