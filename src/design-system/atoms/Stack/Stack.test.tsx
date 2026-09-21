import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Stack } from './Stack';

describe('Stack', () => {
  it('renders a column with medium gap by default', () => {
    render(<Stack data-testid="stack">a</Stack>);
    const stack = screen.getByTestId('stack');
    expect(stack.tagName).toBe('DIV');
    expect(stack).toHaveAttribute('data-direction', 'column');
    expect(stack).toHaveAttribute('data-gap', 'md');
    expect(stack).not.toHaveAttribute('data-wrap');
    expect(stack).not.toHaveAttribute('id');
  });

  it('forwards direction, gap, align, justify, wrap, id and element type', () => {
    render(
      <Stack
        data-testid="stack"
        as="nav"
        direction="row"
        gap="xl"
        align="center"
        justify="between"
        wrap
        id="anchor"
        className="c"
      >
        a
      </Stack>,
    );
    const stack = screen.getByTestId('stack');
    expect(stack.tagName).toBe('NAV');
    expect(stack).toHaveAttribute('data-direction', 'row');
    expect(stack).toHaveAttribute('data-gap', 'xl');
    expect(stack).toHaveAttribute('data-align', 'center');
    expect(stack).toHaveAttribute('data-justify', 'between');
    expect(stack).toHaveAttribute('data-wrap', 'true');
    expect(stack).toHaveAttribute('id', 'anchor');
    expect(stack).toHaveClass('c');
  });
});
