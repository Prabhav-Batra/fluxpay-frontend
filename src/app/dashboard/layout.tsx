'use client';

import { Suspense, type ReactNode } from 'react';

import { AppShell } from '@/components/shell/AppShell';
import { dashboardNav } from '@/components/shell/dashboardNav';
import { ModeSwitch } from '@/components/shell/ModeSwitch';
import { TestModeBanner } from '@/components/shell/TestModeBanner';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { UserMenu } from '@/features/auth/components/UserMenu';
import { ModeProvider } from '@/lib/mode/ModeProvider';


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <AuthGuard role="merchant_owner">
        <ModeProvider>
          <AppShell
            nav={dashboardNav}
            homeHref="/dashboard"
            banner={<TestModeBanner />}
            actions={
              <>
                <ModeSwitch />
                <UserMenu />
              </>
            }
          >
            {children}
          </AppShell>
        </ModeProvider>
      </AuthGuard>
    </Suspense>
  );
}
