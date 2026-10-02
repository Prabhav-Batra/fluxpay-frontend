'use client';

import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { ErrorState } from '@/components/ErrorState';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { Product } from '../api/productsApi';
import { useProducts, useUpdateProduct, type ProductFilter } from '../hooks/useProducts';
import { ProductFormDialog } from './ProductFormDialog';
import { ProductsTable } from './ProductsTable';

/** Products screen: filter, list, create, edit and archive. */
export function ProductsPage() {
  const [filter, setFilter] = useState<ProductFilter>('active');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>();
  const list = useProducts(filter);
  const update = useUpdateProduct();

  const openCreate = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };
  const onEdit = useCallback((product: Product) => {
    setEditing(product);
    setDialogOpen(true);
  }, []);
  const { mutate } = update;
  const onToggleActive = useCallback(
    (product: Product) =>
      mutate(
        { id: product.id, body: { active: !product.active } },
        {
          onSuccess: () => toast.success(product.active ? 'Product archived' : 'Product restored'),
          onError: (error) => toast.error(error.message),
        },
      ),
    [mutate],
  );

  return (
    <>
      <PageHeader
        title="Products"
        description="What customers can buy through checkout sessions and payment links."
        actions={
          <>
            <Select value={filter} onValueChange={(v) => setFilter(v as ProductFilter)}>
              <SelectTrigger className="w-32" aria-label="Status filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={openCreate}>
              <Plus /> New product
            </Button>
          </>
        }
      />
      {list.error ? (
        <ErrorState error={list.error} onRetry={list.refetch} />
      ) : (
        <>
          <ProductsTable
            products={list.items}
            isLoading={list.isLoading}
            onEdit={onEdit}
            onToggleActive={onToggleActive}
          />
          <LoadMoreButton hasMore={list.hasMore} isLoading={list.isLoadingMore} onLoadMore={list.loadMore} />
        </>
      )}
      <ProductFormDialog open={dialogOpen} onOpenChange={setDialogOpen} product={editing} />
    </>
  );
}
