import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DecoSeparator } from './DecoSeparator';

describe('DecoSeparator', () => {
  it('renders the diamond variant as a presentational line + diamond + line', () => {
    render(<DecoSeparator data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveAttribute('role', 'presentation');
    expect(sep).toHaveAttribute('aria-hidden', 'true');
    expect(sep.querySelectorAll('span')).toHaveLength(2);
    expect(sep.querySelectorAll('svg')).toHaveLength(1);
  });

  it('renders the double-line variant as two lines', () => {
    render(<DecoSeparator data-testid="sep" variant="double-line" />);
    const sep = screen.getByTestId('sep');
    expect(sep.querySelectorAll('span')).toHaveLength(2);
    expect(sep.querySelectorAll('svg')).toHaveLength(0);
  });

  it('renders the crest with five spans', () => {
    render(<DecoSeparator data-testid="sep" variant="crest" className="c" />);
    const sep = screen.getByTestId('sep');
    expect(sep.querySelectorAll('span')).toHaveLength(5);
    expect(sep).toHaveClass('c');
  });

  it('renders the medallion as a single filled glyph', () => {
    render(<DecoSeparator data-testid="sep" variant="medallion" />);
    const sep = screen.getByTestId('sep');
    const svg = sep.querySelector('svg');
    expect(svg).toHaveAttribute('fill', 'currentColor');
    expect(sep.querySelectorAll('span')).toHaveLength(0);
  });

  it('renders the small variant like the diamond', () => {
    render(<DecoSeparator data-testid="sep" variant="small" />);
    expect(screen.getByTestId('sep').querySelectorAll('svg')).toHaveLength(1);
  });
});
