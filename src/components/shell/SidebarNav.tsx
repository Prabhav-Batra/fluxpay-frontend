import Link from 'next/link';

import { cn } from '@/lib/utils';

import type { NavItem } from './navTypes';

interface SidebarNavProps {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}

function isActive(item: NavItem, pathname: string): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Vertical list of section links; marks the current section with aria-current. */
export function SidebarNav({ items, pathname, onNavigate }: SidebarNavProps) {
  return (
    <nav aria-label="Main" className="grid gap-1">
      {items.map((item) => {
        const active = isActive(item, pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
            )}
          >
            <Icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
