import React, { useState, useEffect } from 'react';
import { useSettingsContext } from '../../context/SettingsContext';
import { LanguageToggle } from '../Common/LanguageToggle';

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    window.electronAPI.isMaximized().then(setIsMaximized);
  }, []);

  const handleMinimize = () => window.electronAPI.minimizeWindow();
  const handleMaximize = async () => {
    const maximized = await window.electronAPI.maximizeWindow();
    setIsMaximized(maximized);
  };
  const handleClose = () => window.electronAPI.closeWindow();

  return (
    <div style={styles.titleBar}>
      <div style={styles.dragRegion}>
        <span style={styles.title}>NewsNow</span>
      </div>
      <div style={styles.controls}>
        <LanguageToggle />
        <button style={styles.btn} onClick={handleMinimize} title="Minimize">
          <svg width="12" height="12" viewBox="0 0 12 12"><rect y="5" width="12" height="1.5" fill="currentColor" rx="0.5"/></svg>
        </button>
        <button style={styles.btn} onClick={handleMaximize} title="Maximize">
          {isMaximized ? (
            <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1.5" y="3" width="7.5" height="7.5" fill="none" stroke="currentColor" strokeWidth="1.2" rx="1"/><path d="M3 3V2a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H9" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.2" rx="1.5"/></svg>
          )}
        </button>
        <button style={{ ...styles.btn, ...styles.closeBtn }} onClick={handleClose} title="Close">
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  titleBar: {
    height: 'var(--titlebar-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-subtle)',
    position: 'relative',
    zIndex: 100,
  },
  dragRegion: {
    flex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 16,
    // @ts-ignore
    WebkitAppRegion: 'drag',
    appRegion: 'drag',
  } as React.CSSProperties,
  title: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '0.5px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    height: '100%',
    // @ts-ignore
    WebkitAppRegion: 'no-drag',
    appRegion: 'no-drag',
  } as React.CSSProperties,
  btn: {
    width: 46,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    transition: 'background var(--transition-fast), color var(--transition-fast)',
    cursor: 'pointer',
  },
  closeBtn: {
    // hover effect handled inline
  },
};
