'use client';

import { CopyButton } from '@/components/CopyButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMode } from '@/lib/mode/useMode';

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="bg-muted relative rounded-md">
      <div className="absolute top-1 right-1">
        <CopyButton value={code} label={label} />
      </div>
      <pre className="overflow-x-auto p-4 pr-12 text-xs leading-relaxed">{code}</pre>
    </div>
  );
}

/** Minimal integration guide: create a checkout session and verify webhooks. */
export function QuickStartPanel() {
  const { mode } = useMode();
  const origin = typeof window === 'undefined' ? 'https://fluxpay.example' : window.location.origin;
  const createSession = `curl ${origin}/api/v1/checkout_sessions \\
  -H "Authorization: Bearer sk_${mode}_..." \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: order-1234" \\
  -d '{
    "product_id": "prod_...",
    "customer_ref": "player_42",
    "success_url": "https://yourapp.com/paid",
    "cancel_url": "https://yourapp.com/cancelled",
    "metadata": { "order_id": "1234" }
  }'`;
  const verify = `// FluxPay-Signature: t=<unix>,v1=<hex>
const [t, v1] = header.split(',').map((p) => p.split('=')[1]);
const expected = crypto
  .createHmac('sha256', process.env.FLUXPAY_WEBHOOK_SECRET)
  .update(\`\${t}.\${rawBody}\`)
  .digest('hex');
const valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))
  && Math.abs(Date.now() / 1000 - Number(t)) < 300;`;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>1. Create a checkout session</CardTitle>
          <CardDescription>
            From your server, then redirect the customer to the returned <code>url</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={createSession} label="Copy checkout session example" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>2. Fulfil on the webhook</CardTitle>
          <CardDescription>
            Grant the purchase when <code>checkout.completed</code> arrives, after checking the
            signature with your endpoint&apos;s <code>whsec_</code> secret (Node.js shown).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={verify} label="Copy signature verification example" />
        </CardContent>
      </Card>
    </div>
  );
}
