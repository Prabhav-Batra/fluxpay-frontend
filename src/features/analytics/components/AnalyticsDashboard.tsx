'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { addDays, isoDay } from '@/lib/dates';
import { RangePicker } from './RangePicker';
import { KPICards } from './KPICards';
import { RevenueChart } from './RevenueChart';
import { TopProductsList } from './TopProductsList';
import { RecentSalesList } from './RecentSalesList';

export type DateRange = {
  from: string;
  to: string;
  label: string;
};

export function AnalyticsDashboard() {
  const today = new Date();
  const [range, setRange] = useState<DateRange>({
    from: isoDay(addDays(today, -6)),
    to: isoDay(today),
    label: '7d',
  });

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader title="Analytics" description="Monitor your sales and revenue." />
        <RangePicker value={range} onChange={setRange} />
      </div>

      <KPICards range={{ from: range.from, to: range.to }} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart range={{ from: range.from, to: range.to }} />
        </div>
        <div className="flex flex-col gap-6">
          <TopProductsList range={{ from: range.from, to: range.to }} />
        </div>
      </div>

      <div className="mt-2">
        <RecentSalesList />
      </div>
    </div>
  );
}
