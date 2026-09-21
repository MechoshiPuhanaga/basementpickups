import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FilterDisclosure } from './FilterDisclosure';

describe('FilterDisclosure', () => {
  it('wraps its children in a dissolve disclosure with the active filters as chips', () => {
    render(
      <FilterDisclosure filters={['Newest first', 'PAF']} data-testid="f">
        <select aria-label="Sort" />
      </FilterDisclosure>,
    );
    const root = screen.getByTestId('f');
    expect(root).toHaveAttribute('data-desktop', 'dissolve');
    const trigger = screen.getByTestId('f-trigger');
    expect(trigger).toHaveTextContent('Filters');
    expect(trigger).toHaveTextContent('Newest first');
    expect(trigger).toHaveTextContent('PAF');
    expect(trigger.querySelector('svg')).not.toBeNull();
    expect(screen.getByTestId('f-panel').querySelector('select')).not.toBeNull();
  });

  it('accepts a custom label', () => {
    render(
      <FilterDisclosure filters={[]} label="Refine" data-testid="f">
        <p>x</p>
      </FilterDisclosure>,
    );
    expect(screen.getByTestId('f-trigger')).toHaveTextContent('Refine');
  });
});
