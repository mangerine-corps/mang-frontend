import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebouncedValue } from 'mangarine/hooks/useDebouncedValue';
import { apiClient } from 'mangarine/lib/api-client';

export type SearchItem = {
  id: string;
  type: 'user' | 'group';
  name: string;
  profilePics?: string | null;
  banner?: string | null;
};

export type SearchResponse = {
  results: SearchItem[];
  total: number;
  page: number;
  limit: number;
};

export function useSearch(initialLimit = 10) {
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 400);

  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const hasQuery = useMemo(() => debounced.trim().length > 0, [debounced]);

  const search = useCallback(async () => {
    if (!hasQuery) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      const response = await apiClient.get<SearchResponse>('/search', {
        params: {
          query: debounced,
          limit: initialLimit,
        },
        signal: controller.signal,
      });

      setData(response.data);
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch search results');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [debounced, initialLimit, hasQuery]);

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return {
    query,
    setQuery,
    debounced,
    data,
    results: data?.results ?? [],
    total: data?.total ?? 0,
    loading,
    error,
    hasQuery,
    refetch: search,
  };
}
