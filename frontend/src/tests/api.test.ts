import { describe, it, expect, beforeEach } from 'vitest';
import { api } from '../services/api.js';

// Setup Mock LocalStorage for testing environment
const mockStorage: Record<string, string> = {};
(globalThis as any).localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, val: string) => { mockStorage[key] = val; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => {
    for (const k in mockStorage) delete mockStorage[k];
  },
  length: 0,
  key: () => null,
};

describe('Frontend API Client Service', () => {
  beforeEach(() => {
    localStorage.clear();
    api.logout();
  });

  it('should initialize with no token if localStorage is empty', () => {
    expect(api.getToken()).toBeNull();
  });

  it('should save token into localStorage and retrieve it', () => {
    api.setToken('test_jwt_token_12345');
    expect(api.getToken()).toBe('test_jwt_token_12345');
    expect(localStorage.getItem('capstonex_token')).toBe('test_jwt_token_12345');
  });

  it('should clear token and active session on logout', () => {
    api.setToken('test_token');
    api.logout();
    expect(api.getToken()).toBeNull();
    expect(localStorage.getItem('capstonex_token')).toBeNull();
  });

  it('should correctly format authorization headers with Bearer token', () => {
    api.setToken('secure_token');
    const headers = (api as any).getHeaders();
    expect(headers['Authorization']).toBe('Bearer secure_token');
    expect(headers['Content-Type']).toBe('application/json');
  });
});
