import { describe, expect, it } from 'vitest';

import {
  choiceLabel,
  conductorLabel,
  coverLabel,
  formatCoverOffer,
  formatSpacing,
  joinOr,
  polepieceLabel,
  pottingLabel,
  spacingLabel,
} from './pickupLabels';

describe('single-value labels', () => {
  it('labels potting', () => {
    expect(pottingLabel('potted')).toBe('Potted');
    expect(pottingLabel('unpotted')).toBe('Unpotted');
  });

  it('labels conductors', () => {
    expect(conductorLabel('vintage-braided')).toBe('Vintage braided (2-conductor)');
    expect(conductorLabel('2-conductor')).toBe('2-conductor');
    expect(conductorLabel('4-conductor')).toBe('4-conductor (coil split)');
  });

  it('labels pole pieces and covers', () => {
    expect(polepieceLabel('nickel')).toBe('Nickel');
    expect(polepieceLabel('black')).toBe('Black');
    expect(polepieceLabel('gold')).toBe('Gold');
    expect(coverLabel('none')).toBe('No cover');
    expect(coverLabel('nickel')).toBe('Nickel cover');
    expect(coverLabel('black')).toBe('Black cover');
    expect(coverLabel('gold')).toBe('Gold cover');
  });
});

describe('spacingLabel', () => {
  it('prints integers plainly and decimals to one place', () => {
    expect(spacingLabel(52)).toBe('52 mm');
    expect(spacingLabel(49.2)).toBe('49.2 mm');
    expect(spacingLabel(49.25)).toBe('49.3 mm');
  });
});

describe('joinOr', () => {
  it('handles zero, one, two and many entries', () => {
    expect(joinOr([])).toBe('');
    expect(joinOr(['A'])).toBe('A');
    expect(joinOr(['A', 'B'])).toBe('A or B');
    expect(joinOr(['A', 'B', 'C'])).toBe('A, B or C');
  });
});

describe('choiceLabel', () => {
  it('maps and joins the options of a choice', () => {
    expect(
      choiceLabel(
        { options: ['nickel', 'black', 'gold'], defaultOption: 'nickel' },
        polepieceLabel,
      ),
    ).toBe('Nickel, Black or Gold');
  });
});

describe('formatCoverOffer', () => {
  it('is None when no cover is offered or only "none" is listed', () => {
    expect(formatCoverOffer(undefined)).toBe('None');
    expect(formatCoverOffer({ options: ['none'], defaultOption: 'none' })).toBe('None');
  });

  it('is Optional when the default is uncovered', () => {
    expect(
      formatCoverOffer({ options: ['none', 'nickel', 'black', 'gold'], defaultOption: 'none' }),
    ).toBe('Optional (nickel, black or gold)');
  });

  it('is fitted when a cover is the default', () => {
    expect(formatCoverOffer({ options: ['nickel', 'gold'], defaultOption: 'nickel' })).toBe(
      'nickel or gold (fitted)',
    );
  });
});

describe('formatSpacing', () => {
  it('formats a fixed value', () => {
    expect(formatSpacing(49.2)).toBe('49.2 mm');
  });

  it('formats a choice with a single unit suffix', () => {
    expect(formatSpacing({ options: [50, 52], defaultOption: 50 })).toBe('50 or 52 mm');
  });
});
