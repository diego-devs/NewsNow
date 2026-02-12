export type Language = 'en' | 'es';

export type Category = 'technology' | 'politics';

export type TechSubcategory = 'ai' | 'agents' | 'automation' | 'software-dev' | 'cutting-edge' | 'ai-software';
export type PoliticsSubcategory = 'mexico' | 'usa' | 'europe';
export type Subcategory = TechSubcategory | PoliticsSubcategory;

export interface Article {
  id: string;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  source: string;
  publishedAt: string;
  category: Category;
  subcategory: Subcategory;
}

export interface NewsResponse {
  articles: Article[];
  totalResults: number;
  fetchedAt: number;
}

export interface AppSettings {
  language: Language;
  autoStart: boolean;
  refreshInterval: 15 | 30 | 60 | 120;
  notificationsEnabled: boolean;
  minimizeToTray: boolean;
  articlesPerPage: number;
  openInBrowser: boolean;
}

export interface CategoryConfig {
  id: Category;
  label: { en: string; es: string };
  icon: string;
  subcategories: SubcategoryConfig[];
}

export interface SubcategoryConfig {
  id: Subcategory;
  label: { en: string; es: string };
}

export interface RateLimitStatus {
  remaining: number;
  total: number;
  resetsAt: string;
}
