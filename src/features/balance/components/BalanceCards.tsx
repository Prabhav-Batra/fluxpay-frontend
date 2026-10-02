import { StatCard } from '@/components/StatCard';
import { formatPaise } from '@/lib/money';

import type { Balance } from '../api/balanceApi';

/** Available balance and its components. */
export function BalanceCards({ balance }: { balance: Balance }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="Available"
        value={formatPaise(balance.available)}
        hint="Owed to you, after fees, refunds and payouts"
        emphasis
      />
      <StatCard label="Gross sales" value={formatPaise(balance.gross_sales)} />
      <StatCard label="Platform fees" value={formatPaise(balance.platform_fees)} />
      <StatCard label="Gateway fees" value={formatPaise(balance.gateway_fees)} />
      <StatCard label="Refunds" value={formatPaise(balance.refunds)} />
      <StatCard label="Paid out" value={formatPaise(balance.payouts)} />
    </div>
  );
}
