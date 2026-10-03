import { Metadata } from 'next';
import { CheckoutPage } from '@/features/checkout/components/CheckoutPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Checkout',
};

export default async function Page({ params }: PageProps) {
  const resolved = await params;
  return <CheckoutPage id={resolved.id} />;
}
