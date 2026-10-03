import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchCheckoutSession, startCheckoutPayment, verifyCheckoutPayment } from '../api/checkoutApi';
import type { PublicCheckoutSession, PaymentInstructions, VerifyPaymentRequest, VerifyPaymentResponse } from '../api/checkoutApi';
import { ApiError } from '@/lib/api/errors';

export const checkoutKeys = {
  all: ['checkout'] as const,
  session: (id: string) => [...checkoutKeys.all, 'session', id] as const,
};

export function useCheckoutSession(id: string) {
  return useQuery<PublicCheckoutSession, ApiError>({
    queryKey: checkoutKeys.session(id),
    queryFn: () => fetchCheckoutSession(id),
    retry: false, // Don't retry on 404s for public checkouts
  });
}

export function useStartPayment() {
  return useMutation<PaymentInstructions, ApiError, string>({
    mutationFn: startCheckoutPayment,
  });
}

export function useVerifyPayment(id: string) {
  return useMutation<VerifyPaymentResponse, ApiError, VerifyPaymentRequest>({
    mutationFn: (data) => verifyCheckoutPayment(id, data),
  });
}
