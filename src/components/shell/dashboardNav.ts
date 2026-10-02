import {
  Code2,
  House,
  Link2,
  Package,
  ReceiptIndianRupee,
  Settings,
  Wallet,
} from 'lucide-react';

import type { NavItem } from './navTypes';

export const dashboardNav: NavItem[] = [
  { href: '/dashboard', label: 'Home', icon: House, exact: true },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/payment-links', label: 'Payment links', icon: Link2 },
  { href: '/dashboard/sales', label: 'Sales', icon: ReceiptIndianRupee },
  { href: '/dashboard/balance', label: 'Balance', icon: Wallet },
  { href: '/dashboard/developers', label: 'Developers', icon: Code2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];
