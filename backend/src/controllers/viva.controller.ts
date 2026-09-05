import { Request, Response } from 'express';
import { VivaService } from '../services/viva.service.js';

export class VivaController {
  static async simulate(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      const { title, pitch, intendedTech, targetAudience } = req.body;

      if (!title || !pitch) {
        res.status(400).json({
          success: false,
          error: 'Project title and pitch/concept are required to simulate a Viva Voce defense.',
        });
        return;
      }

      const result = await VivaService.simulateDefense(userId, {
        title: String(title).trim(),
        pitch: String(pitch).trim(),
        intendedTech: intendedTech ? String(intendedTech).trim() : undefined,
        targetAudience: targetAudience ? String(targetAudience).trim() : undefined,
      });

      res.status(200).json({
        success: true,
        data: {
          defense: result.defense,
          modelUsed: result.modelUsed,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate Viva Voce defense simulation.',
      });
    }
  }
}
