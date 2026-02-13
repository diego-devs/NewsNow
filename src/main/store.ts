import { AppSettings } from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/defaults';

interface StoreSchema {
  settings: AppSettings;
  rateLimitDate: string;
  rateLimitCount: number;
}

// We cannot import electron-store at the top level because it calls
// app.getPath('userData') at module scope, which crashes before app.ready.
// Instead we use a simple JSON file store.
import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

let _data: StoreSchema | null = null;
let _filePath: string | null = null;

function getFilePath(): string {
  if (!_filePath) {
    _filePath = path.join(app.getPath('userData'), 'newsnow-config.json');
  }
  return _filePath;
}

function loadData(): StoreSchema {
  if (_data) return _data;
  try {
    const raw = fs.readFileSync(getFilePath(), 'utf-8');
    _data = { ...getDefaults(), ...JSON.parse(raw) };
  } catch {
    _data = getDefaults();
  }
  return _data;
}

function saveData(): void {
  if (!_data) return;
  try {
    fs.mkdirSync(path.dirname(getFilePath()), { recursive: true });
    fs.writeFileSync(getFilePath(), JSON.stringify(_data, null, 2));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

function getDefaults(): StoreSchema {
  return {
    settings: { ...DEFAULT_SETTINGS },
    rateLimitDate: new Date().toISOString().split('T')[0],
    rateLimitCount: 0,
  };
}

export function getSettings(): AppSettings {
  return loadData().settings;
}

export function getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
  return loadData().settings[key];
}

export function setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
  const data = loadData();
  data.settings[key] = value;
  saveData();
}

export function setSettings(settings: Partial<AppSettings>): void {
  const data = loadData();
  data.settings = { ...data.settings, ...settings };
  saveData();
}
