import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryCache } from '../utils/cache.js';

describe('High-Performance MemoryCache Utility', () => {
  let cache: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache(5); // Small size for testing LRU
  });

  it('should store and retrieve values within TTL', () => {
    cache.set('key1', 'value1', 5000);
    expect(cache.get('key1')).toBe('value1');
  });

  it('should return null for expired entries', async () => {
    cache.set('key2', 'value2', 10); // 10ms TTL
    await new Promise((resolve) => setTimeout(resolve, 25));
    expect(cache.get('key2')).toBeNull();
  });

  it('should invalidate entries explicitly', () => {
    cache.set('key3', { test: true }, 5000);
    expect(cache.del('key3')).toBe(true);
    expect(cache.get('key3')).toBeNull();
  });

  it('should invalidate keys matching a specific prefix', () => {
    cache.set('ideas:user1:all', [1, 2, 3], 5000);
    cache.set('ideas:user1:saved', [1], 5000);
    cache.set('ideas:user2:all', [4, 5], 5000);

    cache.invalidatePrefix('ideas:user1:');

    expect(cache.get('ideas:user1:all')).toBeNull();
    expect(cache.get('ideas:user1:saved')).toBeNull();
    expect(cache.get('ideas:user2:all')).toEqual([4, 5]);
  });

  it('should respect maximum entry boundaries and evict oldest keys (LRU)', () => {
    for (let i = 1; i <= 6; i++) {
      cache.set(`k${i}`, `v${i}`, 5000);
    }
    // Size is limited to 5
    expect(cache.size()).toBe(5);
    // Oldest key k1 should be evicted
    expect(cache.get('k1')).toBeNull();
    expect(cache.get('k6')).toBe('v6');
  });
});
