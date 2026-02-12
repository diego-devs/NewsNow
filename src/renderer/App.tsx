import React from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { NewsProvider } from './context/NewsContext';
import { AppLayout } from './components/Layout/AppLayout';

export function App() {
  return (
    <SettingsProvider>
      <NewsProvider>
        <AppLayout />
      </NewsProvider>
    </SettingsProvider>
  );
}
