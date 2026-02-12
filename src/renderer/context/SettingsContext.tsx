import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppSettings, Language } from '../../shared/types';
import { DEFAULT_SETTINGS } from '../../shared/defaults';

interface SettingsContextType {
  settings: AppSettings;
  language: Language;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  language: 'en',
  updateSetting: async () => {},
  loading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.electronAPI.getSettings().then((s: AppSettings) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const updateSetting = useCallback(async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    await window.electronAPI.setSetting(key, value);
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, language: settings.language, updateSetting, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}
