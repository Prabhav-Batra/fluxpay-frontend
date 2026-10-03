'use client';

import { PageHeader } from '@/components/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { SettingsForm } from '@/features/settings/components/SettingsForm';
import { useMerchant } from '@/features/settings/hooks/useMerchant';

export default function SettingsPage() {
  const { data: merchant, isLoading, error } = useMerchant();

  if (error) {
    return (
      <div className="p-6 md:p-8">
        <p className="text-destructive">Failed to load settings.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <PageHeader title="Settings" description="Manage your merchant profile and branding." />
      {isLoading || !merchant ? (
        <div className="grid gap-6 max-w-xl">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <SettingsForm merchant={merchant} />
      )}
    </div>
  );
}
