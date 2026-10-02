import { DetailList } from '@/components/DetailList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/dates';
import { formatPaise } from '@/lib/money';

import type { SaleDetail } from '../api/salesApi';
import { paymentMethodLabel } from './saleLabels';
import { SaleStatusBadge } from './SaleStatusBadge';

interface SaleDetailViewProps {
  sale: SaleDetail;
  productName?: string;
}

const mono = (value: string) => <span className="font-mono text-xs">{value}</span>;

/** Sale summary, payment and metadata cards. */
export function SaleDetailView({ sale, productName }: SaleDetailViewProps) {
  const metadata = Object.entries(sale.metadata);
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailList
            items={[
              { label: 'Amount', value: formatPaise(sale.amount) },
              { label: 'Refunded', value: formatPaise(sale.refunded_amount) },
              { label: 'Status', value: <SaleStatusBadge status={sale.status} /> },
              { label: 'Product', value: productName ?? mono(sale.product_id) },
              { label: 'Customer ref', value: sale.customer_ref ?? '—' },
              { label: 'Created', value: formatDateTime(sale.created_at) },
              { label: 'Sale ID', value: mono(sale.id) },
              { label: 'Checkout session', value: mono(sale.checkout_session_id) },
            ]}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailList
            items={[
              { label: 'Razorpay payment', value: mono(sale.payment.gateway_payment_id) },
              { label: 'Method', value: paymentMethodLabel(sale.payment.method) },
              { label: 'Gateway fee', value: formatPaise(sale.payment.gateway_fee) },
              { label: 'Payment status', value: sale.payment.status.replace('_', ' ') },
            ]}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          {metadata.length === 0 ? (
            <p className="text-muted-foreground text-sm">No metadata.</p>
          ) : (
            <DetailList items={metadata.map(([key, value]) => ({ label: key, value }))} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
