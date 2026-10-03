/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useCheckoutSession, useStartPayment, useVerifyPayment } from '../hooks/useCheckout';
import { Button } from '@/components/ui/button';
import { FullPageSpinner } from '@/components/FullPageSpinner';
import { formatPaise } from '@/lib/money';

interface CheckoutPageProps {
  id: string;
}

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

export function CheckoutPage({ id }: CheckoutPageProps) {
  const { data: session, isLoading, error } = useCheckoutSession(id);
  const payMutation = useStartPayment();
  const verifyMutation = useVerifyPayment(id);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (isLoading) return <FullPageSpinner />;
  if (error || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Checkout Unavailable</h1>
          <p className="text-muted-foreground mt-2">
            {error?.message || 'This checkout session could not be found.'}
          </p>
        </div>
      </div>
    );
  }

  const { product, merchant, status } = session;

  const handlePay = async () => {
    setPaymentError(null);
    try {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        setPaymentError('Failed to load payment gateway. Please check your connection.');
        return;
      }

      const instructions = await payMutation.mutateAsync(id);

      const options = {
        key: instructions.key_id,
        amount: instructions.amount.toString(),
        currency: instructions.currency,
        name: instructions.merchant_name,
        description: instructions.product_name,
        order_id: instructions.order_id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          try {
            const verifyRes = await verifyMutation.mutateAsync({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            window.location.href = verifyRes.success_url;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            setPaymentError(err.message || 'Payment verification failed.');
          }
        },
        theme: {
          color: merchant.brand_color || '#000000',
        },
      };

      const paymentObject = new (window as any).Razorpay(options); // eslint-disable-line @typescript-eslint/no-explicit-any
      paymentObject.on('payment.failed', function (response: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        setPaymentError(response.error.description || 'Payment failed.');
      });
      paymentObject.open();
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setPaymentError(err.message || 'Something went wrong while initiating payment.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 md:p-8">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-lg ring-1 ring-foreground/5">
        <div 
          className="h-32 w-full bg-muted flex items-center justify-center"
          style={{ backgroundColor: merchant.brand_color || 'var(--primary)' }}
        >
          {merchant.logo_url ? (
                        <img src={merchant.logo_url} alt={merchant.name} className="h-16 w-16 rounded-full border-4 border-card object-cover shadow-sm bg-white" />
          ) : (
            <div className="h-16 w-16 rounded-full border-4 border-card bg-white shadow-sm flex items-center justify-center">
              <span className="text-2xl font-bold text-muted-foreground">{merchant.name.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold tracking-tight">{product.name}</h2>
            <p className="text-muted-foreground text-sm mt-1">{product.description}</p>
          </div>

          {product.image_url && (
            <div className="rounded-xl overflow-hidden border">
                            <img src={product.image_url} alt={product.name} className="w-full h-auto aspect-video object-cover" />
            </div>
          )}

          <div className="flex items-center justify-between border-t border-b py-4">
            <span className="font-medium">Total to pay</span>
            <span className="text-2xl font-semibold tabular-nums">{formatPaise(session.amount)}</span>
          </div>

          {status === 'open' ? (
            <div className="grid gap-4">
              <Button 
                size="lg" 
                className="w-full h-12 text-lg" 
                onClick={handlePay}
                disabled={payMutation.isPending}
                style={{ backgroundColor: merchant.brand_color || undefined }}
              >
                {payMutation.isPending || verifyMutation.isPending ? 'Processing...' : 'Pay Now'}
              </Button>
              {paymentError && <p className="text-sm text-destructive text-center">{paymentError}</p>}
            </div>
          ) : (
            <div className="rounded-lg bg-muted p-4 text-center">
              {status === 'completed' ? (
                <div>
                  <h3 className="font-medium text-emerald-600">Already Paid</h3>
                  <p className="text-sm text-muted-foreground mt-1">This checkout session has already been completed.</p>
                </div>
              ) : (
                <div>
                  <h3 className="font-medium text-destructive">Session Expired</h3>
                  <p className="text-sm text-muted-foreground mt-1">This checkout session is no longer valid.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
