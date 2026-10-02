import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Providers } from './providers';

describe('Providers', () => {
  it('should_render_children_when_wrapped', () => {
    render(<Providers><p>hello</p></Providers>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
