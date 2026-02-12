export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

export interface NewsAPIArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface FetchParams {
  endpoint: 'everything' | 'top-headlines';
  q?: string;
  language?: string;
  country?: string;
  category?: string;
  sortBy?: string;
  pageSize?: number;
  page?: number;
}
