import { Button } from '@/components/ui/button';

interface LoadMoreButtonProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

/** "Load more" control for cursor-paginated lists; hidden when there is nothing left. */
export function LoadMoreButton({ hasMore, isLoading, onLoadMore }: LoadMoreButtonProps) {
  if (!hasMore) return null;
  return (
    <div className="mt-4 flex justify-center">
      <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
        {isLoading ? 'Loading…' : 'Load more'}
      </Button>
    </div>
  );
}
