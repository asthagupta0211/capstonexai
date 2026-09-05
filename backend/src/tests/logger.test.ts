import { describe, it, expect, vi } from 'vitest';
import { Logger } from '../utils/logger.js';

describe('Logger Utility', () => {
  const testLogger = new Logger(false);

  it('formats and outputs info messages', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    testLogger.info('Test info message');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('formats and outputs warn messages', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    testLogger.warn('Test warn message');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('formats and outputs error messages', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    testLogger.error('Test error message');
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
