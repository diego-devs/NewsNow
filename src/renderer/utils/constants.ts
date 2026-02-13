export const REFRESH_INTERVALS = [15, 30, 60, 120] as const;
export const ARTICLES_PER_PAGE_OPTIONS = [10, 20, 30, 50] as const;
const _placeholderSvg = `<svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="225" fill="#1a1a2e"/>
  <text x="200" y="120" text-anchor="middle" fill="#444" font-family="sans-serif" font-size="18" font-weight="bold">NEWS</text>
</svg>`;
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,' + btoa(_placeholderSvg);
