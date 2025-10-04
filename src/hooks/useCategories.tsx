import { useContext } from 'react';
import useSWR from 'swr';
import { ConfigContext } from '../context/config-context';
import { categoryApiService } from '../services/api/category-api';
import { Category } from '../types/category';

export const useCategories = () => {
  const { apiHost } = useContext(ConfigContext);

  const {
    data: categories,
    error,
    isLoading,
    mutate
  } = useSWR<Category[]>(
    `${apiHost}/categories`,
    () => categoryApiService.getAllCategories(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5 * 60 * 1000 // 5 minutes
    }
  );

  return {
    categories: categories || [],
    error,
    isLoading,
    mutate
  };
};
