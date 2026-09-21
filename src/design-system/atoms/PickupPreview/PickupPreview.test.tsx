import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PickupPreview } from './PickupPreview';

describe('PickupPreview', () => {
  it('renders a labelled image of a humbucker with slug and screw coils', () => {
    render(
      <PickupPreview
        data-testid="preview"
        type="humbucker"
        polepieces="nickel"
        label="Slug coil black, screw coil cream"
        coils={[
          { style: 'slug', color: 'black' },
          { style: 'screw', color: 'cream' },
        ]}
      />,
    );
    const svg = screen.getByTestId('preview');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label', 'Slug coil black, screw coil cream');
    expect(svg).toHaveAttribute('data-polepieces', 'nickel');
    expect(svg).toHaveAttribute('data-type', 'humbucker');
    // plate + 2 coil bodies, 6 poles per coil, slots only on the screw coil
    expect(svg.querySelectorAll('circle')).toHaveLength(12);
    expect(svg.querySelectorAll('line')).toHaveLength(6);
    const coils = svg.querySelectorAll('g[data-color]');
    expect(coils[0]).toHaveAttribute('data-color', 'black');
    expect(coils[1]).toHaveAttribute('data-color', 'cream');
    expect(svg).toHaveAttribute('viewBox', '0 0 77 42.5');
  });

  it('renders a blade coil as one bar and honours the pole count', () => {
    render(
      <PickupPreview
        data-testid="preview"
        type="single"
        polepieces="black"
        label="Blade"
        poles={7}
        className="p"
        coils={[{ style: 'blade', color: 'white' }]}
      />,
    );
    const svg = screen.getByTestId('preview');
    expect(svg.querySelectorAll('circle')).toHaveLength(0);
    expect(svg.querySelectorAll('rect')).toHaveLength(3);
    expect(svg).toHaveClass('p');
  });

  it('draws a single pole without a step and an empty coil list as one slot', () => {
    render(
      <>
        <PickupPreview
          data-testid="one"
          type="p90"
          polepieces="gold"
          label="One"
          poles={1}
          coils={[{ style: 'slug', color: 'cream' }]}
        />
        <PickupPreview data-testid="none" type="p90" polepieces="gold" label="None" coils={[]} />
      </>,
    );
    expect(screen.getByTestId('one').querySelectorAll('circle')).toHaveLength(1);
    expect(screen.getByTestId('none').querySelectorAll('g[data-color]')).toHaveLength(0);
    expect(screen.getByTestId('none')).toHaveAttribute('viewBox', '0 0 85 31');
  });
});
