import { PassThrough } from 'node:stream';
import { describe, expect, it } from 'vitest';

import { render } from './entry-server';

async function renderToHtml(url: string, nonce = 'test-nonce') {
  const result = await render(new Request(url), nonce);
  const html = await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const sink = new PassThrough();
    sink.on('data', (chunk: Buffer) => chunks.push(chunk));
    sink.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf-8'));
    });
    const stream = result.startStream({
      onShellReady() {
        stream.pipe(sink);
      },
      onShellError(err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      },
    });
  });
  return { ...result, html };
}

describe('entry-server render', () => {
  it('resolves SEO head, status and a streamed shell for a page', async () => {
    const { headHtml, statusCode, html } = await renderToHtml('https://example.test/shop');
    expect(statusCode).toBe(200);
    expect(headHtml).toContain('<title>');
    expect(headHtml).toContain('rel="canonical" href="https://example.test/shop"');
    expect(html).toContain('data-testid="shop-page"');
  });

  it('adds JSON-LD for routes that have structured data and stamps the nonce', async () => {
    const { headHtml, html } = await renderToHtml('https://example.test/', 'abc123');
    expect(headHtml).toContain('application/ld+json');
    expect(html).toContain('nonce="abc123"');
  });

  it('returns a 404 status for unknown routes while still rendering the page', async () => {
    const { statusCode, headHtml, html } = await renderToHtml('https://example.test/nope');
    expect(statusCode).toBe(404);
    expect(headHtml).not.toContain('rel="canonical"');
    expect(html).toContain('data-testid="not-found"');
  });
});
