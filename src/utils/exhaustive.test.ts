import { describe, expect, it } from 'vitest';

import { assertExhaustive } from './exhaustive';

describe('assertExhaustive', () => {
  it('throws with the default message', () => {
    expect(() => assertExhaustive('x' as never)).toThrow('Unexpected value: x');
  });

  it('throws with a custom message', () => {
    expect(() => assertExhaustive(3 as never, 'Unknown size')).toThrow('Unknown size: 3');
  });
});
