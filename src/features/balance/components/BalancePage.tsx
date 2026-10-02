'use client';

import { ErrorState } from '@/components/ErrorState';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { PageHeader } from '@/components/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';

import { useBalance, useLedgerEntries } from '../hooks/useBalance';
import { BalanceCards } from './BalanceCards';
import { LedgerTable } from './LedgerTable';

/** Balance screen: totals and the ledger behind them. */
export function BalancePage() {
  const balance = useBalance();
  const ledger = useLedgerEntries();

  return (
    <>
      <PageHeader
        title="Balance"
        description="FluxPay collects payments for you and pays out your available balance."
      />
      {balance.error && <ErrorState error={balance.error} onRetry={() => balance.refetch()} />}
      {balance.isPending && <Skeleton className="h-40 w-full" />}
      {balance.data && <BalanceCards balance={balance.data} />}
      <h2 className="mt-10 mb-4 text-lg font-semibold">Ledger</h2>
      {ledger.error ? (
        <ErrorState error={ledger.error} onRetry={ledger.refetch} />
      ) : (
        <>
          <LedgerTable entries={ledger.items} isLoading={ledger.isLoading} />
          <LoadMoreButton hasMore={ledger.hasMore} isLoading={ledger.isLoadingMore} onLoadMore={ledger.loadMore} />
        </>
      )}
    </>
  );
}
