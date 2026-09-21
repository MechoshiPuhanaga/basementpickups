import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Price } from './Price';

describe('Price', () => {
  it('formats numeric amounts in euros by default', () => {
    render(<Price data-testid="price" amount={1250} />);
    const price = screen.getByTestId('price');
    expect(price).toHaveAttribute('data-size', 'md');
    expect(price).toHaveAttribute('data-tone', 'primary');
    expect(price).toHaveTextContent('€1,250');
    expect(price.querySelector('[aria-hidden="true"]')).toHaveTextContent('€');
  });

  it('keeps up to two decimals and drops trailing zeros', () => {
    render(
      <>
        <Price data-testid="a" amount={99.5} />
        <Price data-testid="b" amount={12.345} />
      </>,
    );
    expect(screen.getByTestId('a')).toHaveTextContent('€99.5');
    expect(screen.getByTestId('b')).toHaveTextContent('€12.35');
  });

  it('passes string amounts through and forwards currency, size, tone, className', () => {
    render(
      <Price
        data-testid="price"
        amount="from 125"
        currency="$"
        size="lg"
        tone="gold"
        className="c"
      />,
    );
    const price = screen.getByTestId('price');
    expect(price).toHaveTextContent('$from 125');
    expect(price).toHaveAttribute('data-size', 'lg');
    expect(price).toHaveAttribute('data-tone', 'gold');
    expect(price).toHaveClass('c');
  });
});
