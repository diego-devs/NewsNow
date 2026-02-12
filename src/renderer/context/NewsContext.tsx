import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Article, Category, Language, NewsResponse, Subcategory } from '../../shared/types';
import { useSettingsContext } from './SettingsContext';

interface NewsContextType {
  articles: Article[];
  loading: boolean;
  error: string | null;
  fetchedAt: number | null;
  activeCategory: Category;
  activeSubcategory: Subcategory;
  setActiveCategory: (category: Category) => void;
  setActiveSubcategory: (subcategory: Subcategory) => void;
  refresh: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType>({
  articles: [],
  loading: false,
  error: null,
  fetchedAt: null,
  activeCategory: 'technology',
  activeSubcategory: 'ai',
  setActiveCategory: () => {},
  setActiveSubcategory: () => {},
  refresh: async () => {},
});

export function NewsProvider({ children }: { children: React.ReactNode }) {
  const { language, settings } = useSettingsContext();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [activeCategory, setActiveCategoryState] = useState<Category>('technology');
  const [activeSubcategory, setActiveSubcategoryState] = useState<Subcategory>('ai');
  const prevLanguageRef = useRef(language);

  const fetchArticles = useCallback(async (cat: Category, sub: Subcategory, lang: Language) => {
    setLoading(true);
    setError(null);
    try {
      const response = await window.electronAPI.fetchNews(cat, sub, lang, settings.articlesPerPage);
      if (response.error) {
        setError(response.error);
        setArticles([]);
      } else {
        setArticles(response.articles);
        setFetchedAt(response.fetchedAt);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch news');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [settings.articlesPerPage]);

  const setActiveCategory = useCallback((category: Category) => {
    setActiveCategoryState(category);
    const defaultSub = category === 'technology' ? 'ai' : 'mexico';
    setActiveSubcategoryState(defaultSub as Subcategory);
    window.electronAPI.setActiveView(category, defaultSub as Subcategory);
    fetchArticles(category, defaultSub as Subcategory, language);
  }, [language, fetchArticles]);

  const setActiveSubcategory = useCallback((subcategory: Subcategory) => {
    setActiveSubcategoryState(subcategory);
    window.electronAPI.setActiveView(activeCategory, subcategory);
    fetchArticles(activeCategory, subcategory, language);
  }, [activeCategory, language, fetchArticles]);

  const refresh = useCallback(async () => {
    await fetchArticles(activeCategory, activeSubcategory, language);
  }, [activeCategory, activeSubcategory, language, fetchArticles]);

  // Initial fetch
  useEffect(() => {
    fetchArticles(activeCategory, activeSubcategory, language);
    window.electronAPI.setActiveView(activeCategory, activeSubcategory);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch when language changes
  useEffect(() => {
    if (prevLanguageRef.current !== language) {
      prevLanguageRef.current = language;
      fetchArticles(activeCategory, activeSubcategory, language);
    }
  }, [language, activeCategory, activeSubcategory, fetchArticles]);

  // Listen for auto-refresh updates from main process
  useEffect(() => {
    const cleanup = window.electronAPI.onNewsUpdated((data: any) => {
      if (data.category === activeCategory && data.subcategory === activeSubcategory) {
        setArticles(data.response.articles);
        setFetchedAt(data.response.fetchedAt);
      }
    });
    return cleanup;
  }, [activeCategory, activeSubcategory]);

  return (
    <NewsContext.Provider
      value={{
        articles,
        loading,
        error,
        fetchedAt,
        activeCategory,
        activeSubcategory,
        setActiveCategory,
        setActiveSubcategory,
        refresh,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNewsContext() {
  return useContext(NewsContext);
}
