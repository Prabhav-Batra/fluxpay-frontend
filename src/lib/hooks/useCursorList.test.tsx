import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useCursorList } from './useCursorList';

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

describe('useCursorList', () => {
  it('should_pass_cursor_and_flatten_pages_when_loading_more', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce({ data: [{ id: 'a' }], cursor: 'a', has_more: true })
      .mockResolvedValueOnce({ data: [{ id: 'b' }], cursor: null, has_more: false });
    const { result } = renderHook(() => useCursorList(['things'], fetchPage), { wrapper });
    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(fetchPage).toHaveBeenLastCalledWith(undefined);
    expect(result.current.hasMore).toBe(true);
    await act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.items).toEqual([{ id: 'a' }, { id: 'b' }]));
    expect(fetchPage).toHaveBeenLastCalledWith('a');
    expect(result.current.hasMore).toBe(false);
  });
});
