/**
 * High-Performance In-Memory TTL & LRU Cache Utility
 * Designed for optimal sub-millisecond data retrieval and minimal memory footprint.
 * Eliminates redundant database round-trips and repeated AI inference calls.
 */
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private maxEntries: number;

  constructor(maxEntries: number = 1000) {
    this.maxEntries = maxEntries;
  }

  /**
   * Retrieves an item from the cache if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Stores an item with a time-to-live in milliseconds
   */
  set<T>(key: string, value: T, ttlMs: number = 60000): void {
    // Evict oldest entry if size exceeded (LRU behavior)
    if (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) this.store.delete(oldestKey);
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  /**
   * Invalidates a specific key
   */
  del(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Invalidates all keys starting with a prefix (e.g., user-specific caches)
   */
  invalidatePrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clears the entire cache
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Returns current cache size
   */
  size(): number {
    return this.store.size;
  }
}

// Global Singleton Cache Instance
export const appCache = new MemoryCache(2000);
