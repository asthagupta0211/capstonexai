import { ZodSchema, ZodError } from 'zod';

export class AiValidator {
  /**
   * Sanitizes raw LLM string by stripping markdown fences and extracting clean JSON
   */
  static cleanJsonString(raw: string): string {
    let cleaned = raw.trim();

    // Strip markdown code fences if present
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
      cleaned = cleaned.replace(/\s*```$/, '');
      cleaned = cleaned.trim();
    }

    // Try extracting JSON substring between first { or [ and last } or ]
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let startIdx = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace;
    } else if (firstBracket !== -1) {
      startIdx = firstBracket;
    }

    if (startIdx !== -1) {
      const lastBrace = cleaned.lastIndexOf('}');
      const lastBracket = cleaned.lastIndexOf(']');
      const endIdx = Math.max(lastBrace, lastBracket);
      if (endIdx > startIdx) {
        cleaned = cleaned.substring(startIdx, endIdx + 1);
      }
    }

    return cleaned;
  }

  /**
   * Parses and validates raw LLM output against a strict Zod schema
   */
  static validate<T>(raw: string, schema: ZodSchema<T>): { success: boolean; data?: T; error?: string } {
    try {
      const cleaned = this.cleanJsonString(raw);
      const parsedJson = JSON.parse(cleaned);
      const validated = schema.parse(parsedJson);
      return { success: true, data: validated };
    } catch (err: any) {
      if (err instanceof ZodError) {
        const issues = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
        return { success: false, error: `Schema validation failed: ${issues}` };
      }
      return { success: false, error: `JSON parse failed: ${err.message}` };
    }
  }
}
