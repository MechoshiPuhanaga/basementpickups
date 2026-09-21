import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { routes } from '../../app/routes';

const scrollTo = vi.fn();

beforeAll(() => {
  window.scrollTo = scrollTo;
});

function renderProduct(slug: string) {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: [`/products/${slug}`] })}
    />,
  );
}

describe('ProductPage', () => {
  it('shows a set base view with variant links and no add button', () => {
    renderProduct('white-pearl');
    expect(screen.getByTestId('product-page')).toBeInTheDocument();
    expect(screen.getByTestId('product-title')).toHaveTextContent('White Pearl');
    expect(screen.getByTestId('product-type')).toHaveTextContent('Humbucker');
    expect(screen.getByTestId('product-price')).toHaveTextContent('125');
    expect(screen.getByTestId('product-position-neck')).toBeInTheDocument();
    expect(screen.getByTestId('product-position-bridge')).toBeInTheDocument();
    expect(screen.getByTestId('product-description')).not.toBeEmptyDOMElement();

    const variants = screen.getByTestId('product-variants');
    expect(variants).toHaveTextContent('Choose a position');
    expect(screen.getByTestId('variant-link-white-pearl')).toHaveTextContent('Base');
    expect(screen.getByTestId('variant-link-white-pearl')).toHaveAttribute(
      'data-variant',
      'primary',
    );
    expect(screen.getByTestId('variant-link-white-pearl-neck')).toHaveTextContent('Neck');
    expect(screen.getByTestId('variant-link-white-pearl-neck')).toHaveAttribute(
      'href',
      '/products/white-pearl-neck',
    );
    expect(screen.getByTestId('variant-link-white-pearl-bridge')).toHaveAttribute(
      'data-variant',
      'ghost',
    );
    expect(screen.queryByTestId('add-to-cart')).toBeNull();
    expect(screen.queryByTestId('product-configure')).toBeNull();

    // Per-position magnet and spacing when the variants differ.
    expect(screen.getByTestId('spec-magnet-value')).toHaveTextContent(
      'Alnico 3 (neck) · Alnico 4 (bridge)',
    );
    expect(screen.getByTestId('spec-string-spacing-value')).toHaveTextContent(
      '50 mm (neck) · 52 mm (bridge)',
    );
    expect(screen.getByTestId('spec-positions-value')).toHaveTextContent('neck, bridge');
    expect(screen.getByTestId('spec-cover-value')).toHaveTextContent(
      'Optional (nickel, black or gold)',
    );
    expect(screen.getByTestId('spec-bobbin-colours-white')).toBeInTheDocument();
    expect(screen.queryByTestId('spec-7-string')).toBeNull();
    expect(screen.queryByTestId('spec-self-resonant-peak')).toBeNull();
    expect(screen.getByTestId('product-specs-trigger')).toHaveAttribute('aria-expanded', 'false');
  });

  it('collapses per-position specs when the variants agree', () => {
    renderProduct('chow-chow');
    expect(screen.getByTestId('spec-magnet-value')).toHaveTextContent(/^Alnico 2$/);
    expect(screen.getByTestId('spec-string-spacing-value')).toHaveTextContent(/^49.2 mm$/);
    expect(screen.getByTestId('spec-pole-pieces-value')).toHaveTextContent(/^Nickel$/);
  });

  it('lists per-position magnets but a single spacing when only magnets differ', () => {
    renderProduct('macho-heaven');
    expect(screen.getByTestId('spec-magnet-value')).toHaveTextContent(
      'Alnico 3 (neck) · Alnico 4 (bridge)',
    );
    expect(screen.getByTestId('spec-string-spacing-value')).toHaveTextContent(/^49.2 mm$/);
  });

  it('shows the 7-string note, resonant peaks and the spacing choice on single models', () => {
    renderProduct('rockroach');
    expect(screen.queryByTestId('product-variants')).toBeNull();
    expect(screen.getByTestId('spec-7-string-value')).toHaveTextContent('Available (black only)');
    expect(screen.getByTestId('spec-self-resonant-peak-value')).toHaveTextContent('5.3 kHz');
    expect(screen.getByTestId('spec-loaded-resonant-peak-value')).toHaveTextContent('2.4 kHz');
    expect(screen.getByTestId('spec-string-spacing-value')).toHaveTextContent(/^52 mm$/);
    expect(screen.getByTestId('spec-potting-value')).toHaveTextContent(/^Potted$/);
    expect(screen.getByTestId('spec-magnet-value')).toHaveTextContent(/^Alnico 5$/);
  });

  it('formats a spacing choice and a missing cover', () => {
    renderProduct('twin-bliss');
    expect(screen.getByTestId('spec-string-spacing-value')).toHaveTextContent(/^50 or 52 mm$/);
    expect(screen.getByTestId('spec-cover-value')).toHaveTextContent(/^None$/);
    expect(screen.getByTestId('spec-potting-value')).toHaveTextContent('Unpotted or Potted');
  });

  it('adds a configured variant to the enquiry and reseeds when switching variant', async () => {
    const user = userEvent.setup();
    renderProduct('white-pearl-neck');
    expect(screen.getByTestId('product-title')).toHaveTextContent('White Pearl · Neck');
    expect(screen.getByTestId('spec-magnet-value')).toHaveTextContent(/^Alnico 3$/);
    expect(screen.getByTestId('product-configure')).toBeInTheDocument();
    const add = screen.getByTestId('add-to-cart');
    expect(add).toHaveTextContent('Add to enquiry');

    await user.selectOptions(screen.getByTestId('pickup-configurator-cover-select'), 'gold');
    await user.click(add);
    expect(add).toHaveTextContent('Added to enquiry (1)');
    expect(screen.getByTestId('cart-link')).toHaveTextContent('Enquiry (1)');
    await user.click(add);
    expect(add).toHaveTextContent('Added to enquiry (2)');
    // A different build is a different line.
    await user.selectOptions(screen.getByTestId('pickup-configurator-cover-select'), 'none');
    expect(screen.getByTestId('add-to-cart')).toHaveTextContent('Add to enquiry');
    expect(JSON.parse(window.localStorage.getItem('bp-enquiry-cart-v1') ?? '[]')).toHaveLength(1);

    // Switching variants keeps scroll/focus and reseeds the configurator.
    await user.click(screen.getByTestId('variant-link-white-pearl-bridge'));
    expect(await screen.findByText('White Pearl · Bridge', { selector: 'h1' })).toBeInTheDocument();
    expect(screen.getByTestId('main')).not.toHaveFocus();
    expect(scrollTo).not.toHaveBeenCalled();
    expect(screen.getByTestId('add-to-cart')).toHaveTextContent('Add to enquiry');
    expect(screen.getByTestId('pickup-configurator-cover-select')).toHaveValue('none');
    expect(screen.getByTestId('cart-link')).toHaveTextContent('Enquiry (2)');
  });

  it('shows a not-found state for an unknown slug', () => {
    renderProduct('nope');
    expect(screen.getByTestId('product-not-found')).toHaveTextContent('Pickup not found');
    expect(screen.getByTestId('product-not-found-link')).toHaveAttribute('href', '/shop');
  });
});
