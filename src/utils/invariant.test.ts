import { describe, expect, it } from 'vitest';

import { invariant } from './invariant';

describe('invariant', () => {
  it('does nothing for a truthy condition', () => {
    expect(() => {
      invariant(1, 'never');
    }).not.toThrow();
  });

  it('throws with a prefixed message for a falsy condition', () => {
    expect(() => {
      invariant(null, 'value required');
    }).toThrow('Invariant failed: value required');
  });
});
