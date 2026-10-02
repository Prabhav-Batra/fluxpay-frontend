import type { LucideIcon } from 'lucide-react';

/** One sidebar link. `exact` items are active only on their own path. */
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}
