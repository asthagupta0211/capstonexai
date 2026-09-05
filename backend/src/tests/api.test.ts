import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('API Endpoints - Integration & Robustness Tests', () => {
  describe('GET /api/v1/health', () => {
    it('returns system health status and configuration details with 200 OK', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.environment).toBeDefined();
      expect(res.body.data.timestamp).toBeDefined();
    });
  });

  describe('CORS and Preflight Handling', () => {
    it('handles OPTIONS preflight requests successfully', async () => {
      const res = await request(app)
        .options('/api/v1/health')
        .set('Origin', 'http://localhost:5173')
        .set('Access-Control-Request-Method', 'GET');
      
      expect(res.status).toBe(204);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });
  });

  describe('Authentication Protected Endpoints', () => {
    it('blocks access to protected endpoints without a token with 401', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });

    it('blocks access to protected endpoints with an invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid_token_12345');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Validation on Auth Endpoints', () => {
    it('rejects registration with missing email or password with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: '' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects login with missing credentials with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Non-existent API Routes', () => {
    it('returns 404 JSON for unknown API paths', async () => {
      const res = await request(app).get('/api/v1/unknown-endpoint-404');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
