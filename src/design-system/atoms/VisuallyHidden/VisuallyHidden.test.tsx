import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders a span with its content available to assistive tech', () => {
    render(<VisuallyHidden data-testid="vh">Skip</VisuallyHidden>);
    const el = screen.getByTestId('vh');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveTextContent('Skip');
    expect(el).not.toHaveAttribute('role');
  });

  it('supports live-region semantics and a custom element', () => {
    render(
      <VisuallyHidden data-testid="vh" as="div" role="status" aria-live="polite" className="c">
        3 items
      </VisuallyHidden>,
    );
    const el = screen.getByTestId('vh');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('aria-live', 'polite');
    expect(el).toHaveClass('c');
  });
});
