import { useState } from 'react';
import { PaginatedResponse } from '@/lib/types';

export function usePagination<T>(fetcher: (page: number) => Promise<PaginatedResponse<T>>) {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher(page);
      setData(result.data);
      setCurrentPage(result.current_page);
      setLastPage(result.last_page);
      setTotal(result.total);
    } catch {
      setError('Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToPage = (page: number) => load(page);

  return { data, currentPage, lastPage, total, isLoading, error, load, goToPage };
}
