import { net } from 'electron';
import { NewsAPIResponse, FetchParams } from './types';
import { canMakeRequest, recordRequest } from './rate-limiter';
import { getCacheKey, getFromCache, setInCache, getCachedArticleIds } from './cache';
import { Article, Category, Language, NewsResponse, Subcategory } from '../../shared/types';

const BASE_URL = 'https://newsapi.org/v2';

let apiKey = '';

export function setApiKey(key: string): void {
  apiKey = key;
}

const TECH_KEYWORDS: Record<string, { en: string; es: string }> = {
  ai: {
    en: 'artificial intelligence OR "machine learning" OR "deep learning" OR GPT OR LLM',
    es: 'inteligencia artificial OR "aprendizaje automático" OR "aprendizaje profundo" OR GPT OR LLM',
  },
  agents: {
    en: 'AI agents OR "autonomous agents" OR "agentic AI" OR "AI assistant"',
    es: 'agentes IA OR "agentes autónomos" OR "IA agéntica" OR "asistente IA"',
  },
  automation: {
    en: 'automation OR RPA OR "robotic process" OR "workflow automation" OR "no-code"',
    es: 'automatización OR RPA OR "proceso robótico" OR "automatización flujos" OR "sin código"',
  },
  'software-dev': {
    en: 'software development OR programming OR "developer tools" OR DevOps OR GitHub',
    es: 'desarrollo software OR programación OR "herramientas desarrollo" OR DevOps OR GitHub',
  },
  'cutting-edge': {
    en: 'quantum computing OR robotics OR "brain-computer" OR biotech OR nanotech OR "space technology"',
    es: 'computación cuántica OR robótica OR "interfaz cerebro" OR biotecnología OR nanotecnología OR "tecnología espacial"',
  },
  'ai-software': {
    en: 'ChatGPT OR Claude OR Copilot OR Midjourney OR "Stable Diffusion" OR "AI tools"',
    es: 'ChatGPT OR Claude OR Copilot OR Midjourney OR "Stable Diffusion" OR "herramientas IA"',
  },
};

const POLITICS_KEYWORDS: Record<string, { en: string; es: string }> = {
  mexico: {
    en: 'Mexico politics OR "Mexican government" OR "Mexico president" OR "Mexico congress"',
    es: 'política México OR "gobierno México" OR "presidente México" OR "congreso México"',
  },
  usa: {
    en: 'US politics OR "White House" OR Congress OR Senate OR "US president"',
    es: 'política Estados Unidos OR "Casa Blanca" OR Congreso OR Senado OR "presidente EEUU"',
  },
  europe: {
    en: 'European politics OR "European Union" OR EU OR "European parliament" OR Brexit',
    es: 'política europea OR "Unión Europea" OR UE OR "parlamento europeo" OR Brexit',
  },
};

const POLITICS_COUNTRIES: Record<string, string> = {
  mexico: 'mx',
  usa: 'us',
};

function buildUrl(params: FetchParams): string {
  const url = new URL(`${BASE_URL}/${params.endpoint}`);
  if (params.q) url.searchParams.set('q', params.q);
  if (params.language) url.searchParams.set('language', params.language);
  if (params.country) url.searchParams.set('country', params.country);
  if (params.category) url.searchParams.set('category', params.category);
  if (params.sortBy) url.searchParams.set('sortBy', params.sortBy);
  if (params.pageSize) url.searchParams.set('pageSize', String(params.pageSize));
  if (params.page) url.searchParams.set('page', String(params.page));
  url.searchParams.set('apiKey', apiKey);
  return url.toString();
}

async function fetchFromAPI(params: FetchParams): Promise<NewsAPIResponse> {
  const url = buildUrl(params);
  return new Promise((resolve, reject) => {
    const request = net.request(url);
    let body = '';
    request.on('response', (response) => {
      response.on('data', (chunk) => {
        body += chunk.toString();
      });
      response.on('end', () => {
        try {
          const data = JSON.parse(body) as NewsAPIResponse;
          if (data.status === 'error') {
            reject(new Error((data as any).message || 'NewsAPI error'));
          } else {
            resolve(data);
          }
        } catch {
          reject(new Error('Failed to parse NewsAPI response'));
        }
      });
    });
    request.on('error', reject);
    request.end();
  });
}

function toArticle(
  raw: NewsAPIResponse['articles'][0],
  category: Category,
  subcategory: Subcategory
): Article {
  return {
    id: `${raw.url}-${raw.publishedAt}`,
    title: raw.title,
    description: raw.description,
    url: raw.url,
    urlToImage: raw.urlToImage,
    source: raw.source.name,
    publishedAt: raw.publishedAt,
    category,
    subcategory,
  };
}

export async function fetchNews(
  category: Category,
  subcategory: Subcategory,
  language: Language,
  pageSize = 20,
  isAutoRefresh = false
): Promise<NewsResponse> {
  const cacheKey = getCacheKey(category, subcategory, language);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  if (!canMakeRequest(isAutoRefresh)) {
    throw new Error('Daily API rate limit reached. Try again tomorrow.');
  }

  if (!apiKey) {
    throw new Error('NewsAPI key not configured. Add NEWSAPI_KEY to your .env file.');
  }

  let params: FetchParams;

  if (category === 'technology') {
    const keywords = TECH_KEYWORDS[subcategory];
    params = {
      endpoint: 'everything',
      q: keywords ? keywords[language] : 'technology',
      language,
      sortBy: 'publishedAt',
      pageSize,
    };
  } else {
    // Politics
    const countryCode = POLITICS_COUNTRIES[subcategory];
    if (countryCode && language === 'es' && subcategory === 'mexico') {
      // Use top-headlines for Mexico in Spanish (native)
      params = {
        endpoint: 'top-headlines',
        country: countryCode,
        category: 'general',
        pageSize,
      };
    } else if (countryCode && language === 'en' && subcategory === 'usa') {
      // Use top-headlines for USA in English (native)
      params = {
        endpoint: 'top-headlines',
        country: countryCode,
        category: 'general',
        pageSize,
      };
    } else {
      // Use everything with keywords for cross-language politics
      const keywords = POLITICS_KEYWORDS[subcategory];
      params = {
        endpoint: 'everything',
        q: keywords ? keywords[language] : 'politics',
        language,
        sortBy: 'publishedAt',
        pageSize,
      };
    }
  }

  recordRequest();
  const response = await fetchFromAPI(params);

  const articles = response.articles
    .filter(a => a.title && a.title !== '[Removed]')
    .map(a => toArticle(a, category, subcategory));

  const result: NewsResponse = {
    articles,
    totalResults: response.totalResults,
    fetchedAt: Date.now(),
  };

  setInCache(cacheKey, result);
  return result;
}

export function getNewArticleIds(
  category: Category,
  subcategory: Subcategory,
  language: Language,
  currentArticles: Article[]
): string[] {
  const cacheKey = getCacheKey(category, subcategory, language);
  const previousIds = getCachedArticleIds(cacheKey);
  if (previousIds.size === 0) return [];
  return currentArticles
    .filter(a => !previousIds.has(a.id))
    .map(a => a.id);
}
