'use client';

import { StatCard } from '@/components/StatCard';
import { useAnalyticsSummary } from '../hooks/useAnalytics';
import { formatPaise } from '@/lib/money';

interface KPICardsProps {
  range: { from: string; to: string };
}

export function KPICards({ range }: KPICardsProps) {
  const { data: summary, isLoading, error } = useAnalyticsSummary(range);

  if (error) {
    return <div className="text-destructive text-sm">Failed to load analytics summary.</div>;
  }

  const kpis = [
    { label: 'Gross Sales', amount: summary?.gross_sales ?? 0, type: 'positive' as const },
    { label: 'Net Revenue', amount: summary?.net ?? 0, type: 'positive' as const },
    { label: 'Refunds', amount: summary?.refunds ?? 0, type: 'negative' as const },
    { label: 'Platform Fees', amount: summary?.platform_fees ?? 0, type: 'negative' as const },
    { label: 'Gateway Fees', amount: summary?.gateway_fees ?? 0, type: 'negative' as const },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <StatCard
          key={kpi.label}
          label={kpi.label}
          value={isLoading ? '...' : formatPaise(kpi.amount)}
        />
      ))}
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col gap-1">
        <h3 className="text-sm font-medium text-muted-foreground">Sales Count</h3>
        {isLoading ? (
          <div className="h-8 w-16 animate-pulse bg-muted rounded mt-1" />
        ) : (
          <div className="text-2xl font-semibold tracking-tight">{summary?.sales_count ?? 0}</div>
        )}
      </div>
    </div>
  );
}
