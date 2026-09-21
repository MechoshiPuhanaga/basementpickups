import { describe, expect, it } from 'vitest';

import { brandValues } from './brandValues';

describe('brandValues', () => {
  it('has unique ids and non-empty copy', () => {
    const ids = brandValues.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const v of brandValues) {
      expect(v.title.trim(), v.id).not.toBe('');
      expect(v.description.trim(), v.id).not.toBe('');
    }
  });

  it('pairs each entry with a matching icon', () => {
    for (const v of brandValues) {
      expect(v.icon).toBe(v.id);
    }
  });
});
