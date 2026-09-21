import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DecoFrame } from './DecoFrame';

describe('DecoFrame', () => {
  it('is hidden from assistive tech and draws four corners', () => {
    render(<DecoFrame data-testid="frame" />);
    const frame = screen.getByTestId('frame');
    expect(frame).toHaveAttribute('aria-hidden', 'true');
    expect(frame.querySelectorAll('svg')).toHaveLength(4);
  });

  it.each([
    ['panel', 32, 1],
    ['product-card', 36, 2],
    ['hero', 56, 3],
    ['image', 24, 1],
  ] as const)('variant %s uses %ipx corners', (variant, size, paths) => {
    render(<DecoFrame data-testid="frame" variant={variant} className="c" />);
    const frame = screen.getByTestId('frame');
    const corners = frame.querySelectorAll('svg');
    expect(corners[0]).toHaveAttribute('width', String(size));
    expect(corners[0]?.querySelectorAll('path')).toHaveLength(paths);
    expect(frame).toHaveClass('c');
  });
});
