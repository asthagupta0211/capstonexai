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
   * Parses and validates raw LLM output against a Zod schema with intelligent unwrapping
   */
  static validate<T>(raw: string, schema: ZodSchema<T>): { success: boolean; data?: T; error?: string } {
    try {
      const cleaned = this.cleanJsonString(raw);
      const parsedJson = JSON.parse(cleaned);

      // Attempt 1: Direct validation
      const direct = schema.safeParse(parsedJson);
      if (direct.success) {
        return { success: true, data: direct.data };
      }

      // Attempt 2: If parsedJson is an Array, unwrap elements or wrap as ideas
      if (Array.isArray(parsedJson)) {
        // Try each element in the array if it is an object matching the schema
        for (const item of parsedJson) {
          if (item && typeof item === 'object' && !Array.isArray(item)) {
            const itemParsed = schema.safeParse(item);
            if (itemParsed.success) {
              return { success: true, data: itemParsed.data };
            }
          }
        }

        // Try wrapping as ideas array: { ideas: [...] }
        const wrappedIdeas = schema.safeParse({ ideas: parsedJson });
        if (wrappedIdeas.success) {
          return { success: true, data: wrappedIdeas.data };
        }
      }

      // Attempt 3: If parsedJson is an object with nested wrapper keys
      if (parsedJson && typeof parsedJson === 'object' && !Array.isArray(parsedJson)) {
        const candidateKeys = ['plan', 'blueprint', 'data', 'result', 'projectPlan', 'response', 'output'];
        for (const key of candidateKeys) {
          if (parsedJson[key] && typeof parsedJson[key] === 'object') {
            const nestedParsed = schema.safeParse(parsedJson[key]);
            if (nestedParsed.success) {
              return { success: true, data: nestedParsed.data };
            }
          }
        }
      }

      // If all attempts failed, report the specific Zod issues
      const issues = direct.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      return { success: false, error: `Schema validation failed: ${issues}` };
    } catch (err: any) {
      if (err instanceof ZodError) {
        const issues = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
        return { success: false, error: `Schema validation failed: ${issues}` };
      }
      return { success: false, error: `JSON parse failed: ${err.message}` };
    }
  }
}
