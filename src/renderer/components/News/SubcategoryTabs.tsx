import React from 'react';
import { CATEGORIES } from '../../../shared/defaults';
import { useNewsContext } from '../../context/NewsContext';
import { useSettingsContext } from '../../context/SettingsContext';

export function SubcategoryTabs() {
  const { activeCategory, activeSubcategory, setActiveSubcategory } = useNewsContext();
  const { language } = useSettingsContext();

  const category = CATEGORIES.find(c => c.id === activeCategory);
  if (!category) return null;

  return (
    <div style={styles.container}>
      <div style={styles.tabs}>
        {category.subcategories.map(sub => (
          <button
            key={sub.id}
            style={{
              ...styles.tab,
              ...(activeSubcategory === sub.id ? styles.activeTab : {}),
            }}
            onClick={() => setActiveSubcategory(sub.id)}
          >
            {sub.label[language]}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    borderBottom: '1px solid var(--border-subtle)',
    background: 'var(--bg-secondary)',
    padding: '0 16px',
    flexShrink: 0,
  },
  tabs: {
    display: 'flex',
    gap: 0,
    overflowX: 'auto',
  },
  tab: {
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  activeTab: {
    color: 'var(--text-accent)',
    borderBottomColor: 'var(--accent-primary)',
  },
};
