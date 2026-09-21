import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { articles, getArticleBySlug } from './articles';

const PUBLIC_DIR = path.resolve(import.meta.dirname, '../../public');
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

describe('articles catalog', () => {
  it('has articles with unique slugs and ids', () => {
    expect(articles.length).toBeGreaterThan(0);
    const slugs = articles.map((a) => a.slug);
    const ids = articles.map((a) => a.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has valid ISO dates that parse, and updatedAt never before publishedAt', () => {
    for (const a of articles) {
      expect(a.metadata.publishedAt, a.slug).toMatch(ISO_DATE);
      expect(Number.isNaN(Date.parse(a.metadata.publishedAt)), a.slug).toBe(false);
      if (a.metadata.updatedAt !== undefined) {
        expect(a.metadata.updatedAt, a.slug).toMatch(ISO_DATE);
        expect(Date.parse(a.metadata.updatedAt), a.slug).toBeGreaterThanOrEqual(
          Date.parse(a.metadata.publishedAt),
        );
      }
    }
  });

  it('has non-empty editorial fields and keywords', () => {
    for (const a of articles) {
      expect(a.headline.trim(), a.slug).not.toBe('');
      expect(a.excerpt.trim(), a.slug).not.toBe('');
      expect(a.body.trim(), a.slug).not.toBe('');
      expect(a.keywords.length, a.slug).toBeGreaterThan(0);
      expect(a.mainImage.alt.trim(), a.slug).not.toBe('');
      expect(a.mainImage.width, a.slug).toBeGreaterThan(0);
      expect(a.mainImage.height, a.slug).toBeGreaterThan(0);
    }
  });

  it('references images that exist on disk', () => {
    for (const a of articles) {
      expect(fs.existsSync(path.join(PUBLIC_DIR, a.mainImage.src)), a.mainImage.src).toBe(true);
      for (const img of a.images ?? []) {
        expect(fs.existsSync(path.join(PUBLIC_DIR, img.src)), img.src).toBe(true);
      }
    }
  });
});

describe('getArticleBySlug', () => {
  it('finds an article by slug', () => {
    expect(getArticleBySlug('the-language-of-paf')?.headline).toBe('The Language of PAF');
  });

  it('returns undefined for unknown slugs', () => {
    expect(getArticleBySlug('missing')).toBeUndefined();
  });
});
