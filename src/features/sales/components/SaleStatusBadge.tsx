import { Badge } from '@/components/ui/badge';

import type { SaleStatus } from '../api/salesApi';
import { SALE_STATUS_LABEL } from './saleLabels';

/** Coloured status pill for a sale. */
export function SaleStatusBadge({ status }: { status: SaleStatus }) {
  const variant = status === 'paid' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{SALE_STATUS_LABEL[status]}</Badge>;
}
