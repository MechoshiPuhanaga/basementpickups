import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { pickups, type Pickup } from '../../../data/pickups';
import { ProductBrowser } from './ProductBrowser';

function cardSlugs(): string[] {
  return Array.from(
    screen.getByTestId('product-browser-grid').querySelectorAll('[data-testid^="product-card-"]'),
  )
    .map((el) => el.getAttribute('data-testid') ?? '')
    .filter((id) => !id.endsWith('-name') && !id.endsWith('-price'))
    .map((id) => id.replace('product-card-', ''));
}

function renderBrowser(list: readonly Pickup[] = pickups) {
  return render(
    <MemoryRouter>
      <ProductBrowser pickups={list} />
    </MemoryRouter>,
  );
}

function inductance(p: Pickup): number {
  const m = /([\d.]+)/.exec(p.specs.inductance ?? '');
  return m?.[1] === undefined ? Number.POSITIVE_INFINITY : Number.parseFloat(m[1]);
}

describe('ProductBrowser', () => {
  it('lists every model in catalog order by default', () => {
    renderBrowser();
    expect(cardSlugs()).toEqual(pickups.map((p) => p.slug));
    expect(screen.getByTestId('product-browser-count')).toHaveTextContent(
      `${String(pickups.length)} models`,
    );
    expect(screen.getByTestId('product-browser-filters-trigger')).toHaveTextContent('Featured');
  });

  it.each([
    ['name', (a: Pickup, b: Pickup) => a.name.localeCompare(b.name)],
    ['name-desc', (a: Pickup, b: Pickup) => b.name.localeCompare(a.name)],
    ['price-asc', (a: Pickup, b: Pickup) => a.price - b.price],
    ['price-desc', (a: Pickup, b: Pickup) => b.price - a.price],
    ['inductance-asc', (a: Pickup, b: Pickup) => inductance(a) - inductance(b)],
    ['inductance-desc', (a: Pickup, b: Pickup) => inductance(b) - inductance(a)],
  ] as const)('sorts by %s', async (key, compare) => {
    const user = userEvent.setup();
    renderBrowser();
    await user.selectOptions(screen.getByTestId('product-browser-sort-select'), key);
    expect(cardSlugs()).toEqual([...pickups].sort(compare).map((p) => p.slug));
    await user.selectOptions(screen.getByTestId('product-browser-sort-select'), 'featured');
    expect(cardSlugs()).toEqual(pickups.map((p) => p.slug));
  });

  it('filters by type and magnet, including variant magnets, and shows chips', async () => {
    const user = userEvent.setup();
    renderBrowser();
    await user.selectOptions(screen.getByTestId('product-browser-magnet-select'), 'alnico-3');
    // Alnico 3 only appears on a neck variant; its parent set stays visible.
    const withA3 = pickups.filter(
      (p) => p.magnet === 'alnico-3' || (p.variants ?? []).some((v) => v.magnet === 'alnico-3'),
    );
    expect(cardSlugs()).toEqual(withA3.map((p) => p.slug));
    expect(screen.getByTestId('product-browser-filters-trigger')).toHaveTextContent('Alnico 3');

    await user.selectOptions(screen.getByTestId('product-browser-type-select'), 'humbucker');
    expect(screen.getByTestId('product-browser-filters-trigger')).toHaveTextContent('Humbucker');
    expect(cardSlugs()).toEqual(withA3.map((p) => p.slug));

    await user.selectOptions(screen.getByTestId('product-browser-magnet-select'), 'all');
    expect(cardSlugs()).toEqual(pickups.map((p) => p.slug));
  });

  it('reports a single match in the singular', () => {
    renderBrowser(pickups.slice(0, 1));
    expect(screen.getByTestId('product-browser-count')).toHaveTextContent(/^1 model$/);
  });

  it('shows an empty state when nothing is available', () => {
    renderBrowser([]);
    expect(screen.getByTestId('product-browser-count')).toHaveTextContent('0 models');
    expect(screen.getByTestId('product-browser-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('product-browser-grid')).toBeNull();
  });

  it('orders the type and magnet options canonically and sorts unknown inductance last', async () => {
    const user = userEvent.setup();
    const base = pickups[0];
    if (base === undefined) throw new Error('fixture');
    const odd: Pickup = {
      ...base,
      id: 'odd',
      slug: 'odd',
      name: 'Aaa Odd',
      type: 'p90',
      magnet: 'ceramic',
      variants: [{ ...base, id: 'odd-v', slug: 'odd-v', type: 'single', magnet: 'neodymium' }],
      specs: {},
    };
    renderBrowser([...pickups, odd]);
    const types = Array.from(
      screen.getByTestId<HTMLSelectElement>('product-browser-type-select').options,
    ).map((o) => o.value);
    expect(types).toEqual(['all', 'humbucker', 'single', 'p90']);
    const magnets = Array.from(
      screen.getByTestId<HTMLSelectElement>('product-browser-magnet-select').options,
    ).map((o) => o.value);
    expect(magnets[magnets.length - 1]).toBe('neodymium');
    expect(magnets[magnets.length - 2]).toBe('ceramic');

    await user.selectOptions(screen.getByTestId('product-browser-sort-select'), 'inductance-asc');
    const slugs = cardSlugs();
    expect(slugs[slugs.length - 1]).toBe('odd');
    await user.selectOptions(screen.getByTestId('product-browser-type-select'), 'single');
    expect(cardSlugs()).toEqual(['odd']);
  });
});
