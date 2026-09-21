import { act, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { routes } from '../../app/routes';
import { FAQ_ITEMS } from '../../data/faq';

const scrollTo = vi.fn();
const scrollIntoView = vi.fn();

beforeAll(() => {
  window.scrollTo = scrollTo;
  Element.prototype.scrollIntoView = scrollIntoView;
});

describe('FaqPage', () => {
  it('renders every question with its anchor id', () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/faq'] })} />);
    expect(screen.getByTestId('faq-page').querySelector('h1')).toHaveTextContent('Good to know');
    for (const item of FAQ_ITEMS) {
      const el = screen.getByTestId(`faq-item-${item.id}`);
      expect(el).toHaveAttribute('id', item.id);
      expect(el).toHaveTextContent(item.question);
      expect(el).toHaveTextContent(item.answer);
      expect(el.querySelector('svg')).not.toBeNull();
    }
  });

  it('scrolls to the hash target on client-side navigation instead of the top', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] });
    render(<RouterProvider router={router} />);
    await act(async () => {
      await router.navigate('/faq#option-availability');
    });
    expect(await screen.findByTestId('faq-page')).toBeInTheDocument();
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
    expect(scrollIntoView.mock.instances[0]).toBe(
      screen.getByTestId('faq-item-option-availability'),
    );
    expect(scrollTo).not.toHaveBeenCalled();
    expect(screen.getByTestId('main')).toHaveFocus();
  });
});
