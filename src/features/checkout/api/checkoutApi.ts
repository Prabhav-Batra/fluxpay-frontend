import { apiFetch } from '@/lib/api/client';
import type { Mode } from '@/lib/api/types';

export interface CheckoutProduct {
  name: string;
  description: string;
  image_url: string;
}

export interface CheckoutMerchant {
  name: string;
  logo_url: string;
  brand_color: string;
}

export interface PublicCheckoutSession {
  id: string;
  mode: Mode;
  status: 'open' | 'completed' | 'expired';
  amount: number;
  currency: string;
  product: CheckoutProduct;
  merchant: CheckoutMerchant;
  success_url: string;
  cancel_url: string;
  expires_at: string;
}

export interface PaymentInstructions {
  gateway: string;
  key_id: string;
  order_id: string;
  amount: number;
  currency: string;
  merchant_name: string;
  product_name: string;
}

/** Fetches the public checkout session details. */
export async function fetchCheckoutSession(id: string): Promise<PublicCheckoutSession> {
  return apiFetch(`/public/checkout_sessions/${id}`);
}

/** Initiates payment and returns gateway instructions (e.g., Razorpay order details). */
export async function startCheckoutPayment(id: string): Promise<PaymentInstructions> {
  return apiFetch(`/public/checkout_sessions/${id}/pay`, {
    method: 'POST',
  });
}

export interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success_url: string;
}

/** Verifies the payment signature and marks the session as completed. */
export async function verifyCheckoutPayment(id: string, data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
  return apiFetch(`/public/checkout_sessions/${id}/verify`, {
    method: 'POST',
    body: data,
  });
}
