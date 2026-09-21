import { describe, expect, it } from 'vitest';

import { BOBBIN_COLOR_LABELS, bobbinColorLabel } from './bobbinColors';

describe('bobbinColorLabel', () => {
  it('returns the display label for a known token', () => {
    expect(bobbinColorLabel('light-blue')).toBe('Light blue');
    expect(bobbinColorLabel('black')).toBe('Black');
  });

  it('returns the token itself when unknown', () => {
    expect(bobbinColorLabel('mauve')).toBe('mauve');
  });

  it('labels every token with capitalised, non-empty text', () => {
    for (const [token, label] of Object.entries(BOBBIN_COLOR_LABELS)) {
      expect(label, token).toMatch(/^[A-Z]/);
    }
  });
});
