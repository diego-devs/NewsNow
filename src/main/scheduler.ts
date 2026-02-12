import { BrowserWindow } from 'electron';
import { fetchNews, getNewArticleIds } from './api/news-api';
import { getSettings } from './store';
import { sendNewArticleNotification } from './notifications';
import { Category, Language, Subcategory } from '../shared/types';
import { IPC } from '../shared/ipc-channels';
import { canMakeRequest } from './api/rate-limiter';

let refreshTimer: ReturnType<typeof setInterval> | null = null;
let activeCategory: Category = 'technology';
let activeSubcategory: Subcategory = 'ai';

export function setActiveView(category: Category, subcategory: Subcategory): void {
  activeCategory = category;
  activeSubcategory = subcategory;
}

export function startScheduler(mainWindow: BrowserWindow): void {
  stopScheduler();
  const settings = getSettings();
  const intervalMs = settings.refreshInterval * 60 * 1000;

  refreshTimer = setInterval(async () => {
    if (!canMakeRequest(true)) return;

    const settings = getSettings();
    try {
      const response = await fetchNews(
        activeCategory,
        activeSubcategory,
        settings.language,
        settings.articlesPerPage,
        true
      );

      // Find new articles
      const newIds = getNewArticleIds(
        activeCategory,
        activeSubcategory,
        settings.language,
        response.articles
      );

      // Send update to renderer
      if (!mainWindow.isDestroyed()) {
        mainWindow.webContents.send(IPC.NEWS_UPDATED, {
          category: activeCategory,
          subcategory: activeSubcategory,
          response,
        });

        // Send notifications for new articles
        if (settings.notificationsEnabled && newIds.length > 0) {
          const newArticles = response.articles.filter(a => newIds.includes(a.id));
          sendNewArticleNotification(newArticles, settings.language, mainWindow);
        }
      }
    } catch (err) {
      console.error('Auto-refresh failed:', err);
    }
  }, intervalMs);
}

export function stopScheduler(): void {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

export function restartScheduler(mainWindow: BrowserWindow): void {
  startScheduler(mainWindow);
}
