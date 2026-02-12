import React from 'react';
import { useNewsContext } from '../../context/NewsContext';
import { useSettingsContext } from '../../context/SettingsContext';
import { NewsCard } from './NewsCard';
import { NewsCardSkeleton } from './NewsCardSkeleton';
import { FetchTimestamp } from './FetchTimestamp';
import { EmptyState } from '../Common/EmptyState';
import { t } from '../../utils/i18n';

export function NewsList() {
  const { articles, loading, error } = useNewsContext();
  const { language } = useSettingsContext();

  if (error) {
    const isRateLimit = error.includes('rate limit') || error.includes('Rate limit');
    const isApiKey = error.includes('API key') || error.includes('apiKey');

    if (isApiKey) {
      return <EmptyState icon="🔑" title={t('apiKeyMissing', language)} description={t('apiKeyMissingDesc', language)} />;
    }
    if (isRateLimit) {
      return <EmptyState icon="⏳" title={t('rateLimitReached', language)} description={t('rateLimitDesc', language)} />;
    }
    return <EmptyState icon="⚠️" title={t('errorFetching', language)} description={error} />;
  }

  return (
    <div style={styles.container}>
      <FetchTimestamp />
      <div style={styles.list}>
        {loading && articles.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
        ) : articles.length === 0 ? (
          <EmptyState icon="📭" title={t('noArticles', language)} description={t('noArticlesDesc', language)} />
        ) : (
          articles.map(article => <NewsCard key={article.id} article={article} />)
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
};
