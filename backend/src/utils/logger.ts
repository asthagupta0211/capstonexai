import { env } from '../config/env.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  public silentNonErrorsInTest: boolean;

  constructor(silentNonErrorsInTest = true) {
    this.silentNonErrorsInTest = silentNonErrorsInTest;
  }

  private isTest(): boolean {
    return env.NODE_ENV === 'test';
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): void {
    if (this.isTest() && this.silentNonErrorsInTest && level !== 'error') {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        if (!env.IS_PRODUCTION) {
          console.debug(`${prefix} 🔍 ${message}`, ...args);
        }
        break;
      case 'info':
        console.log(`${prefix} ℹ️ ${message}`, ...args);
        break;
      case 'warn':
        console.warn(`${prefix} ⚠️ ${message}`, ...args);
        break;
      case 'error':
        console.error(`${prefix} ❌ ${message}`, ...args);
        break;
    }
  }

  debug(message: string, ...args: any[]): void {
    this.formatMessage('debug', message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.formatMessage('info', message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.formatMessage('warn', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.formatMessage('error', message, ...args);
  }
}

export const logger = new Logger(true);
