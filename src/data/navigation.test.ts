import { describe, expect, it } from 'vitest';

import { primaryNav } from './navigation';

describe('primaryNav', () => {
  it('links every top-level page exactly once', () => {
    expect(primaryNav.map((l) => l.href)).toEqual([
      '/',
      '/about',
      '/shop',
      '/articles',
      '/faq',
      '/contact',
    ]);
  });

  it('uses root-relative hrefs without trailing slashes and non-empty labels', () => {
    for (const link of primaryNav) {
      expect(link.href).toMatch(/^\/[a-z]*$/);
      expect(link.label.trim()).not.toBe('');
    }
  });
});
