import { Tray, Menu, BrowserWindow, app, nativeImage } from 'electron';
import path from 'node:path';

let tray: Tray | null = null;

function createTrayIcon(): Electron.NativeImage {
  // Try to load icon file first
  const iconPath = path.join(
    app.isPackaged ? process.resourcesPath : process.cwd(),
    'assets', 'icons', 'tray-icon.ico'
  );

  try {
    const icon = nativeImage.createFromPath(iconPath);
    if (!icon.isEmpty()) return icon;
  } catch {
    // Fall through to programmatic icon
  }

  // Create a simple 16x16 programmatic icon (blue N on transparent)
  const size = 16;
  const canvas = Buffer.alloc(size * size * 4); // RGBA
  // Fill with a colored "N" shape pixel pattern
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const isN =
        (x >= 2 && x <= 4) || // left bar
        (x >= 11 && x <= 13) || // right bar
        (x >= 2 && x <= 13 && Math.abs(x - 2 - (y * 11) / 15) < 2); // diagonal
      if (isN && y >= 2 && y <= 13) {
        canvas[idx] = 99;     // R
        canvas[idx + 1] = 102; // G
        canvas[idx + 2] = 241; // B (accent color)
        canvas[idx + 3] = 255; // A
      } else {
        canvas[idx + 3] = 0; // transparent
      }
    }
  }

  return nativeImage.createFromBuffer(canvas, { width: size, height: size });
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
