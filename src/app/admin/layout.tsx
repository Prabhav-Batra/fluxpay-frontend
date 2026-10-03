'use client';

import { Suspense, type ReactNode } from 'react';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { AppShell } from '@/components/shell/AppShell';
import { UserMenu } from '@/features/auth/components/UserMenu';
import { Users } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <AuthGuard role="platform_admin">
        <AppShell
          nav={[{ href: '/admin', label: 'Merchants', icon: Users, exact: true }]}
          homeHref="/admin"
          actions={<UserMenu />}
        >
          {children}
        </AppShell>
      </AuthGuard>
    </Suspense>
  );
}
