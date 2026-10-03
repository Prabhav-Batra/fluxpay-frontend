'use client';

import { useState } from 'react';
import { useAdminPayouts, useAdminRecordPayout } from '../hooks/useAdmin';
import { DataTable } from '@/components/DataTable';
import { LoadMoreButton } from '@/components/LoadMoreButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPaise, rupeesToPaise } from '@/lib/money';
import { formatDateTime } from '@/lib/dates';
import type { AdminMerchantDetail, Payout } from '../api/adminApi';
import type { Mode } from '@/lib/api/types';

interface PayoutsSectionProps {
  merchantId: string;
  balances: AdminMerchantDetail['balances'];
}

export function PayoutsSection({ merchantId, balances }: PayoutsSectionProps) {
  const [mode, setMode] = useState<Mode>('live');
  const { items, hasMore, isLoadingMore, isLoading, loadMore } = useAdminPayouts(merchantId, mode);
  
  const recordMutation = useAdminRecordPayout(merchantId);
  
  const [amountRupees, setAmountRupees] = useState('');
  const [reference, setReference] = useState('');
  const [error, setError] = useState<string | null>(null);

  const availablePaise = mode === 'live' ? balances.live.available : balances.test.available;

  const handleRecordPayout = () => {
    setError(null);
    const paise = rupeesToPaise(amountRupees);
    
    if (paise === null || paise < 100) {
      setError('Amount must be at least ₹1');
      return;
    }
    
    if (paise > availablePaise) {
      setError(`Cannot exceed available balance of ${formatPaise(availablePaise)}`);
      return;
    }

    if (!reference.trim()) {
      setError('Reference is required');
      return;
    }

    recordMutation.mutate({ mode, amount: paise, reference }, {
      onSuccess: () => {
        setAmountRupees('');
        setReference('');
      }
    });
  };

  const columns = [
    {
      header: 'Amount',
      accessor: (p: Payout) => <span className="font-medium">{formatPaise(p.amount)}</span>,
    },
    {
      header: 'Reference',
      accessor: (p: Payout) => p.reference,
    },
    {
      header: 'Paid At',
      accessor: (p: Payout) => formatDateTime(p.paid_at),
    },
    {
      header: 'Recorded By',
      accessor: (p: Payout) => <span className="text-muted-foreground">{p.recorded_by}</span>,
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-6 shadow grid gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Payouts</h3>
        <Select value={mode} onValueChange={(val) => setMode(val as Mode)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="test">Test</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end border p-4 rounded-lg bg-muted/30">
        <div className="grid gap-2">
          <Label htmlFor="payout-amount">Amount (₹) - Max {formatPaise(availablePaise)}</Label>
          <Input 
            id="payout-amount"
            value={amountRupees} 
            onChange={(e) => setAmountRupees(e.target.value)} 
            placeholder="0.00"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="payout-reference">Reference (UTR)</Label>
          <Input 
            id="payout-reference"
            value={reference} 
            onChange={(e) => setReference(e.target.value)} 
            placeholder="UTR123456"
          />
        </div>
        <Button onClick={handleRecordPayout} disabled={recordMutation.isPending}>
          Record Payout
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid gap-4 mt-4">
        <DataTable columns={columns} data={items} isLoading={isLoading} emptyMessage="No payouts recorded." getRowId={(p) => p.id} />
        <LoadMoreButton hasMore={hasMore} isLoading={isLoadingMore} onLoadMore={loadMore} />
      </div>
    </div>
  );
}
