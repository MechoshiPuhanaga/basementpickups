import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FaqIcon, type FaqIconName } from './FaqIcon';

const NAMES: readonly FaqIconName[] = [
  'made-to-order',
  'handwork',
  'batch-variation',
  'measurement-conditions',
  'specifications',
  'measured',
  'packaging',
  'wiring',
  'signature',
  'coil-wiring',
  'bobbin-colour',
  'more-options',
  'option-availability',
];

describe('FaqIcon', () => {
  it('renders a decorative 28px icon by default', () => {
    render(<FaqIcon data-testid="icon" name="handwork" />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('focusable', 'false');
    expect(icon).toHaveAttribute('width', '28');
    expect(icon).toHaveAttribute('data-name', 'handwork');
  });

  it.each(NAMES)('draws linework for %s', (name) => {
    render(<FaqIcon data-testid="icon" name={name} size={20} className="i" />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('width', '20');
    expect(icon).toHaveClass('i');
    expect(icon.querySelectorAll('path, circle').length).toBeGreaterThan(0);
  });
});
