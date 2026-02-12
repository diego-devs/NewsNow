import Store from 'electron-store';
import { AppSettings } from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/defaults';

interface StoreSchema {
  settings: AppSettings;
  rateLimitDate: string;
  rateLimitCount: number;
}

const store = new Store<StoreSchema>({
  defaults: {
    settings: DEFAULT_SETTINGS,
    rateLimitDate: new Date().toISOString().split('T')[0],
    rateLimitCount: 0,
  },
});

export function getSettings(): AppSettings {
  return store.get('settings');
}

export function getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
  return store.get('settings')[key];
}

export function setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
  const settings = store.get('settings');
  settings[key] = value;
  store.set('settings', settings);
}

export function setSettings(settings: Partial<AppSettings>): void {
  const current = store.get('settings');
  store.set('settings', { ...current, ...settings });
}

export default store;
