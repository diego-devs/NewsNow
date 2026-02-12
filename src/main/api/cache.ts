import { CACHE_TTL_MS } from '../../shared/defaults';
import { NewsResponse } from '../../shared/types';

interface CacheEntry {
  data: NewsResponse;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

export function getCacheKey(category: string, subcategory: string, language: string): string {
  return `${category}:${subcategory}:${language}`;
}

export function getFromCache(key: string): NewsResponse | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setInCache(key: string, data: NewsResponse): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

export function clearCache(): void {
  cache.clear();
}

export function invalidateByLanguage(language: string): void {
  for (const key of cache.keys()) {
    if (key.endsWith(`:${language}`)) {
      cache.delete(key);
    }
  }
}

export function getCachedArticleIds(key: string): Set<string> {
  const entry = cache.get(key);
  if (!entry) return new Set();
  return new Set(entry.data.articles.map(a => a.id));
}
