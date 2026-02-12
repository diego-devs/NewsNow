import { AppSettings, CategoryConfig } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  autoStart: false,
  refreshInterval: 30,
  notificationsEnabled: true,
  minimizeToTray: true,
  articlesPerPage: 20,
  openInBrowser: true,
};

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'technology',
    label: { en: 'Technology', es: 'Tecnología' },
    icon: '💻',
    subcategories: [
      { id: 'ai', label: { en: 'AI', es: 'IA' } },
      { id: 'agents', label: { en: 'Agents', es: 'Agentes' } },
      { id: 'automation', label: { en: 'Automation', es: 'Automatización' } },
      { id: 'software-dev', label: { en: 'Software Dev', es: 'Desarrollo' } },
      { id: 'cutting-edge', label: { en: 'Cutting Edge', es: 'Vanguardia' } },
      { id: 'ai-software', label: { en: 'AI Software', es: 'Software IA' } },
    ],
  },
  {
    id: 'politics',
    label: { en: 'Politics', es: 'Política' },
    icon: '🏛️',
    subcategories: [
      { id: 'mexico', label: { en: 'Mexico', es: 'México' } },
      { id: 'usa', label: { en: 'USA', es: 'EE.UU.' } },
      { id: 'europe', label: { en: 'Europe', es: 'Europa' } },
    ],
  },
];

export const CACHE_TTL_MS = 35 * 60 * 1000; // 35 minutes
export const DAILY_API_LIMIT = 100;
export const RESERVED_CALLS = 30;
