import { logger } from '../config/logger';

class CacheService {
  private inMemoryStore = new Map<string, { value: string; expiresAt: number }>();

  async get(key: string): Promise<string | null> {
    const entry = this.inMemoryStore.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.inMemoryStore.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
    this.inMemoryStore.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    this.inMemoryStore.delete(key);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const val = await this.get(`blacklist:${token}`);
    return val !== null;
  }

  async blacklistToken(token: string, ttlSeconds: number = 900): Promise<void> {
    await this.set(`blacklist:${token}`, 'revoked', ttlSeconds);
  }
}

export const cacheService = new CacheService();
