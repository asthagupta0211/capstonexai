import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ success: false, error: 'Email, password, and name are required.' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
        return;
      }

      const result = await AuthService.register(email, password, name);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Registration failed.' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required.' });
        return;
      }

      const result = await AuthService.login(email, password);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(401).json({ success: false, error: error.message || 'Authentication failed.' });
    }
  }

  static async getMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated.' });
      return;
    }
    res.status(200).json({ success: true, data: { user: req.user } });
  }
}
