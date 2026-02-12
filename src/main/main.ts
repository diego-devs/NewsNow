import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import started from 'electron-squirrel-startup';
import { setApiKey } from './api/news-api';
import { registerIpcHandlers } from './ipc-handlers';
import { createTray } from './tray';
import { startScheduler, stopScheduler } from './scheduler';
import { isLaunchedHidden } from './autostart';
import { getSettings } from './store';

// Handle Squirrel startup events
if (started) {
  app.quit();
}

// Load .env file manually (Vite bundles main process, so require('dotenv') won't work)
function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), '.env'),
    path.join(app.getAppPath(), '.env'),
  ];
  for (const envPath of envPaths) {
    try {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex === -1) continue;
        const key = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
      break;
    } catch {
      // .env not found at this path, try next
    }
  }
}

loadEnv();

const apiKey = process.env.NEWSAPI_KEY || '';
if (apiKey) {
  setApiKey(apiKey);
}

let mainWindow: BrowserWindow | null = null;

const createWindow = (): BrowserWindow => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    backgroundColor: '#0a0a0b',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the app
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Show window when ready (unless launched hidden)
  mainWindow.once('ready-to-show', () => {
    if (!isLaunchedHidden()) {
      mainWindow!.show();
    }
  });

  // Handle close behavior - minimize to tray if setting enabled
  mainWindow.on('close', (event) => {
    const settings = getSettings();
    if (settings.minimizeToTray && mainWindow && !app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Register IPC handlers
  registerIpcHandlers(mainWindow);

  // Create system tray
  createTray(mainWindow);

  // Start auto-refresh scheduler
  startScheduler(mainWindow);

  return mainWindow;
};

// Extend app type to include isQuitting
declare module 'electron' {
  interface App {
    isQuitting: boolean;
  }
}
app.isQuitting = false;

app.on('before-quit', () => {
  app.isQuitting = true;
  stopScheduler();
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
