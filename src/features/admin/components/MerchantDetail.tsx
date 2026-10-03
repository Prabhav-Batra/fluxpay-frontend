'use client';

import { useState } from 'react';
import { useAdminMerchantDetail, useAdminUpdateMerchant } from '../hooks/useAdmin';
import { ErrorState } from '@/components/ErrorState';
import { FullPageSpinner } from '@/components/FullPageSpinner';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { formatPaise } from '@/lib/money';
import { PayoutsSection } from './PayoutsSection';

export function MerchantDetail({ id }: { id: string }) {
  const { data, isLoading, error } = useAdminMerchantDetail(id);
  const updateMutation = useAdminUpdateMerchant(id);

  const [feePercent, setFeePercent] = useState<string>('');
  const [editingFee, setEditingFee] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);

  if (isLoading) return <FullPageSpinner />;
  if (error || !data) return <ErrorState error={error ?? new Error('Not found')} />;

  const { merchant, balances } = data;

  const handleUpdateFee = () => {
    const bps = Math.round(parseFloat(feePercent) * 100);
    if (!isNaN(bps) && bps >= 0 && bps <= 10000) {
      updateMutation.mutate({ platform_fee_bps: bps });
      setEditingFee(false);
    }
  };

  const handleToggleStatus = () => {
    const newStatus = merchant.status === 'active' ? 'suspended' : 'active';
    updateMutation.mutate({ status: newStatus });
  };

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader 
          title={merchant.business_name} 
          description={merchant.id} 
        />
        <div className="flex items-center gap-2">
          <Badge variant={merchant.status === 'active' ? 'default' : 'destructive'} className="mr-4">
            {merchant.status}
          </Badge>
          <Button 
            variant="outline" 
            onClick={() => setSuspendOpen(true)}
            disabled={updateMutation.isPending}
          >
            {merchant.status === 'active' ? 'Suspend' : 'Activate'}
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6 shadow grid gap-4">
          <h3 className="font-semibold">Live Balance</h3>
          <div className="text-2xl font-bold">{formatPaise(balances.live.available)}</div>
          <div className="text-sm text-muted-foreground">Available to pay out</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow grid gap-4">
          <h3 className="font-semibold">Test Balance</h3>
          <div className="text-2xl font-bold">{formatPaise(balances.test.available)}</div>
          <div className="text-sm text-muted-foreground">Available to pay out</div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow grid gap-4">
        <h3 className="font-semibold">Platform Fee</h3>
        {editingFee ? (
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              value={feePercent} 
              onChange={(e) => setFeePercent(e.target.value)} 
              step="0.01"
              className="w-32"
            />
            <span className="text-sm">%</span>
            <Button size="sm" onClick={handleUpdateFee} disabled={updateMutation.isPending}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setEditingFee(false)}>Cancel</Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="text-xl">{merchant.platform_fee_bps / 100}%</div>
            <Button size="sm" variant="outline" onClick={() => {
              setFeePercent((merchant.platform_fee_bps / 100).toString());
              setEditingFee(true);
            }}>
              Edit
            </Button>
          </div>
        )}
      </div>

      <PayoutsSection merchantId={id} balances={balances} />

      <ConfirmDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        title={merchant.status === 'active' ? 'Suspend Merchant?' : 'Activate Merchant?'}
        description={merchant.status === 'active' ? 'They will no longer be able to process payments.' : 'They will be able to process payments again.'}
        confirmLabel={merchant.status === 'active' ? 'Suspend' : 'Activate'}
        onConfirm={handleToggleStatus}
      />
    </div>
  );
}
