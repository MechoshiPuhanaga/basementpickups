import { describe, expect, it } from 'vitest';

import { FAQ_ITEMS } from './faq';

describe('FAQ_ITEMS', () => {
  it('has unique ids', () => {
    const ids = FAQ_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThan(0);
  });

  it('has a question, an answer and an icon on every entry', () => {
    for (const item of FAQ_ITEMS) {
      expect(item.question.trim(), item.id).toMatch(/\?$/);
      expect(item.answer.trim(), item.id).not.toBe('');
      expect(item.icon, item.id).not.toBe('');
    }
  });

  it('keeps ids URL-safe (they become anchors such as /faq#option-availability)', () => {
    for (const item of FAQ_ITEMS) {
      expect(item.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});
