export const IPC = {
  NEWS_FETCH: 'news:fetch',
  NEWS_UPDATED: 'news:updated',
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',
  SETTINGS_GET_ALL: 'settings:get-all',
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
  WINDOW_IS_MAXIMIZED: 'window:is-maximized',
  OPEN_EXTERNAL: 'open:external',
  RATE_LIMIT_STATUS: 'rate-limit:status',
  SCHEDULER_SET_ACTIVE: 'scheduler:set-active',
} as const;
