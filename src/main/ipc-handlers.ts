import { ipcMain, shell, BrowserWindow } from 'electron';
import { IPC } from '../shared/ipc-channels';
import { fetchNews } from './api/news-api';
import { getStatus } from './api/rate-limiter';
import { clearCache } from './api/cache';
import { getSettings, setSetting, setSettings, getSetting } from './store';
import { setAutoStart } from './autostart';
import { setActiveView, restartScheduler } from './scheduler';
import { Category, Language, Subcategory, AppSettings } from '../shared/types';

export function registerIpcHandlers(mainWindow: BrowserWindow): void {
  // News
  ipcMain.handle(IPC.NEWS_FETCH, async (_event, category: Category, subcategory: Subcategory, language: Language, pageSize?: number) => {
    try {
      return await fetchNews(category, subcategory, language, pageSize);
    } catch (err: any) {
      return { error: err.message };
    }
  });

  // Rate limit
  ipcMain.handle(IPC.RATE_LIMIT_STATUS, () => {
    return getStatus();
  });

  // Settings
  ipcMain.handle(IPC.SETTINGS_GET_ALL, () => {
    return getSettings();
  });

  ipcMain.handle(IPC.SETTINGS_GET, (_event, key: keyof AppSettings) => {
    return getSetting(key);
  });

  ipcMain.handle(IPC.SETTINGS_SET, (_event, key: keyof AppSettings, value: any) => {
    setSetting(key, value);

    // Handle side effects
    if (key === 'autoStart') {
      setAutoStart(value as boolean);
    }
    if (key === 'language') {
      clearCache();
    }
    if (key === 'refreshInterval') {
      restartScheduler(mainWindow);
    }

    return true;
  });

  // Window controls
  ipcMain.handle(IPC.WINDOW_MINIMIZE, () => {
    mainWindow.minimize();
  });

  ipcMain.handle(IPC.WINDOW_MAXIMIZE, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
    return mainWindow.isMaximized();
  });

  ipcMain.handle(IPC.WINDOW_CLOSE, () => {
    const settings = getSettings();
    if (settings.minimizeToTray) {
      mainWindow.hide();
    } else {
      mainWindow.close();
    }
  });

  ipcMain.handle(IPC.WINDOW_IS_MAXIMIZED, () => {
    return mainWindow.isMaximized();
  });

  // External links
  ipcMain.handle(IPC.OPEN_EXTERNAL, (_event, url: string) => {
    shell.openExternal(url);
  });

  // Scheduler
  ipcMain.handle(IPC.SCHEDULER_SET_ACTIVE, (_event, category: Category, subcategory: Subcategory) => {
    setActiveView(category, subcategory);
  });
}
