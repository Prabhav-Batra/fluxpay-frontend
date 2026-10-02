import { SaleDetailPage } from '@/features/sales/components/SaleDetailPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SaleDetailPage id={id} />;
}
