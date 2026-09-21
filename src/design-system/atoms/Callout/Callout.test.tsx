import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Callout } from './Callout';

describe('Callout', () => {
  it('defaults to the info tone and renders its message', () => {
    render(<Callout data-testid="callout">Saved</Callout>);
    const callout = screen.getByTestId('callout');
    expect(callout).toHaveAttribute('data-tone', 'info');
    expect(callout).toHaveTextContent('Saved');
  });

  it.each(['success', 'error'] as const)('supports the %s tone', (tone) => {
    render(
      <Callout data-testid="callout" tone={tone} className="c">
        msg
      </Callout>,
    );
    const callout = screen.getByTestId('callout');
    expect(callout).toHaveAttribute('data-tone', tone);
    expect(callout).toHaveClass('c');
  });
});
