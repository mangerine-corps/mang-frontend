import { useEffect, useMemo, useRef, useState } from 'react';
import { useGetPostsCursorQuery } from 'mangarine/state/services/posts.service';

export interface UsePostsPollingOptions<T = any> {
  // Maximum items per fetch
  pageSize?: number;
  // Polling interval in ms
  pollingInterval?: number;
  // Optional mapper to normalize items
  mapItem?: (item: any) => T;
  // Optional dedup key selector
  keyOf?: (item: T) => string;
}

export interface UsePostsPollingResult<T = any> {
  items: T[];
  isFetching: boolean;
  hasMore: boolean;
  refresh: () => void;
  // Replace items (e.g., after filters)
  setItems: (items: T[]) => void;
}

/**
 * Polls for newest posts and prepends any new items to the list.
 * Uses GET /posts/cursor (without cursor) to always fetch the latest page
 * and diffs against the current list by ID to find new posts.
 */
export function usePostsPolling<T = any>({
  pageSize = 10,
  pollingInterval = 15000,
  mapItem,
  keyOf,
}: UsePostsPollingOptions<T> = {}): UsePostsPollingResult<T> {
  const [items, setItems] = useState<T[]>([]);

  // Always fetch latest (no cursor) so that polling can discover new posts
  const {
    data,
    isFetching,
    refetch,
  } = useGetPostsCursorQuery({ limit: pageSize }, {
    // RTK Query native polling
    pollingInterval,
    refetchOnMountOrArgChange: true,
  });

  // Normalize fresh items from the API
  const latestPageItems = useMemo(() => {
    const payload: any = (data as any)?.data ?? (data as any) ?? {};
    const raw = Array.isArray(payload?.items) ? payload.items : [];
    const mapped = mapItem ? raw.map(mapItem) : raw;
    return mapped as T[];
  }, [data, mapItem]);

  // Stable key extractor
  const keyFn = useMemo<Required<UsePostsPollingOptions<T>>['keyOf']>(() => {
    if (keyOf) return keyOf;
    return (item: any) => item?.id as string;
  }, [keyOf]);

  const seenKeysRef = useRef<Set<string>>(new Set());

  // Initialize seen keys from existing items
  useEffect(() => {
    if (items.length && seenKeysRef.current.size === 0) {
      const s = new Set<string>(items.map(keyFn));
      seenKeysRef.current = s;
    }
  }, [items, keyFn]);

  // When new data arrives, prepend any unseen items
  useEffect(() => {
    if (!latestPageItems?.length) return;

    const s = new Set<string>(seenKeysRef.current);
    const incomingNew: T[] = [];

    for (const item of latestPageItems) {
      const k = keyFn(item);
      if (!s.has(k)) {
        s.add(k);
        incomingNew.push(item);
      }
    }

    if (incomingNew.length) {
      // Prepend newest items
      setItems((prev) => [...incomingNew, ...prev]);
      seenKeysRef.current = s;
    }
  }, [latestPageItems, keyFn]);

  const hasMore = useMemo(() => {
    const payload: any = (data as any)?.data ?? (data as any) ?? {};
    return Boolean(payload?.hasMore);
  }, [data]);

  return {
    items,
    isFetching,
    hasMore,
    refresh: refetch,
    setItems,
  };
}
