import React, { useState } from 'react';
import { Article } from '../../../shared/types';
import { useSettingsContext } from '../../context/SettingsContext';
import { formatRelativeTime } from '../../utils/formatDate';
import { PLACEHOLDER_IMAGE } from '../../utils/constants';

interface NewsCardProps {
  article: Article;
}

export function NewsCard({ article }: NewsCardProps) {
  const { language } = useSettingsContext();
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    window.electronAPI.openExternal(article.url);
  };

  const imageUrl = !imgError && article.urlToImage ? article.urlToImage : PLACEHOLDER_IMAGE;

  return (
    <div style={styles.card} onClick={handleClick} role="button" tabIndex={0}>
      <div style={styles.imageContainer}>
        <img
          src={imageUrl}
          alt=""
          style={styles.image}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{article.title}</h3>
        {article.description && (
          <p style={styles.description}>
            {article.description.length > 150
              ? article.description.slice(0, 150) + '...'
              : article.description}
          </p>
        )}
        <div style={styles.meta}>
          <span style={styles.source}>{article.source}</span>
          <span style={styles.dot}>·</span>
          <span style={styles.time}>{formatRelativeTime(article.publishedAt, language)}</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    gap: 16,
    padding: 16,
    borderRadius: 'var(--radius-lg)',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    outline: 'none',
  },
  imageContainer: {
    width: 180,
    height: 110,
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    flexShrink: 0,
    background: 'var(--bg-tertiary)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  description: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    flex: 1,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
  },
  source: {
    color: 'var(--text-accent)',
    fontWeight: 500,
  },
  dot: {
    color: 'var(--text-tertiary)',
  },
  time: {
    color: 'var(--text-tertiary)',
  },
};
