import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebouncedValue } from 'mangarine/hooks/useDebouncedValue';
import { apiClient } from 'mangarine/lib/api-client';

export type SearchItem = {
  id: string;
  type: 'user' | 'group';
  name: string;
  businessName?: string | null;
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

      const response = await apiClient.get<any>('/search/all', {
        params: {
          query: debounced,
          limit: initialLimit,
        },
        signal: controller.signal,
      });

      // /search/all returns { data: { posts, people, consultants, totalResults } }
      const payload = response.data?.data ?? response.data ?? {};
      const people: any[] = Array.isArray(payload.people) ? payload.people : [];
      const consultants: any[] = Array.isArray(payload.consultants) ? payload.consultants : [];

      // Merge people + consultants, deduplicate by id
      const seen = new Set<string>();
      const combined = [...people, ...consultants].filter((u) => {
        const key = String(u.id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setData({
        results: combined.map((u: any) => ({
          id: u.id,
          type: 'user' as const,
          name: u.fullName ?? u.name ?? '',
          businessName: u.businessName ?? null,
          profilePics: u.profilePics ?? null,
          banner: u.profileBanner ?? u.banner ?? null,
        })),
        total: (payload.totalResults?.people ?? 0) + (payload.totalResults?.consultants ?? 0),
        page: 1,
        limit: initialLimit,
      });
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
