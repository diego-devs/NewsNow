import React, { useEffect, useState } from 'react';
import { useSettingsContext } from '../../context/SettingsContext';
import { t } from '../../utils/i18n';
import { REFRESH_INTERVALS, ARTICLES_PER_PAGE_OPTIONS } from '../../utils/constants';
import { RateLimitStatus } from '../../../shared/types';

export function SettingsPanel() {
  const { settings, language, updateSetting } = useSettingsContext();
  const [rateLimit, setRateLimit] = useState<RateLimitStatus | null>(null);

  useEffect(() => {
    window.electronAPI.getRateLimitStatus().then(setRateLimit);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <h2 style={styles.heading}>{t('settings', language)}</h2>

        <div style={styles.section}>
          {/* Language */}
          <SettingRow label={t('language', language)}>
            <select
              value={settings.language}
              onChange={e => updateSetting('language', e.target.value as any)}
              style={styles.select}
            >
              <option value="en">{t('english', language)}</option>
              <option value="es">{t('spanish', language)}</option>
            </select>
          </SettingRow>

          {/* Auto start */}
          <SettingRow label={t('autoStart', language)}>
            <ToggleSwitch
              value={settings.autoStart}
              onChange={v => updateSetting('autoStart', v)}
            />
          </SettingRow>

          {/* Refresh interval */}
          <SettingRow label={t('refreshInterval', language)}>
            <select
              value={settings.refreshInterval}
              onChange={e => updateSetting('refreshInterval', Number(e.target.value) as any)}
              style={styles.select}
            >
              {REFRESH_INTERVALS.map(m => (
                <option key={m} value={m}>{m} {t('minutes', language)}</option>
              ))}
            </select>
          </SettingRow>

          {/* Notifications */}
          <SettingRow label={t('notifications', language)}>
            <ToggleSwitch
              value={settings.notificationsEnabled}
              onChange={v => updateSetting('notificationsEnabled', v)}
            />
          </SettingRow>

          {/* Minimize to tray */}
          <SettingRow label={t('minimizeToTray', language)}>
            <ToggleSwitch
              value={settings.minimizeToTray}
              onChange={v => updateSetting('minimizeToTray', v)}
            />
          </SettingRow>

          {/* Articles per page */}
          <SettingRow label={t('articlesPerPage', language)}>
            <select
              value={settings.articlesPerPage}
              onChange={e => updateSetting('articlesPerPage', Number(e.target.value))}
              style={styles.select}
            >
              {ARTICLES_PER_PAGE_OPTIONS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </SettingRow>
        </div>

        {/* Rate limit info */}
        {rateLimit && (
          <div style={styles.rateLimit}>
            <span style={styles.rateLimitLabel}>{t('remainingCalls', language)}</span>
            <span style={styles.rateLimitValue}>
              {rateLimit.remaining} / {rateLimit.total}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={settingRowStyles.row}>
      <span style={settingRowStyles.label}>{label}</span>
      {children}
    </div>
  );
}

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      style={{
        ...toggleStyles.track,
        background: value ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
      }}
      onClick={() => onChange(!value)}
    >
      <div
        style={{
          ...toggleStyles.thumb,
          transform: value ? 'translateX(18px)' : 'translateX(2px)',
        }}
      />
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    overflowY: 'auto',
    padding: 24,
  },
  inner: {
    maxWidth: 520,
    margin: '0 auto',
  },
  heading: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 24,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  select: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-primary)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    padding: '6px 10px',
    fontSize: 13,
    cursor: 'pointer',
  },
  rateLimit: {
    marginTop: 32,
    padding: '12px 16px',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateLimitLabel: {
    fontSize: 13,
    color: 'var(--text-secondary)',
  },
  rateLimitValue: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
};

const settingRowStyles: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderRadius: 'var(--radius-md)',
    transition: 'background var(--transition-fast)',
  },
  label: {
    fontSize: 14,
    color: 'var(--text-primary)',
  },
};

const toggleStyles: Record<string, React.CSSProperties> = {
  track: {
    width: 40,
    height: 22,
    borderRadius: 11,
    position: 'relative',
    cursor: 'pointer',
    transition: 'background var(--transition-fast)',
    border: 'none',
    padding: 0,
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: 'white',
    position: 'absolute',
    top: 2,
    transition: 'transform var(--transition-fast)',
  },
};
