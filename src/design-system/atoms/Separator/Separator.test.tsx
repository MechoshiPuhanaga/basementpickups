import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Separator } from './Separator';

describe('Separator', () => {
  it('renders a horizontal line rule by default', () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep.tagName).toBe('HR');
    expect(sep).toHaveAttribute('data-orientation', 'horizontal');
    expect(sep).toHaveAttribute('aria-orientation', 'horizontal');
    expect(sep).toHaveAttribute('data-tone', 'line');
  });

  it('supports vertical gold rules', () => {
    render(<Separator data-testid="sep" orientation="vertical" tone="gold" className="c" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveAttribute('data-orientation', 'vertical');
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
    expect(sep).toHaveAttribute('data-tone', 'gold');
    expect(sep).toHaveClass('c');
  });
});
