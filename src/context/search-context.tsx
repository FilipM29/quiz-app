import { createContext, ReactNode, useContext, useState } from 'react';
import { Quiz, QuizType } from '../models/quiz';

interface SearchFilters {
  query: string;
  category: string;
  type: QuizType | 'ALL';
}

interface SearchContextType {
  filters: SearchFilters;
  updateQuery: (query: string) => void;
  updateCategory: (category: string) => void;
  updateType: (type: QuizType | 'ALL') => void;
  clearFilters: () => void;
  filteredQuizzes: Quiz[];
  setQuizzes: (quizzes: Quiz[]) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

const initialFilters: SearchFilters = {
  query: '',
  category: 'all',
  type: 'ALL'
};

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);

  const updateQuery = (query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  };

  const updateCategory = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const updateType = (type: QuizType | 'ALL') => {
    setFilters((prev) => ({ ...prev, type }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const setQuizzes = (quizzes: Quiz[]) => {
    setAllQuizzes(quizzes);
  };

  // Filter quizzes based on current filters
  const filteredQuizzes = allQuizzes.filter((quiz) => {
    // Text search
    if (filters.query) {
      const searchText = `${quiz.title} ${quiz.description}`.toLowerCase();
      if (!searchText.includes(filters.query.toLowerCase())) {
        return false;
      }
    }

    // Type filter
    if (filters.type !== 'ALL') {
      if (quiz.quizType !== filters.type) {
        return false;
      }
    }

    // Category filter (based on detected category from title/description)
    if (filters.category !== 'all') {
      const text = `${quiz.title} ${quiz.description}`.toLowerCase();

      const categoryMatches = {
        science: text.match(
          /(science|physics|chemistry|biology|technology|computer|math|mathematics|engineering)/
        ),
        history: text.match(
          /(history|historical|culture|ancient|war|civilization|century|past|heritage)/
        ),
        sports: text.match(
          /(sport|football|basketball|soccer|olympic|game|movie|film|music|entertainment|celebrity)/
        ),
        geography: text.match(
          /(geography|country|city|world|nature|animal|planet|earth|travel|continent)/
        ),
        literature: text.match(
          /(literature|book|author|art|painting|poetry|novel|artist|creative|writing)/
        ),
        business: text.match(
          /(business|economics|finance|market|money|economy|trade|company|corporate)/
        )
      };

      const hasMatch =
        categoryMatches[filters.category as keyof typeof categoryMatches];
      if (!hasMatch) {
        return false;
      }
    }

    return true;
  });

  const value = {
    filters,
    updateQuery,
    updateCategory,
    updateType,
    clearFilters,
    filteredQuizzes,
    setQuizzes
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
