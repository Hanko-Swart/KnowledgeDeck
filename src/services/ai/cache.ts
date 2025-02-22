import { AIResponse } from '@/types/ai';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class AICache {
  private static readonly CACHE_KEY = 'knowledgeDeck_aiCache';
  private static readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

  static async get<T>(key: string): Promise<T | null> {
    const cache = await this.getCache();
    const entry = cache[key] as CacheEntry<T> | undefined;
    
    if (!entry || Date.now() > entry.expiresAt) {
      return null;
    }
    
    return entry.data;
  }

  static async set<T>(key: string, data: T, ttl = this.DEFAULT_TTL): Promise<void> {
    const cache = await this.getCache();
    cache[key] = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    };
    await chrome.storage.local.set({ [this.CACHE_KEY]: cache });
  }

  static async clear(): Promise<void> {
    await chrome.storage.local.remove(this.CACHE_KEY);
  }

  private static async getCache(): Promise<Record<string, CacheEntry<unknown>>> {
    const result = await chrome.storage.local.get(this.CACHE_KEY);
    return result[this.CACHE_KEY] || {};
  }

  static createKey(prefix: string, content: string): string {
    // Create a simple hash of the content
    const hash = content
      .slice(0, 100) // Take first 100 chars
      .replace(/\s+/g, '')
      .toLowerCase();
    return `${prefix}_${hash}`;
  }
} 