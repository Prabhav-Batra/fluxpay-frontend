/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useAnalyticsTimeseries } from '../hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { formatPaise } from '@/lib/money';

interface RevenueChartProps {
  range: { from: string; to: string };
}

export function RevenueChart({ range }: RevenueChartProps) {
  const { data, isLoading, error } = useAnalyticsTimeseries(range);
  const [showSalesCount, setShowSalesCount] = useState(false);

  if (error) {
    return <div className="text-destructive text-sm p-6 border rounded-xl">Failed to load chart.</div>;
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow h-[400px] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold leading-none tracking-tight">Revenue over time</h3>
        <div className="flex items-center space-x-2">
          <Switch 
            id="show-sales" 
            checked={showSalesCount} 
            onCheckedChange={setShowSalesCount} 
          />
          <Label htmlFor="show-sales">Show sales count</Label>
        </div>
      </div>
      
      {isLoading || !data ? (
        <Skeleton className="flex-1 w-full" />
      ) : (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(val) => val.slice(5)} // MM-DD
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(val) => `₹${val / 100}`}
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              {showSalesCount && (
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                />
              )}
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
                formatter={(value: any, name: any) => {
                  if (name === 'Revenue') return [formatPaise(value), 'Revenue'];
                  return [value, 'Sales'];
                }}
                labelStyle={{ color: 'var(--foreground)', marginBottom: '8px' }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                name="Revenue"
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                strokeWidth={2}
              />
              {showSalesCount && (
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="sales_count" 
                  name="Sales Count"
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
