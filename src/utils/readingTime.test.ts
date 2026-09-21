import { describe, expect, it } from 'vitest';

import { formatReadingTime, readingTimeMinutes } from './readingTime';

describe('readingTimeMinutes', () => {
  it('never reports less than one minute', () => {
    expect(readingTimeMinutes('')).toBe(1);
    expect(readingTimeMinutes('   ')).toBe(1);
    expect(readingTimeMinutes('one two three')).toBe(1);
  });

  it('rounds to whole minutes at 200 words per minute', () => {
    const words = (n: number) => Array.from({ length: n }, () => 'word').join(' ');
    expect(readingTimeMinutes(words(200))).toBe(1);
    expect(readingTimeMinutes(words(300))).toBe(2);
    expect(readingTimeMinutes(words(1000))).toBe(5);
  });

  it('honours a custom words-per-minute rate and ignores extra whitespace', () => {
    expect(readingTimeMinutes('a  b\n\nc\td', 2)).toBe(2);
  });
});

describe('formatReadingTime', () => {
  it('formats the estimate as a label', () => {
    expect(formatReadingTime('short')).toBe('1 min read');
  });
});
