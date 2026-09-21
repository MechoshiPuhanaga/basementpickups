import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Grid } from './Grid';

describe('Grid', () => {
  it('defaults to 3 columns, 1 on mobile, large gap', () => {
    render(<Grid data-testid="grid">a</Grid>);
    const grid = screen.getByTestId('grid');
    expect(grid.tagName).toBe('DIV');
    expect(grid).toHaveAttribute('data-columns', '3');
    expect(grid).toHaveAttribute('data-mobile-columns', '1');
    expect(grid).toHaveAttribute('data-gap', 'lg');
    expect(grid).not.toHaveAttribute('data-align');
  });

  it('forwards columns, mobileColumns, gap, align and element type', () => {
    render(
      <Grid data-testid="grid" as="ul" columns={2} mobileColumns={2} gap="sm" align="center">
        <li>a</li>
      </Grid>,
    );
    const grid = screen.getByTestId('grid');
    expect(grid.tagName).toBe('UL');
    expect(grid).toHaveAttribute('data-columns', '2');
    expect(grid).toHaveAttribute('data-mobile-columns', '2');
    expect(grid).toHaveAttribute('data-gap', 'sm');
    expect(grid).toHaveAttribute('data-align', 'center');
  });
});
