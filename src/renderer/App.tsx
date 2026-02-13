import React from 'react';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { SettingsProvider } from './context/SettingsContext';
import { NewsProvider } from './context/NewsContext';
import { AppLayout } from './components/Layout/AppLayout';

export function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <NewsProvider>
          <AppLayout />
        </NewsProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
