import { MerchantsTable } from '@/features/admin/components/MerchantsTable';
import { PageHeader } from '@/components/PageHeader';

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <PageHeader title="Merchants" description="Manage platform merchants." />
      <MerchantsTable />
    </div>
  );
}
