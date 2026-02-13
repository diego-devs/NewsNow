import { Tray, Menu, BrowserWindow, app, nativeImage } from 'electron';
import path from 'node:path';

let tray: Tray | null = null;

function createTrayIcon(): Electron.NativeImage {
  // Try to load icon file first
  const iconPaths = [
    path.join(process.cwd(), 'assets', 'icons', 'tray-icon.ico'),
    path.join(app.getAppPath(), 'assets', 'icons', 'tray-icon.ico'),
  ];

  for (const iconPath of iconPaths) {
    try {
      const icon = nativeImage.createFromPath(iconPath);
      if (!icon.isEmpty()) return icon;
    } catch {
      // try next
    }
  }

  // Create a 16x16 SVG-based icon as fallback
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <rect width="16" height="16" rx="3" fill="#6366f1"/>
    <text x="8" y="12" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold" font-size="11">N</text>
  </svg>`;

  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  return nativeImage.createFromDataURL(dataUrl);
}

export function createTray(mainWindow: BrowserWindow): Tray {
  const trayIcon = createTrayIcon();
  tray = new Tray(trayIcon);
  tray.setToolTip('NewsNow');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show NewsNow',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      },
    },
    {
      label: 'Settings',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
        mainWindow.webContents.send('navigate:settings');
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.exit(0);
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  return tray;
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}
