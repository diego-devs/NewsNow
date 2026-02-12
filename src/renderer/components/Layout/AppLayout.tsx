import React, { useState, useEffect } from 'react';
import { TitleBar } from './TitleBar';
import { Sidebar } from './Sidebar';
import { SubcategoryTabs } from '../News/SubcategoryTabs';
import { NewsList } from '../News/NewsList';
import { SettingsPanel } from '../Settings/SettingsPanel';

export function AppLayout() {
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const cleanup = window.electronAPI.onNavigateSettings(() => {
      setShowSettings(true);
    });
    return cleanup;
  }, []);

  return (
    <div style={styles.container}>
      <TitleBar />
      <div style={styles.body}>
        <Sidebar
          showSettings={showSettings}
          onShowSettings={() => setShowSettings(true)}
          onHideSettings={() => setShowSettings(false)}
        />
        <div style={styles.main}>
          {showSettings ? (
            <SettingsPanel />
          ) : (
            <>
              <SubcategoryTabs />
              <NewsList />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  body: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
};
