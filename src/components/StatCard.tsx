import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  emphasis?: boolean;
}

/** Single KPI tile: label, large value and optional hint. */
export function StatCard({ label, value, hint, emphasis }: StatCardProps) {
  return (
    <Card className={cn('gap-2', emphasis && 'border-primary/40')}>
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn('font-semibold tabular-nums', emphasis ? 'text-3xl' : 'text-2xl')}>{value}</p>
        {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
      </CardContent>
    </Card>
  );
}
