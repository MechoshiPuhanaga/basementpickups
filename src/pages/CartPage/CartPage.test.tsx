import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { routes } from '../../app/routes';
import { cartLineKey, resolveConfig, type PickupConfig } from '../../data/pickupConfig';
import { getPickupBySlug } from '../../data/pickups';
import { cartLineTestId } from './index';

beforeAll(() => {
  window.scrollTo = vi.fn();
});

interface StoredLine {
  slug: string;
  name: string;
  price: number;
  qty: number;
  config?: PickupConfig;
}

function seed(lines: StoredLine[]): string[] {
  window.localStorage.setItem('bp-enquiry-cart-v1', JSON.stringify(lines));
  return lines.map((line) => {
    const pickup = getPickupBySlug(line.slug);
    // Unknown pickups keep their stored (unresolved) config, exactly like readStorage.
    const config = pickup === undefined ? line.config : resolveConfig(pickup, line.config);
    return cartLineTestId(cartLineKey(line.slug, config));
  });
}

function renderCart(initial = '/cart') {
  const router = createMemoryRouter(routes, { initialEntries: [initial] });
  render(<RouterProvider router={router} />);
  return router;
}

const rockroach = (config: PickupConfig, qty = 1): StoredLine => ({
  slug: 'rockroach',
  name: 'Rockroach',
  price: 125,
  qty,
  config,
});

describe('CartPage', () => {
  it('shows the empty state with a link to the shop', () => {
    renderCart();
    expect(screen.getByTestId('cart-empty')).toHaveTextContent('Your enquiry list is empty');
    expect(screen.getByTestId('cart-empty-shop')).toHaveAttribute('href', '/shop');
  });

  it('lists stored lines with totals, quantity controls and an editable build', async () => {
    const user = userEvent.setup();
    const [a] = seed([
      rockroach({ bobbins: { 'coil-1': 'red' } }, 2),
      { slug: 'karakonjul', name: 'Karakonjul', price: 125, qty: 1 },
    ]);
    if (a === undefined) throw new Error('fixture');
    renderCart();
    expect(await screen.findByTestId('cart-page')).toBeInTheDocument();
    expect(screen.getByTestId('cart-list').querySelectorAll('li')).toHaveLength(2);
    expect(screen.getByTestId(`cart-line-name-${a}`)).toHaveTextContent('Rockroach');
    expect(screen.getByTestId(`cart-qty-${a}`)).toHaveTextContent('2');
    expect(screen.getByTestId(`cart-line-total-${a}`)).toHaveTextContent('250');
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('375');
    expect(screen.getByTestId('cart-link')).toHaveTextContent('Enquiry (3)');
    expect(screen.getByTestId(`cart-config-${a}-bobbin-coil-1-select`)).toHaveValue('red');

    await user.click(screen.getByTestId(`cart-qty-dec-${a}`));
    expect(screen.getByTestId(`cart-qty-${a}`)).toHaveTextContent('1');
    expect(screen.getByTestId(`cart-qty-dec-${a}`)).toBeDisabled();
    await user.click(screen.getByTestId(`cart-qty-inc-${a}`));
    await user.click(screen.getByTestId(`cart-qty-inc-${a}`));
    expect(screen.getByTestId(`cart-qty-${a}`)).toHaveTextContent('3');
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('500');
  });

  it('re-keys a line when its build changes and merges into a matching line', async () => {
    const user = userEvent.setup();
    const [red, blue] = seed([
      rockroach({ bobbins: { 'coil-1': 'red' } }, 1),
      rockroach({ bobbins: { 'coil-1': 'blue' } }, 2),
    ]);
    if (red === undefined || blue === undefined) throw new Error('fixture');
    renderCart();
    expect(await screen.findByTestId(`cart-line-${blue}`)).toBeInTheDocument();

    // Change a non-colliding option: the line gets a new key.
    await user.selectOptions(screen.getByTestId(`cart-config-${blue}-cover-select`), 'gold');
    expect(screen.queryByTestId(`cart-line-${blue}`)).toBeNull();
    const pickup = getPickupBySlug('rockroach');
    if (pickup === undefined) throw new Error('fixture');
    const gold = cartLineTestId(
      cartLineKey(
        'rockroach',
        resolveConfig(pickup, { bobbins: { 'coil-1': 'blue' }, cover: 'gold' }),
      ),
    );
    expect(screen.getByTestId(`cart-qty-${gold}`)).toHaveTextContent('2');

    // Reverting the cover restores the original key.
    await user.selectOptions(screen.getByTestId(`cart-config-${gold}-cover-select`), 'none');
    expect(screen.getByTestId(`cart-qty-${blue}`)).toHaveTextContent('2');
    // Make it identical to the red line: quantities merge.
    await user.selectOptions(screen.getByTestId(`cart-config-${blue}-bobbin-coil-1-select`), 'red');
    expect(screen.getByTestId('cart-list').querySelectorAll('li')).toHaveLength(1);
    expect(screen.getByTestId(`cart-qty-${red}`)).toHaveTextContent('3');
  });

  it('removes lines, moving focus to a neighbour and finally to main', async () => {
    const user = userEvent.setup();
    const [a, b] = seed([
      rockroach({ bobbins: { 'coil-1': 'red' } }),
      { slug: 'karakonjul', name: 'Karakonjul', price: 125, qty: 1 },
    ]);
    if (a === undefined || b === undefined) throw new Error('fixture');
    renderCart();
    await user.click(await screen.findByTestId(`cart-remove-${a}`));
    expect(screen.queryByTestId(`cart-line-${a}`)).toBeNull();
    expect(screen.getByTestId(`cart-remove-${b}`)).toHaveFocus();
    await user.click(screen.getByTestId(`cart-remove-${b}`));
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
    expect(screen.getByTestId('main')).toHaveFocus();
  });

  it('clears the list', async () => {
    const user = userEvent.setup();
    seed([rockroach({})]);
    renderCart();
    await user.click(await screen.findByTestId('cart-clear'));
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument();
    expect(window.localStorage.getItem('bp-enquiry-cart-v1')).toBe('[]');
  });

  it('sends the enquiry to the contact page with the live cart', async () => {
    const user = userEvent.setup();
    seed([rockroach({ bobbins: { 'coil-1': 'red' } }, 2)]);
    renderCart();
    await user.click(await screen.findByTestId('cart-send-enquiry'));
    expect(await screen.findByTestId('contact-page')).toBeInTheDocument();
    const summary = await screen.findByTestId('enquiry-summary');
    expect(summary).toHaveTextContent('2×');
    expect(summary).toHaveTextContent('Rockroach');
    expect(summary).toHaveTextContent('Slug coil: Red');
    expect(screen.getByTestId('contact-form-subject-select')).toHaveValue('Order inquiry');
    expect(screen.getByTestId('contact-form-message')).not.toBeRequired();
  });

  it('drops a stored line whose pickup no longer exists from the configurator', async () => {
    seed([{ slug: 'ghost', name: 'Ghost', price: 10, qty: 1 }]);
    renderCart();
    const line = await screen.findByTestId('cart-line-ghost');
    expect(line).toHaveTextContent('Ghost');
    expect(line.querySelector('fieldset')).toBeNull();
  });
});
