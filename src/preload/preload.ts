import { contextBridge, ipcRenderer } from 'electron';
import { IPC } from '../shared/ipc-channels';
import type { AppSettings, Category, Language, Subcategory } from '../shared/types';

const api = {
  // News
  fetchNews: (category: Category, subcategory: Subcategory, language: Language, pageSize?: number) =>
    ipcRenderer.invoke(IPC.NEWS_FETCH, category, subcategory, language, pageSize),

  onNewsUpdated: (callback: (data: any) => void) => {
    const handler = (_event: any, data: any) => callback(data);
    ipcRenderer.on(IPC.NEWS_UPDATED, handler);
    return () => ipcRenderer.removeListener(IPC.NEWS_UPDATED, handler);
  },

  // Rate limit
  getRateLimitStatus: () => ipcRenderer.invoke(IPC.RATE_LIMIT_STATUS),

  // Settings
  getSettings: () => ipcRenderer.invoke(IPC.SETTINGS_GET_ALL),
  getSetting: (key: keyof AppSettings) => ipcRenderer.invoke(IPC.SETTINGS_GET, key),
  setSetting: (key: keyof AppSettings, value: any) => ipcRenderer.invoke(IPC.SETTINGS_SET, key, value),

  // Window controls
  minimizeWindow: () => ipcRenderer.invoke(IPC.WINDOW_MINIMIZE),
  maximizeWindow: () => ipcRenderer.invoke(IPC.WINDOW_MAXIMIZE),
  closeWindow: () => ipcRenderer.invoke(IPC.WINDOW_CLOSE),
  isMaximized: () => ipcRenderer.invoke(IPC.WINDOW_IS_MAXIMIZED),

  // External
  openExternal: (url: string) => ipcRenderer.invoke(IPC.OPEN_EXTERNAL, url),

  // Scheduler
  setActiveView: (category: Category, subcategory: Subcategory) =>
    ipcRenderer.invoke(IPC.SCHEDULER_SET_ACTIVE, category, subcategory),

  // Navigation events from tray
  onNavigateSettings: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('navigate:settings', handler);
    return () => ipcRenderer.removeListener('navigate:settings', handler);
  },
};

export type ElectronAPI = typeof api;

contextBridge.exposeInMainWorld('electronAPI', api);
