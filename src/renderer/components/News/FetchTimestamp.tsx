import React, { useState, useEffect } from 'react';
import { useNewsContext } from '../../context/NewsContext';
import { useSettingsContext } from '../../context/SettingsContext';
import { formatFetchTime } from '../../utils/formatDate';
import { t } from '../../utils/i18n';

export function FetchTimestamp() {
  const { fetchedAt, refresh, loading } = useNewsContext();
  const { language } = useSettingsContext();
  const [, setTick] = useState(0);

  // Update display every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  if (!fetchedAt) return null;

  return (
    <div style={styles.container}>
      <span style={styles.text}>
        {t('lastFetched', language)}: {formatFetchTime(fetchedAt, language)}
      </span>
      <button style={styles.refreshBtn} onClick={refresh} disabled={loading} title="Refresh">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={loading ? { animation: 'spin 1s linear infinite' } : {}}
        >
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
        </svg>
      </button>
    </div>
  );
}

// Inject spin animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    flexShrink: 0,
  },
  text: {
    fontSize: 12,
    color: 'var(--text-tertiary)',
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
  },
};
