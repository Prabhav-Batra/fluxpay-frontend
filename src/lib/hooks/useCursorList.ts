'use client';

import { useInfiniteQuery, type QueryKey } from '@tanstack/react-query';

import type { ListResponse } from '@/lib/api/types';

/** Flattened view over a cursor-paginated list. */
export interface CursorList<T> {
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: unknown;
  loadMore: () => Promise<unknown>;
  refetch: () => Promise<unknown>;
}

/**
 * Loads a `{data, cursor, has_more}` list page by page. `fetchPage` receives the
 * `starting_after` cursor (undefined for the first page).
 */
export function useCursorList<T>(
  queryKey: QueryKey,
  fetchPage: (startingAfter: string | undefined) => Promise<ListResponse<T>>,
): CursorList<T> {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.has_more && last.cursor ? last.cursor : undefined),
  });
  return {
    items: query.data?.pages.flatMap((page) => page.data) ?? [],
    hasMore: query.hasNextPage,
    isLoading: query.isPending,
    isLoadingMore: query.isFetchingNextPage,
    error: query.error,
    loadMore: () => query.fetchNextPage(),
    refetch: () => query.refetch(),
  };
}
