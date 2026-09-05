import { describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../app.js';
import { env } from '../config/env.js';

describe('Viva Voce Defense Simulator API Endpoint', () => {
  it('rejects unauthenticated requests with 401', async () => {
    const res = await request(app)
      .post('/api/v1/viva/simulate')
      .send({
        title: 'Smart Health Monitoring',
        pitch: 'IoT sensors collecting heart rate telemetry for arrhythmia detection.',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects requests with missing title or pitch with 400 Bad Request', async () => {
    const testToken = jwt.sign(
      { id: 'viva_tester_123', email: 'viva@university.edu', name: 'Viva Candidate' },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .post('/api/v1/viva/simulate')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        title: '',
        pitch: '',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('required');
  });
});
