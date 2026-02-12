import React from 'react';

export function NewsCardSkeleton() {
  return (
    <div style={styles.card}>
      <div style={styles.imageSkeleton} />
      <div style={styles.content}>
        <div style={{ ...styles.line, width: '85%', height: 16 }} />
        <div style={{ ...styles.line, width: '60%', height: 14 }} />
        <div style={{ ...styles.line, width: '40%', height: 12, marginTop: 'auto' }} />
      </div>
    </div>
  );
}

const shimmer = `
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;

// Inject keyframes
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmer;
  document.head.appendChild(style);
}

const skeletonBg = {
  background: 'linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-hover) 50%, var(--bg-tertiary) 75%)',
  backgroundSize: '800px 100%',
  animation: 'shimmer 1.5s infinite linear',
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    gap: 16,
    padding: 16,
    borderRadius: 'var(--radius-lg)',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
  },
  imageSkeleton: {
    width: 180,
    height: 110,
    borderRadius: 'var(--radius-md)',
    flexShrink: 0,
    ...skeletonBg,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  line: {
    borderRadius: 4,
    ...skeletonBg,
  },
};
