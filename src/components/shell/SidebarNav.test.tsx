import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { dashboardNav } from './dashboardNav';
import { SidebarNav } from './SidebarNav';

describe('SidebarNav', () => {
  it('should_render_every_dashboard_section', () => {
    render(<SidebarNav items={dashboardNav} pathname="/dashboard" />);
    ['Home', 'Products', 'Payment links', 'Sales', 'Balance', 'Developers', 'Settings'].forEach(
      (name) => expect(screen.getByRole('link', { name })).toBeInTheDocument(),
    );
  });

  it('should_mark_section_active_when_on_nested_page', () => {
    render(<SidebarNav items={dashboardNav} pathname="/dashboard/sales/sale_1" />);
    expect(screen.getByRole('link', { name: 'Sales' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('should_mark_home_active_only_on_exact_path', () => {
    render(<SidebarNav items={dashboardNav} pathname="/dashboard" />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });
});
