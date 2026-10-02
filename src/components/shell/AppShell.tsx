'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import type { NavItem } from './navTypes';
import { SidebarNav } from './SidebarNav';

interface AppShellProps {
  nav: NavItem[];
  homeHref: string;
  /** Rendered above the header (e.g. the test-mode banner). */
  banner?: ReactNode;
  /** Header controls on the right (mode switch, user menu). */
  actions: ReactNode;
  children: ReactNode;
}

/** Responsive console layout: fixed sidebar on desktop, slide-over menu on mobile. */
export function AppShell({ nav, homeHref, banner, actions, children }: AppShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const brand = (
    <Link href={homeHref} className="text-lg font-semibold tracking-tight">
      FluxPay
    </Link>
  );

  return (
    <div className="flex min-h-svh flex-col">
      {banner}
      <div className="flex flex-1">
        <aside className="bg-sidebar hidden w-60 shrink-0 border-r p-4 md:block">
          <div className="mb-6 px-3">{brand}</div>
          <SidebarNav items={nav} pathname={pathname} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-3 border-b px-4 md:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4">
                <SheetHeader className="px-3">
                  <SheetTitle>{brand}</SheetTitle>
                </SheetHeader>
                <SidebarNav items={nav} pathname={pathname} onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="md:hidden">{brand}</div>
            <div className="ml-auto flex items-center gap-4">{actions}</div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
