import { MerchantDetail } from '@/features/admin/components/MerchantDetail';

export default async function MerchantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MerchantDetail id={id} />;
}
