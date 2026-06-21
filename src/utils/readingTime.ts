const WORDS_PER_MINUTE = 200;

/** Estimated reading time in whole minutes (at ~200 wpm), never below 1. */
export function readingTimeMinutes(text: string, wordsPerMinute = WORDS_PER_MINUTE): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 1;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

/** Human-friendly reading time label, e.g. "5 min read". */
export function formatReadingTime(text: string): string {
  return `${String(readingTimeMinutes(text))} min read`;
}
