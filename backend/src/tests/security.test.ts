import { describe, it, expect } from 'vitest';
import { noSqlSanitizer } from '../middleware/sanitize.js';

describe('Security & Sanitization Middleware', () => {
  it('should strip malicious MongoDB operators starting with $ from request body', () => {
    const req: any = {
      body: {
        username: 'student@capstonex.ai',
        $where: 'this.password.length > 0',
        nested: {
          $gt: '',
          safeField: 'valid_data',
        },
      },
    };
    const res: any = {};
    const next = () => {};

    noSqlSanitizer(req, res, next);

    expect(req.body.username).toBe('student@capstonex.ai');
    expect(req.body.$where).toBeUndefined();
    expect(req.body.nested.$gt).toBeUndefined();
    expect(req.body.nested.safeField).toBe('valid_data');
  });

  it('should strip dot-notation keys from request query to block prototype pollution', () => {
    const req: any = {
      query: {
        'admin.role': 'superadmin',
        validFilter: 'ai',
      },
    };
    const res: any = {};
    const next = () => {};

    noSqlSanitizer(req, res, next);

    expect(req.query['admin.role']).toBeUndefined();
    expect(req.query.validFilter).toBe('ai');
  });
});
