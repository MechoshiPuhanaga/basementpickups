import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Disclosure } from './Disclosure';

describe('Disclosure', () => {
  it('toggles open state with the right aria wiring', async () => {
    const user = userEvent.setup();
    render(
      <Disclosure title="Filters" data-testid="d">
        <p>content</p>
      </Disclosure>,
    );
    const root = screen.getByTestId('d');
    const trigger = screen.getByTestId('d-trigger');
    const panel = screen.getByTestId('d-panel');
    expect(root).toHaveAttribute('data-open', 'false');
    expect(root).toHaveAttribute('data-desktop', 'dissolve');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveTextContent('content');

    await user.click(trigger);
    expect(root).toHaveAttribute('data-open', 'true');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('starts open when defaultOpen is set and shows icon and summary chips', () => {
    render(
      <Disclosure
        title="Filters"
        defaultOpen
        icon={<svg data-icon="x" />}
        summary={['Newest', 'PAF']}
        data-testid="d"
      >
        <p>content</p>
      </Disclosure>,
    );
    expect(screen.getByTestId('d')).toHaveAttribute('data-open', 'true');
    const trigger = screen.getByTestId('d-trigger');
    expect(trigger.querySelector('[data-icon="x"]')).not.toBeNull();
    expect(trigger).toHaveTextContent('Newest');
    expect(trigger).toHaveTextContent('PAF');
  });

  it('renders as a heading section in desktop="heading" mode', () => {
    render(
      <Disclosure title="Specs" desktop="heading" headingLevel={3} data-testid="d">
        <p>content</p>
      </Disclosure>,
    );
    const root = screen.getByTestId('d');
    expect(root).toHaveAttribute('data-desktop', 'heading');
    expect(root.querySelectorAll('h3')).toHaveLength(2);
    expect(screen.getByTestId('d-trigger').closest('h3')).not.toBeNull();
  });

  it('renders without test ids when none is given', () => {
    const { container } = render(
      <Disclosure title="Plain" summary={[]}>
        <p>content</p>
      </Disclosure>,
    );
    expect(container.querySelector('[data-testid]')).toBeNull();
  });
});
