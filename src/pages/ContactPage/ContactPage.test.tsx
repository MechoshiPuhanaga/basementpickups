import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { routes } from '../../app/routes';

beforeAll(() => {
  window.scrollTo = vi.fn();
  window.matchMedia = vi.fn().mockReturnValue({ matches: false });
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

const CART = [
  {
    slug: 'rockroach',
    name: 'Rockroach',
    price: 125,
    qty: 2,
    config: { bobbins: { 'coil-1': 'red' } },
  },
  { slug: 'ghost', name: 'Ghost', price: 10, qty: 1 },
];

function renderContact(state?: unknown) {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, {
        initialEntries: [state === undefined ? '/contact' : { pathname: '/contact', state }],
      })}
    />,
  );
}

function bodyOf(init: RequestInit | undefined): Record<string, unknown> {
  if (typeof init?.body !== 'string') throw new Error('expected a JSON string body');
  return JSON.parse(init.body) as Record<string, unknown>;
}

function mockFetch(response: Response) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
}

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>, message = 'Hello') {
  await user.type(screen.getByTestId('contact-form-name'), 'Ada');
  await user.type(screen.getByTestId('contact-form-email'), 'ada@example.com');
  await user.selectOptions(screen.getByTestId('contact-form-subject-select'), 'General inquiry');
  if (message !== '') await user.type(screen.getByTestId('contact-form-message'), message);
  await user.click(screen.getByTestId('contact-form-submit'));
}

describe('ContactPage', () => {
  it('renders the intro, the form and the workshop details', () => {
    renderContact();
    const page = screen.getByTestId('contact-page');
    expect(page.querySelector('h1')).toHaveTextContent('Contact the workshop');
    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    expect(screen.getByTestId('contact-email-link')).toHaveAttribute(
      'href',
      'mailto:contact@basementpickups.com',
    );
    expect(screen.queryByTestId('enquiry-summary')).toBeNull();
    expect(screen.getByTestId('contact-form-message')).toBeRequired();
  });

  it('posts a standalone enquiry and leaves the cart untouched', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('bp-enquiry-cart-v1', JSON.stringify(CART));
    const fetchMock = mockFetch(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    renderContact();
    await fillAndSubmit(user);
    expect(await screen.findByTestId('contact-form-success')).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('/api/contact');
    const body = bodyOf(init);
    expect(body).toMatchObject({ name: 'Ada', email: 'ada@example.com', message: 'Hello' });
    expect(body['items']).toBeUndefined();
    expect(screen.getByTestId('cart-link')).toHaveTextContent('Enquiry (3)');
    expect(screen.queryByTestId('enquiry-summary')).toBeNull();
  });

  it('surfaces a server validation message on the flagged field', async () => {
    const user = userEvent.setup();
    mockFetch(
      new Response(JSON.stringify({ ok: false, error: 'Bad email', field: 'email' }), {
        status: 400,
      }),
    );
    renderContact();
    await fillAndSubmit(user);
    expect(await screen.findByTestId('contact-form-field-error-email')).toHaveTextContent(
      'Bad email',
    );
    expect(screen.getByTestId('contact-form-email')).toHaveFocus();
  });

  it('shows a form-level server message when no field is flagged', async () => {
    const user = userEvent.setup();
    mockFetch(
      new Response(JSON.stringify({ ok: false, error: 'Slow down', field: 'nope' }), {
        status: 429,
      }),
    );
    renderContact();
    await fillAndSubmit(user);
    expect(await screen.findByTestId('contact-form-error')).toHaveTextContent('Slow down');
    expect(screen.queryByTestId('contact-form-mailto')).toBeNull();
  });

  it('falls back to a mailto link on a non-JSON 4xx and on a 5xx', async () => {
    const user = userEvent.setup();
    mockFetch(new Response('nope', { status: 400 }));
    renderContact();
    await fillAndSubmit(user);
    const mailto = await screen.findByTestId('contact-form-mailto');
    expect(mailto.getAttribute('href')).toContain('mailto:contact@basementpickups.com');

    vi.restoreAllMocks();
    mockFetch(new Response('', { status: 500 }));
    await user.type(screen.getByTestId('contact-form-message'), '!');
    await user.click(screen.getByTestId('contact-form-submit'));
    await waitFor(() => {
      expect(screen.getByTestId('contact-form-mailto')).toBeInTheDocument();
    });
  });

  it('prefills an enquiry from the cart, sends the items and then clears the cart', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('bp-enquiry-cart-v1', JSON.stringify(CART));
    const fetchMock = mockFetch(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    renderContact({ fromCart: true, subject: 'Order inquiry' });

    const summary = await screen.findByTestId('enquiry-summary');
    expect(summary).toHaveTextContent('Rockroach');
    expect(summary).toHaveTextContent('Slug coil: Red');
    expect(screen.getByTestId('enquiry-summary-item-1')).toHaveTextContent('Ghost');
    expect(screen.getByTestId('contact-form-subject-select')).toHaveValue('Order inquiry');
    expect(screen.getByTestId('contact-form-message')).not.toBeRequired();
    expect(screen.getByTestId('contact-form-message')).toHaveAttribute(
      'placeholder',
      expect.stringContaining('optional'),
    );

    await user.type(screen.getByTestId('contact-form-name'), 'Ada');
    await user.type(screen.getByTestId('contact-form-email'), 'ada@example.com');
    await user.click(screen.getByTestId('contact-form-submit'));
    expect(await screen.findByTestId('contact-form-success')).toBeInTheDocument();

    const [, init] = fetchMock.mock.calls[0] ?? [];
    const items = bodyOf(init)['items'] as Record<string, unknown>[];
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ slug: 'rockroach', qty: 2 });
    expect(items[0]?.['options']).toEqual(
      expect.arrayContaining([{ label: 'Slug coil', value: 'Red' }]) as unknown,
    );
    expect(items[1]?.['options']).toBeUndefined();
    expect(screen.queryByTestId('enquiry-summary')).toBeNull();
    expect(screen.getByTestId('cart-link')).toHaveTextContent(/^Enquiry$/);
    expect(window.localStorage.getItem('bp-enquiry-cart-v1')).toBe('[]');
  });

  it('includes the item list in the mailto fallback when sending from the cart fails', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('bp-enquiry-cart-v1', JSON.stringify(CART));
    mockFetch(new Response('', { status: 502 }));
    renderContact({ fromCart: true, subject: 'Order inquiry' });
    await screen.findByTestId('enquiry-summary');
    await user.type(screen.getByTestId('contact-form-name'), 'Ada');
    await user.type(screen.getByTestId('contact-form-email'), 'ada@example.com');
    await user.click(screen.getByTestId('contact-form-submit'));
    const href = decodeURIComponent(
      (await screen.findByTestId('contact-form-mailto')).getAttribute('href') ?? '',
    );
    expect(href).toContain('Selected pickups:');
    expect(href).toContain('- 2 × Rockroach (Slug coil: Red');
    expect(href).toContain('- 1 × Ghost — €10');
    expect(href).toContain('Indicative subtotal: €260');
    // The cart survives a failed send.
    expect(screen.getByTestId('cart-link')).toHaveTextContent('Enquiry (3)');
  });

  it('ignores the fromCart flag when the cart is empty and non-string state', () => {
    renderContact({ fromCart: true, subject: 42 });
    expect(screen.queryByTestId('enquiry-summary')).toBeNull();
    expect(screen.getByTestId('contact-form-message')).toBeRequired();
    expect(screen.getByTestId('contact-form-subject-select')).toHaveValue('');
  });
});
