import { describe, it, expect } from 'vitest';
import { AiValidator } from '../ai/validator.js';
import { z } from 'zod';

describe('AiValidator', () => {
  it('strips markdown code fences from JSON strings', () => {
    const raw = '```json\n{"name": "test"}\n```';
    const cleaned = AiValidator.cleanJsonString(raw);
    expect(cleaned).toBe('{"name": "test"}');
  });

  it('extracts embedded JSON between braces even with surrounding conversational chatter', () => {
    const raw = 'Here is your project recommendation:\n{"name": "Project Alpha"}\nI hope this helps your studies!';
    const cleaned = AiValidator.cleanJsonString(raw);
    expect(cleaned).toBe('{"name": "Project Alpha"}');
  });

  it('validates a schema successfully', () => {
    const schema = z.object({ title: z.string(), score: z.number() });
    const res = AiValidator.validate('{"title": "AI Sentinel", "score": 95}', schema);
    expect(res.success).toBe(true);
    expect(res.data?.title).toBe('AI Sentinel');
    expect(res.data?.score).toBe(95);
  });

  it('unwraps array-wrapped objects automatically when schema expects an object', () => {
    const schema = z.object({ title: z.string(), score: z.number() });
    const res = AiValidator.validate('[{"title": "AI Sentinel", "score": 95}]', schema);
    expect(res.success).toBe(true);
    expect(res.data?.title).toBe('AI Sentinel');
    expect(res.data?.score).toBe(95);
  });

  it('unwraps nested wrapper keys like plan or blueprint automatically', () => {
    const schema = z.object({ title: z.string(), score: z.number() });
    const res = AiValidator.validate('{"blueprint": {"title": "AI Sentinel", "score": 95}}', schema);
    expect(res.success).toBe(true);
    expect(res.data?.title).toBe('AI Sentinel');
  });

  it('rejects invalid JSON structure gracefully without throwing unhandled exceptions', () => {
    const schema = z.object({ title: z.string() });
    const res = AiValidator.validate('{"title": 12345}', schema);
    expect(res.success).toBe(false);
    expect(res.error).toContain('Schema validation failed');
  });
});
