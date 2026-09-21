import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProductLayout } from './ProductLayout';

describe('ProductLayout', () => {
  it('renders without test ids when none is given', () => {
    const { container } = render(<ProductLayout gallery={<span />} details={<span />} />);
    expect(container.querySelector('[data-testid]')).toBeNull();
  });

  it('places gallery and details in their slots', () => {
    render(
      <ProductLayout
        data-testid="pl"
        className="c"
        gallery={<img alt="" />}
        details={<p>Details</p>}
      />,
    );
    expect(screen.getByTestId('pl')).toHaveClass('c');
    expect(screen.getByTestId('pl-gallery').querySelector('img')).not.toBeNull();
    expect(screen.getByTestId('pl-details')).toHaveTextContent('Details');
  });
});
