import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MobileMenu } from './MobileMenu';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Deep', href: '/deep/link' },
];

let reduceMotion = false;

beforeEach(() => {
  reduceMotion = false;
  window.matchMedia = vi.fn().mockImplementation(() => ({ matches: reduceMotion }));
  // jsdom has no layout: treat every element as rendered for the focus trap.
  Element.prototype.getClientRects = () => [{}] as unknown as DOMRectList;
});

/**
 * jsdom has no AnimationEvent, so React listens for the vendor-prefixed name;
 * fire both so the handler runs regardless of React's detection.
 */
function endAnimation(el: Element): void {
  fireEvent.animationEnd(el);
  fireEvent(el, new Event('webkitAnimationEnd', { bubbles: true }));
}

function Navigator() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      data-testid="go-shop"
      onClick={() => {
        void navigate('/shop');
      }}
    >
      go
    </button>
  );
}

function renderMenu(count = 0, initial = '/') {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <p data-testid="outside">outside</p>
      <MobileMenu links={links} enquiryCount={count} />
      <Routes>
        <Route path="*" element={<Navigator />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('MobileMenu', () => {
  it('starts closed and opens a dialog with links, focus and inert background', async () => {
    const user = userEvent.setup();
    renderMenu(2);
    const trigger = screen.getByTestId('mobile-menu-trigger');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('mobile-menu-dialog')).toBeNull();

    await user.click(trigger);
    const dialog = screen.getByTestId('mobile-menu-dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(dialog).toHaveAttribute('role', 'dialog');
    expect(dialog).toHaveAttribute('data-state', 'open');
    expect(dialog).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByTestId('mobile-menu-link-home')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('mobile-menu-link-shop')).toHaveAttribute('href', '/shop');
    expect(screen.getByTestId('mobile-menu-link-deep/link')).toHaveAttribute('href', '/deep/link');
    expect(screen.getByTestId('mobile-menu-enquiry')).toHaveAttribute('href', '/cart');
    expect(screen.getByTestId('mobile-menu-badge')).toHaveTextContent('2');
    expect(screen.getByTestId('mobile-menu-enquiry')).toHaveTextContent(', 2 items');
    // Everything outside the overlay is inert while open.
    const outsideRoot = screen.getByTestId('outside').closest('body > *');
    expect((outsideRoot as HTMLElement).inert).toBe(true);
  });

  it('hides the badge when the enquiry is empty', async () => {
    const user = userEvent.setup();
    renderMenu(0);
    await user.click(screen.getByTestId('mobile-menu-trigger'));
    expect(screen.queryByTestId('mobile-menu-badge')).toBeNull();
  });

  it('closes via the close button, unmounting after the exit animation and restoring focus', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByTestId('mobile-menu-trigger'));
    await user.click(screen.getByTestId('mobile-menu-close'));
    const dialog = screen.getByTestId('mobile-menu-dialog');
    expect(dialog).toHaveAttribute('data-state', 'closing');
    expect(dialog).toHaveAttribute('inert');
    endAnimation(dialog);
    expect(screen.queryByTestId('mobile-menu-dialog')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(screen.getByTestId('mobile-menu-trigger')).toHaveFocus();
  });

  it('ignores bubbled animationend events from children', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByTestId('mobile-menu-trigger'));
    await user.click(screen.getByTestId('mobile-menu-scrim'));
    endAnimation(screen.getByTestId('mobile-menu-close'));
    expect(screen.getByTestId('mobile-menu-dialog')).toHaveAttribute('data-state', 'closing');
  });

  it('falls back to a timer when animationend never fires', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByTestId('mobile-menu-trigger'));
    await user.keyboard('{Escape}');
    expect(screen.getByTestId('mobile-menu-dialog')).toHaveAttribute('data-state', 'closing');
    await waitFor(
      () => {
        expect(screen.queryByTestId('mobile-menu-dialog')).toBeNull();
      },
      { timeout: 2000 },
    );
  });

  it('closes immediately when reduced motion is preferred', async () => {
    const user = userEvent.setup();
    reduceMotion = true;
    renderMenu();
    await user.click(screen.getByTestId('mobile-menu-trigger'));
    await user.keyboard('{Escape}');
    expect(screen.queryByTestId('mobile-menu-dialog')).toBeNull();
  });

  it('wraps Tab focus inside the dialog', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByTestId('mobile-menu-trigger'));
    const brand = screen.getByTestId('mobile-menu-brand');
    const enquiry = screen.getByTestId('mobile-menu-enquiry');
    // Shift+Tab from the dialog itself lands on the last focusable.
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(enquiry).toHaveFocus();
    await user.keyboard('{Tab}');
    expect(brand).toHaveFocus();
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(enquiry).toHaveFocus();
    // Other keys are ignored.
    await user.keyboard('{ArrowDown}');
    expect(enquiry).toHaveFocus();
  });

  it('closes on route change', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByTestId('mobile-menu-trigger'));
    await user.click(screen.getByTestId('go-shop'));
    expect(screen.getByTestId('mobile-menu-dialog')).toHaveAttribute('data-state', 'closing');
  });

  it('closes when a menu link is clicked', async () => {
    const user = userEvent.setup();
    renderMenu(0, '/shop');
    await user.click(screen.getByTestId('mobile-menu-trigger'));
    await user.click(screen.getByTestId('mobile-menu-brand'));
    endAnimation(screen.getByTestId('mobile-menu-dialog'));
    expect(screen.queryByTestId('mobile-menu-dialog')).toBeNull();
  });

  it('honours custom enquiry props', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MobileMenu
          links={links}
          enquiryCount={1}
          enquiryHref="/basket"
          enquiryLabel="Basket"
          data-testid="mm"
        />
      </MemoryRouter>,
    );
    await user.click(screen.getByTestId('mm-trigger'));
    const enquiry = screen.getByTestId('mm-enquiry');
    expect(enquiry).toHaveAttribute('href', '/basket');
    expect(enquiry).toHaveTextContent('Basket');
    expect(enquiry).toHaveTextContent(', 1 item');
    expect(enquiry).not.toHaveTextContent('1 items');
  });
});
