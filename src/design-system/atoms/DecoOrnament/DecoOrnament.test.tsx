import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DecoOrnament } from './DecoOrnament';

describe('DecoOrnament', () => {
  it('renders an outlined diamond by default', () => {
    render(<DecoOrnament data-testid="orn" />);
    const orn = screen.getByTestId('orn');
    expect(orn).toHaveAttribute('width', '14');
    expect(orn).toHaveAttribute('height', '14');
    expect(orn).toHaveAttribute('fill', 'none');
    expect(orn).toHaveAttribute('stroke', 'currentColor');
    expect(orn).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a filled diamond at a custom size', () => {
    render(<DecoOrnament data-testid="orn" filled size={8} className="d" />);
    const orn = screen.getByTestId('orn');
    expect(orn).toHaveAttribute('width', '8');
    expect(orn).toHaveAttribute('fill', 'currentColor');
    expect(orn).toHaveAttribute('stroke', 'none');
    expect(orn).toHaveClass('d');
  });

  it('renders the centerpiece with a 5:1 ratio', () => {
    render(
      <>
        <DecoOrnament data-testid="default" variant="centerpiece" />
        <DecoOrnament data-testid="sized" variant="centerpiece" size={100} />
      </>,
    );
    expect(screen.getByTestId('default')).toHaveAttribute('width', '80');
    expect(screen.getByTestId('default')).toHaveAttribute('height', '16');
    expect(screen.getByTestId('sized')).toHaveAttribute('width', '100');
    expect(screen.getByTestId('sized')).toHaveAttribute('height', '20');
    expect(screen.getByTestId('sized').querySelectorAll('line')).toHaveLength(2);
  });
});
