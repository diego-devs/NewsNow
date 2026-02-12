import { app } from 'electron';

export function setAutoStart(enabled: boolean): void {
  app.setLoginItemSettings({
    openAtLogin: enabled,
    args: enabled ? ['--hidden'] : [],
  });
}

export function getAutoStartEnabled(): boolean {
  return app.getLoginItemSettings().openAtLogin;
}

export function isLaunchedHidden(): boolean {
  return process.argv.includes('--hidden');
}
