import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Surface } from './Surface';

describe('Surface', () => {
  it('renders a base surface without border by default', () => {
    render(<Surface data-testid="s">x</Surface>);
    const surface = screen.getByTestId('s');
    expect(surface.tagName).toBe('DIV');
    expect(surface).toHaveAttribute('data-variant', 'base');
    expect(surface).toHaveAttribute('data-border', 'none');
  });

  it('forwards variant, border, className and element type', () => {
    render(
      <Surface data-testid="s" as="aside" variant="raised" border="gold" className="c">
        x
      </Surface>,
    );
    const surface = screen.getByTestId('s');
    expect(surface.tagName).toBe('ASIDE');
    expect(surface).toHaveAttribute('data-variant', 'raised');
    expect(surface).toHaveAttribute('data-border', 'gold');
    expect(surface).toHaveClass('c');
  });
});
