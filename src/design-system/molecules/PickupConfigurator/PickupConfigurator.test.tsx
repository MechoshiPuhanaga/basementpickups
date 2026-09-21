import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { defaultConfig, type PickupConfig } from '../../../data/pickupConfig';
import { getPickupBySlug, type Pickup, type PickupHardware } from '../../../data/pickups';
import { PickupConfigurator } from './PickupConfigurator';

function pickup(slug: string): Pickup {
  const found = getPickupBySlug(slug);
  if (found === undefined) throw new Error(`fixture: no pickup ${slug}`);
  return found;
}

function renderConfigurator(p: Pickup, value: PickupConfig = defaultConfig(p), helpTo?: string) {
  const onChange = vi.fn<(next: PickupConfig) => void>();
  render(
    <MemoryRouter>
      <PickupConfigurator
        pickup={p}
        value={value}
        onChange={onChange}
        legend="Build"
        helpTo={helpTo}
      />
    </MemoryRouter>,
  );
  return onChange;
}

describe('PickupConfigurator', () => {
  it('renders a select per real choice and read-only text for fixed values', () => {
    const p = pickup('rockroach');
    renderConfigurator(p, defaultConfig(p), '/faq#option-availability');
    const root = screen.getByTestId('pickup-configurator');
    expect(root.tagName).toBe('FIELDSET');
    expect(root).toHaveTextContent('Build');
    expect(screen.getByTestId('pickup-configurator-preview')).toBeInTheDocument();
    // Both coils share a multi-colour palette: selects.
    expect(screen.getByTestId('pickup-configurator-bobbin-coil-1-select')).toHaveValue(
      'light-blue',
    );
    expect(screen.getByTestId('pickup-configurator-bobbin-coil-2-select')).toHaveValue(
      'light-blue',
    );
    expect(screen.getByTestId('pickup-configurator-conductors-select')).toHaveValue('4-conductor');
    expect(screen.getByTestId('pickup-configurator-polepieces-select')).toHaveValue('black');
    expect(screen.getByTestId('pickup-configurator-cover-select')).toHaveValue('none');
    // Potting is fixed for high-output models: read-only.
    const potting = screen.getByTestId('pickup-configurator-potting');
    expect(potting.querySelector('select')).toBeNull();
    expect(potting).toHaveTextContent('Potted');
    // Fixed numeric spacing has no row at all.
    expect(screen.queryByTestId('pickup-configurator-spacing')).toBeNull();
    expect(screen.getByTestId('pickup-configurator-help')).toHaveAttribute(
      'href',
      '/faq#option-availability',
    );
  });

  it('marks the default option in each list', () => {
    const p = pickup('rockroach');
    renderConfigurator(p);
    const select = screen.getByTestId<HTMLSelectElement>('pickup-configurator-polepieces-select');
    const labels = Array.from(select.options).map((o) => o.textContent);
    expect(labels).toContain('Black (default)');
    expect(labels).toContain('Nickel');
  });

  it('emits a fully resolved config on every change', async () => {
    const user = userEvent.setup();
    const p = pickup('rockroach');
    const onChange = renderConfigurator(p);

    await user.selectOptions(screen.getByTestId('pickup-configurator-bobbin-coil-1-select'), 'red');
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ bobbins: { 'coil-1': 'red', 'coil-2': 'light-blue' } }),
    );
    await user.selectOptions(
      screen.getByTestId('pickup-configurator-conductors-select'),
      'vintage-braided',
    );
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ conductors: 'vintage-braided', potting: 'potted' }),
    );
    await user.selectOptions(screen.getByTestId('pickup-configurator-polepieces-select'), 'gold');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ polepieces: 'gold' }));
    await user.selectOptions(screen.getByTestId('pickup-configurator-cover-select'), 'nickel');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ cover: 'nickel' }));
    expect(onChange).toHaveBeenCalledTimes(4);
  });

  it('offers string spacing and potting when the pickup has a choice', async () => {
    const user = userEvent.setup();
    const p = pickup('twin-bliss');
    const onChange = renderConfigurator(p);
    await user.selectOptions(screen.getByTestId('pickup-configurator-spacing-select'), '52');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ spacingMm: 52 }));
    await user.selectOptions(screen.getByTestId('pickup-configurator-potting-select'), 'potted');
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ potting: 'potted' }));
    // Twin Bliss has two screw coils: labels are numbered.
    expect(screen.getByTestId('pickup-configurator')).toHaveTextContent('Screw coil 1');
    expect(screen.getByTestId('pickup-configurator')).toHaveTextContent('Screw coil 2');
  });

  it('shows single-colour coils as read-only and resolves an invalid value to the default', () => {
    const p = pickup('white-pearl-neck');
    renderConfigurator(p, { bobbins: { 'coil-1': 'red' }, polepieces: 'gold' });
    const coil = screen.getByTestId('pickup-configurator-bobbin-coil-1');
    expect(coil.querySelector('select')).toBeNull();
    expect(coil).toHaveTextContent('White');
    // PAF-style nickel-only pole pieces are read-only too.
    expect(screen.getByTestId('pickup-configurator-polepieces')).toHaveTextContent('Nickel');
    expect(screen.queryByTestId('pickup-configurator-help')).toBeNull();
  });

  it('renders no coil block for a pickup without bobbins', () => {
    const base = pickup('karakonjul');
    const hardware = Object.fromEntries(
      Object.entries(base.hardware).filter(([key]) => key !== 'bobbins'),
    ) as unknown as PickupHardware;
    const bare: Pickup = { ...base, hardware };
    renderConfigurator(bare, {}, undefined);
    expect(screen.queryByTestId('pickup-configurator-preview')).toBeNull();
    expect(screen.getByTestId('pickup-configurator-conductors-select')).toBeInTheDocument();
  });
});
