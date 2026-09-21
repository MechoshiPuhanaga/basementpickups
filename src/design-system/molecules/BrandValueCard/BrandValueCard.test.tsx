import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { brandValues, type BrandValueIcon } from '../../../data/brandValues';
import { BrandValueCard } from './BrandValueCard';

const base = brandValues[0];
if (base === undefined) throw new Error('fixture: no brand values');

describe('BrandValueCard', () => {
  it('renders title and description with the default test id', () => {
    render(<BrandValueCard value={base} />);
    const card = screen.getByTestId(`brand-value-${base.id}`);
    expect(card).toHaveTextContent(base.title);
    expect(card).toHaveTextContent(base.description);
  });

  it.each<BrandValueIcon>(['handwound', 'materials', 'tone', 'workshop'])(
    'renders the %s icon',
    (icon) => {
      render(<BrandValueCard value={{ ...base, icon }} data-testid="card" />);
      expect(screen.getByTestId('card').querySelector('svg')).not.toBeNull();
    },
  );
});
