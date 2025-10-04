import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from 'mangarine/state/hooks/user.hook';
import { useDebouncedValue } from 'mangarine/hooks/useDebouncedValue';

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
  const { token } = useAuth();
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

      const baseUrl = process.env.API_BASE_URL?.replace(/\/$/, '') || '';
      const url = `${baseUrl}/search?query=${encodeURIComponent(debounced)}&limit=${initialLimit}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Search request failed with status ${res.status}`);
      }

      const json = (await res.json()) as SearchResponse;
      setData(json);
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      setError(err?.message || 'Failed to fetch search results');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [debounced, token, initialLimit, hasQuery]);

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
