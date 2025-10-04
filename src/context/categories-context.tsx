import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react';
import { categoryApiService } from '../services/api/category-api';
import type { Category } from '../types/category';
import { logger } from '../utils/logger';

interface CategoriesContextType {
  categories: Category[];
  getCategoryByValue: (value: string) => Category | null;
  isLoading: boolean;
  error: string | null;
}

const CategoriesContext = createContext<CategoriesContextType>({
  categories: [],
  getCategoryByValue: () => null,
  isLoading: true,
  error: null
});

const CATEGORIES_CACHE_KEY = 'quiz_app_categories';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedData {
  categories: Category[];
  timestamp: number;
}

type Props = {
  children: ReactNode;
};

export function CategoriesProvider({ children }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCategoryByValue = (value: string): Category | null => {
    return categories.find((cat) => cat.value === value) || null;
  };

  const loadCategoriesFromCache = (): Category[] | null => {
    try {
      const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
      if (!cached) return null;

      const data: CachedData = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid
      if (now - data.timestamp < CACHE_TTL) {
        return data.categories;
      }

      // Cache expired, remove it
      localStorage.removeItem(CATEGORIES_CACHE_KEY);
      return null;
    } catch (error) {
      logger.warn('Failed to load categories from cache', error);
      localStorage.removeItem(CATEGORIES_CACHE_KEY);
      return null;
    }
  };

  const saveCategoriesToCache = (categories: Category[]) => {
    try {
      const data: CachedData = {
        categories,
        timestamp: Date.now()
      };
      localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      logger.warn('Failed to save categories to cache', error);
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      setError(null);
      const fetchedCategories = await categoryApiService.getAllCategories();
      setCategories(fetchedCategories);
      saveCategoriesToCache(fetchedCategories);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load categories';
      setError(errorMessage);
      logger.error('Failed to fetch categories', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeCategories = async () => {
      // Try to load from cache first
      const cachedCategories = loadCategoriesFromCache();

      if (cachedCategories) {
        setCategories(cachedCategories);
        setIsLoading(false);
      } else {
        // Cache miss or expired, fetch from API
        await fetchCategories();
      }
    };

    initializeCategories();
  }, [fetchCategories]);

  const contextValue: CategoriesContextType = {
    categories,
    getCategoryByValue,
    isLoading,
    error
  };

  return (
    <CategoriesContext.Provider value={contextValue}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}
