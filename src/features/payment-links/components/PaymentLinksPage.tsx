'use client';

import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { ErrorState } from '@/components/ErrorState';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';

import type { PaymentLink } from '../api/paymentLinksApi';
import {
  usePaymentLinks,
  useProductOptions,
  useSetPaymentLinkActive,
} from '../hooks/usePaymentLinks';
import { PaymentLinkFormDialog } from './PaymentLinkFormDialog';
import { PaymentLinksTable } from './PaymentLinksTable';

/** Payment links screen: list, create, copy and enable/disable. */
export function PaymentLinksPage() {
  const [open, setOpen] = useState(false);
  const list = usePaymentLinks();
  const products = useProductOptions();
  const { mutate } = useSetPaymentLinkActive();

  const onToggleActive = useCallback(
    (link: PaymentLink) =>
      mutate(
        { id: link.id, active: !link.active },
        { onError: (error) => toast.error(error.message) },
      ),
    [mutate],
  );

  const hasActiveProduct = (products.data ?? []).some((p) => p.active);

  return (
    <>
      <PageHeader
        title="Payment links"
        description="No-code checkout URLs you can share anywhere."
        actions={
          <Button onClick={() => setOpen(true)} disabled={!hasActiveProduct}>
            <Plus /> New link
          </Button>
        }
      />
      {!products.isPending && !hasActiveProduct && (
        <p className="text-muted-foreground mb-4 text-sm">
          Create an active product first to make a payment link.
        </p>
      )}
      {list.error ? (
        <ErrorState error={list.error} onRetry={list.refetch} />
      ) : (
        <>
          <PaymentLinksTable
            links={list.items}
            products={products.data ?? []}
            isLoading={list.isLoading}
            onToggleActive={onToggleActive}
          />
          <LoadMoreButton hasMore={list.hasMore} isLoading={list.isLoadingMore} onLoadMore={list.loadMore} />
        </>
      )}
      <PaymentLinkFormDialog open={open} onOpenChange={setOpen} products={products.data ?? []} />
    </>
  );
}
