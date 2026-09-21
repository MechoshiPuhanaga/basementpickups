import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders defaults (outline / gold / sm) with its content', () => {
    render(<Badge data-testid="badge">New</Badge>);
    const badge = screen.getByTestId('badge');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveAttribute('data-variant', 'outline');
    expect(badge).toHaveAttribute('data-tone', 'gold');
    expect(badge).toHaveAttribute('data-size', 'sm');
    expect(badge).toHaveTextContent('New');
  });

  it('maps variant, tone, size and className', () => {
    render(
      <Badge data-testid="badge" variant="solid" tone="muted" size="md" className="extra">
        Sold out
      </Badge>,
    );
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-variant', 'solid');
    expect(badge).toHaveAttribute('data-tone', 'muted');
    expect(badge).toHaveAttribute('data-size', 'md');
    expect(badge).toHaveClass('extra');
  });
});
