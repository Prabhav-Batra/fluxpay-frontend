import { Badge } from '@/components/ui/badge';

import type { DeliveryStatus } from '../api/developersApi';

const LABEL: Record<DeliveryStatus, string> = {
  pending: 'Pending',
  succeeded: 'Succeeded',
  failed: 'Failed',
};

/** Status pill for one webhook delivery. */
export function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
  const variant = status === 'failed' ? 'destructive' : status === 'succeeded' ? 'secondary' : 'outline';
  return <Badge variant={variant}>{LABEL[status]}</Badge>;
}
