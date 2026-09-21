import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DecoCorner } from './DecoCorner';

describe('DecoCorner', () => {
  it('renders a decorative simple corner by default', () => {
    render(<DecoCorner data-testid="corner" />);
    const corner = screen.getByTestId('corner');
    expect(corner.tagName).toBe('svg');
    expect(corner).toHaveAttribute('aria-hidden', 'true');
    expect(corner).toHaveAttribute('width', '40');
    expect(corner).toHaveAttribute('height', '40');
    expect(corner).toHaveAttribute('viewBox', '0 0 48 48');
    expect(corner.querySelectorAll('path')).toHaveLength(1);
  });

  it('draws two paths for stepped and three for double', () => {
    render(
      <>
        <DecoCorner data-testid="stepped" variant="stepped" size={20} />
        <DecoCorner data-testid="double" variant="double" position="bottom-right" />
      </>,
    );
    expect(screen.getByTestId('stepped').querySelectorAll('path')).toHaveLength(2);
    expect(screen.getByTestId('stepped')).toHaveAttribute('width', '20');
    expect(screen.getByTestId('double').querySelectorAll('path')).toHaveLength(3);
  });

  it('renders the bracket as a filled 1200 viewBox glyph', () => {
    render(<DecoCorner data-testid="bracket" variant="bracket" className="x" />);
    const corner = screen.getByTestId('bracket');
    expect(corner).toHaveAttribute('viewBox', '0 0 1200 1200');
    expect(corner).toHaveAttribute('fill', 'currentColor');
    expect(corner).toHaveClass('x');
  });
});
