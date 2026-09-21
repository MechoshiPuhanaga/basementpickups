import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Box } from './Box';

describe('Box', () => {
  it('renders a div with no padding attributes by default', () => {
    render(<Box data-testid="box">content</Box>);
    const box = screen.getByTestId('box');
    expect(box.tagName).toBe('DIV');
    expect(box).not.toHaveAttribute('data-padding');
    expect(box).not.toHaveAttribute('data-padding-inline');
    expect(box).not.toHaveAttribute('data-padding-block');
    expect(box).toHaveTextContent('content');
  });

  it('is polymorphic and exposes padding props as data attributes', () => {
    render(
      <Box data-testid="box" as="section" padding="lg" paddingInline="sm" paddingBlock="xl">
        x
      </Box>,
    );
    const box = screen.getByTestId('box');
    expect(box.tagName).toBe('SECTION');
    expect(box).toHaveAttribute('data-padding', 'lg');
    expect(box).toHaveAttribute('data-padding-inline', 'sm');
    expect(box).toHaveAttribute('data-padding-block', 'xl');
  });
});
