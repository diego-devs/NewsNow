import { Notification, BrowserWindow } from 'electron';
import { Article, Language } from '../shared/types';

const i18n = {
  en: {
    newArticles: 'New articles available',
    breakingNews: 'Breaking News',
    multipleArticles: (count: number) => `${count} new articles found`,
    clickToRead: 'Click to read',
  },
  es: {
    newArticles: 'Nuevos artículos disponibles',
    breakingNews: 'Noticias de última hora',
    multipleArticles: (count: number) => `${count} nuevos artículos encontrados`,
    clickToRead: 'Clic para leer',
  },
};

export function sendNewArticleNotification(
  articles: Article[],
  language: Language,
  mainWindow: BrowserWindow | null
): void {
  if (!Notification.isSupported()) return;
  if (articles.length === 0) return;

  const strings = i18n[language];

  if (articles.length > 3) {
    // Batch notification
    const notification = new Notification({
      title: strings.newArticles,
      body: strings.multipleArticles(articles.length),
      icon: undefined,
    });
    notification.on('click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
    notification.show();
  } else {
    // Individual notifications for 1-3 articles
    for (const article of articles) {
      const isBreaking = isBreakingNews(article);
      const notification = new Notification({
        title: isBreaking ? strings.breakingNews : strings.newArticles,
        body: article.title,
        icon: undefined,
      });
      notification.on('click', () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      });
      notification.show();
    }
  }
}

function isBreakingNews(article: Article): boolean {
  const publishedAt = new Date(article.publishedAt).getTime();
  const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
  return publishedAt > thirtyMinutesAgo;
}
