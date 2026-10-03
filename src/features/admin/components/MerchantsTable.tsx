'use client';

import { useAdminMerchants } from '../hooks/useAdmin';
import { DataTable } from '@/components/DataTable';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { ErrorState } from '@/components/ErrorState';
import { formatDateTime } from '@/lib/dates';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Merchant } from '@/features/settings/api/settingsApi';

export function MerchantsTable() {
  const { items, hasMore, isLoadingMore, isLoading, error, loadMore } = useAdminMerchants();

  if (error) return <ErrorState error={error} />;

  const columns = [
    {
      header: 'Business Name',
      accessor: (m: Merchant) => (
        <Link href={`/admin/merchants/${m.id}`} className="font-medium text-primary hover:underline">
          {m.business_name}
        </Link>
      ),
    },
    {
      header: 'Slug',
      accessor: (m: Merchant) => m.slug,
    },
    {
      header: 'Fee',
      accessor: (m: Merchant) => `${m.platform_fee_bps / 100}%`,
    },
    {
      header: 'Status',
      accessor: (m: Merchant) => (
        <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>{m.status}</Badge>
      ),
    },
    {
      header: 'Created',
      accessor: (m: Merchant) => formatDateTime(m.created_at),
    },
  ];

  return (
    <div className="grid gap-4">
      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyMessage="No merchants found."
        getRowId={(m) => m.id}
      />
      <LoadMoreButton
        hasMore={hasMore}
        isLoading={isLoadingMore}
        onLoadMore={loadMore}
      />
    </div>
  );
}
