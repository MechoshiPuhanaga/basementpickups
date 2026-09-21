import { describe, expect, it } from 'vitest';

import { splitTemplate } from './renderHtml';

const TEMPLATE =
  '<html><head><!--ssr-head--></head><body><div id="root"><!--ssr-outlet--></div></body></html>';

describe('splitTemplate', () => {
  it('injects the head and splits around the outlet', () => {
    const { head, tail } = splitTemplate(TEMPLATE, '<title>T</title>');
    expect(head).toBe('<html><head><title>T</title></head><body><div id="root">');
    expect(tail).toBe('</div></body></html>');
    expect(head + tail).not.toContain('<!--ssr-');
  });

  it('throws when the outlet placeholder is missing', () => {
    expect(() => splitTemplate('<html><!--ssr-head--></html>', '')).toThrow(
      'Template is missing <!--ssr-outlet-->',
    );
  });

  it('tolerates a template without a head placeholder', () => {
    const { head, tail } = splitTemplate('<a><!--ssr-outlet--></a>', '<x/>');
    expect(head).toBe('<a>');
    expect(tail).toBe('</a>');
  });
});
