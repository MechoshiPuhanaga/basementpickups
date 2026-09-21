import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EnquirySummary } from './EnquirySummary';

describe('EnquirySummary', () => {
  it('lists items with quantities, options and totals', () => {
    render(
      <EnquirySummary
        items={[
          {
            name: 'Rockroach',
            qty: 2,
            price: 125,
            options: [{ label: 'Wire', value: '4-conductor' }],
          },
          { name: 'Karakonjul', qty: 1, price: 125 },
        ]}
      />,
    );
    const root = screen.getByTestId('enquiry-summary');
    expect(root).toHaveTextContent('Your enquiry');
    const first = screen.getByTestId('enquiry-summary-item-0');
    expect(first).toHaveTextContent('2×');
    expect(first).toHaveTextContent('Rockroach');
    expect(first).toHaveTextContent('Wire: 4-conductor');
    expect(screen.getByTestId('enquiry-summary-item-0-total')).toHaveTextContent('250');
    const second = screen.getByTestId('enquiry-summary-item-1');
    expect(second).not.toHaveTextContent(':');
    expect(screen.getByTestId('enquiry-summary-subtotal')).toHaveTextContent('375');
    expect(root).toHaveTextContent('Indicative subtotal');
  });

  it('accepts a custom title, note and test id', () => {
    render(<EnquirySummary items={[]} title="Picked" note="Custom note" data-testid="es" />);
    const root = screen.getByTestId('es');
    expect(root).toHaveTextContent('Picked');
    expect(root).toHaveTextContent('Custom note');
    expect(screen.getByTestId('es-subtotal')).toHaveTextContent('0');
  });
});
