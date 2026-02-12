import React from 'react';
import { useSettingsContext } from '../../context/SettingsContext';

export function LanguageToggle() {
  const { language, updateSetting } = useSettingsContext();

  const toggle = () => {
    updateSetting('language', language === 'en' ? 'es' : 'en');
  };

  return (
    <button onClick={toggle} style={styles.toggle} title="Toggle language">
      <span style={language === 'en' ? styles.active : styles.inactive}>EN</span>
      <span style={styles.divider}>/</span>
      <span style={language === 'es' ? styles.active : styles.inactive}>ES</span>
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    padding: '4px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background var(--transition-fast)',
  },
  active: {
    color: 'var(--accent-primary)',
  },
  inactive: {
    color: 'var(--text-tertiary)',
  },
  divider: {
    color: 'var(--text-tertiary)',
    fontSize: 11,
  },
};
