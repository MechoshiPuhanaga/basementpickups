import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Text } from './Text';

describe('Text', () => {
  it('renders a body paragraph by default', () => {
    render(<Text data-testid="t">copy</Text>);
    const text = screen.getByTestId('t');
    expect(text.tagName).toBe('P');
    expect(text).toHaveAttribute('data-variant', 'body');
    expect(text).not.toHaveAttribute('data-tone');
    expect(text).not.toHaveAttribute('data-italic');
    expect(text).toHaveTextContent('copy');
  });

  it('forwards variant, tone, align, weight, italic, className and element type', () => {
    render(
      <Text
        data-testid="t"
        as="span"
        variant="meta"
        tone="muted"
        align="center"
        weight="semibold"
        italic
        className="c"
      >
        x
      </Text>,
    );
    const text = screen.getByTestId('t');
    expect(text.tagName).toBe('SPAN');
    expect(text).toHaveAttribute('data-variant', 'meta');
    expect(text).toHaveAttribute('data-tone', 'muted');
    expect(text).toHaveAttribute('data-align', 'center');
    expect(text).toHaveAttribute('data-weight', 'semibold');
    expect(text).toHaveAttribute('data-italic', 'true');
    expect(text).toHaveClass('c');
  });
});
