import React from 'react';
import { CATEGORIES } from '../../../shared/defaults';
import { Category } from '../../../shared/types';
import { useSettingsContext } from '../../context/SettingsContext';
import { useNewsContext } from '../../context/NewsContext';
import { t } from '../../utils/i18n';

interface SidebarProps {
  showSettings: boolean;
  onShowSettings: () => void;
  onHideSettings: () => void;
}

export function Sidebar({ showSettings, onShowSettings, onHideSettings }: SidebarProps) {
  const { language } = useSettingsContext();
  const { activeCategory, setActiveCategory } = useNewsContext();

  return (
    <div style={styles.sidebar}>
      <div style={styles.categories}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            style={{
              ...styles.categoryBtn,
              ...(activeCategory === cat.id && !showSettings ? styles.activeBtn : {}),
            }}
            onClick={() => {
              onHideSettings();
              setActiveCategory(cat.id);
            }}
          >
            <span style={styles.icon}>{cat.icon}</span>
            <span>{cat.label[language]}</span>
          </button>
        ))}
      </div>
      <div style={styles.bottom}>
        <button
          style={{
            ...styles.categoryBtn,
            ...(showSettings ? styles.activeBtn : {}),
          }}
          onClick={onShowSettings}
        >
          <span style={styles.icon}>⚙️</span>
          <span>{t('settings', language)}</span>
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 'var(--sidebar-width)',
    height: '100%',
    background: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '12px 8px',
    flexShrink: 0,
  },
  categories: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  categoryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
  },
  activeBtn: {
    background: 'var(--accent-subtle)',
    color: 'var(--text-accent)',
  },
  icon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center' as const,
  },
  bottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
};
