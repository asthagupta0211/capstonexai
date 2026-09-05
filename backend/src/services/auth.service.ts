import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { env } from '../config/env.js';

export interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export class AuthService {
  private static ensureDbConnected() {
    if (!isDbConnected()) {
      throw new Error(
        'Database is not connected. Please ensure your MONGODB_URI in .env is configured and pointing to your MongoDB Atlas cluster.'
      );
    }
  }

  /**
   * Registers a new user strictly in MongoDB Atlas
   */
  static async register(email: string, password: string, name: string): Promise<AuthResult> {
    this.ensureDbConnected();
    const trimmedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: trimmedEmail,
      passwordHash,
      name: name.trim(),
    });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name },
    };
  }

  /**
   * Authenticates an existing user strictly via MongoDB Atlas
   */
  static async login(email: string, password: string): Promise<AuthResult> {
    this.ensureDbConnected();
    const trimmedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name },
    };
  }
}
