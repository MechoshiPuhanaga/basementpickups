import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { ROOT, startApp, type RunningApp } from './helpers';

let app: RunningApp;

function rawGet(base: string, pathname: string, headers: Record<string, string>): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = http.request(new URL(pathname, base), { method: 'GET', headers }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf8'));
      });
    });
    req.on('error', reject);
    req.end();
  });
}

beforeAll(async () => {
  app = await startApp();
});

afterAll(async () => {
  await app.close();
});

const BASELINE_HEADERS: Record<string, string> = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'cross-origin-opener-policy': 'same-origin',
  'cross-origin-resource-policy': 'same-origin',
};

describe('security headers (production)', () => {
  it.each(['/', '/robots.txt', '/sw.js', '/nope'])(
    'GET %s carries the baseline security headers',
    async (pathname) => {
      const res = await app.get(pathname);
      for (const [name, value] of Object.entries(BASELINE_HEADERS)) {
        expect(res.headers.get(name), name).toBe(value);
      }
      expect(res.headers.get('strict-transport-security')).toBe(
        'max-age=63072000; includeSubDomains; preload',
      );
    },
  );

  it('HTML responses carry a strict nonce CSP with Trusted Types', async () => {
    const res = await app.get('/');
    const csp = res.headers.get('content-security-policy') ?? '';
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toMatch(/script-src 'self' 'nonce-[^']+' 'unsafe-inline'/);
    expect(csp).toMatch(/style-src 'self' 'nonce-[^']+'/);
    expect(csp).toContain("require-trusted-types-for 'script'");
    expect(csp).not.toContain('strict-dynamic');
  });

  it('non-HTML responses carry no CSP', async () => {
    for (const pathname of ['/robots.txt', '/sitemap.xml', '/sw.js']) {
      const res = await app.get(pathname);
      expect(res.headers.get('content-security-policy'), pathname).toBeNull();
    }
  });
});

describe('static assets', () => {
  it('serves hashed build assets with a one-year cache', async () => {
    const assets = fs.readdirSync(path.join(ROOT, 'dist/client/assets'));
    const css = assets.find((name) => name.endsWith('.css'));
    const js = assets.find((name) => name.endsWith('.js'));
    expect(css).toBeDefined();
    expect(js).toBeDefined();

    const cssRes = await app.get(`/assets/${css ?? ''}`);
    expect(cssRes.status).toBe(200);
    expect(cssRes.headers.get('content-type')).toBe('text/css; charset=utf-8');
    expect(cssRes.headers.get('cache-control')).toBe('public, max-age=31536000');

    const jsRes = await app.get(`/assets/${js ?? ''}`);
    expect(jsRes.status).toBe(200);
    expect(jsRes.headers.get('content-type')).toMatch(/^text\/javascript/);
    expect(jsRes.headers.get('cache-control')).toBe('public, max-age=31536000');
  });

  it('the SSR catch-all owns the root, not the static index', async () => {
    // `index: false` — `/` must be rendered, never served as the raw template.
    const html = await (await app.get('/')).text();
    expect(html).not.toContain('<!--ssr-head-->');
    expect(html).not.toContain('<!--ssr-outlet-->');
  });

  it('serves the service worker from root scope, uncached', async () => {
    const res = await app.get('/sw.js');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/javascript; charset=utf-8');
    expect(res.headers.get('cache-control')).toBe('no-cache');
    expect(res.headers.get('service-worker-allowed')).toBe('/');
    expect((await res.text()).length).toBeGreaterThan(0);
  });

  it('serves the web manifest and offline page', async () => {
    const manifest = await app.get('/manifest.webmanifest');
    expect(manifest.status).toBe(200);
    expect(manifest.headers.get('content-type')).toMatch(/manifest\+json/);
    const offline = await app.get('/offline.html');
    expect(offline.status).toBe(200);
    expect(offline.headers.get('content-type')).toBe('text/html; charset=utf-8');
  });
});

describe('trailing-slash redirects', () => {
  it.each([
    ['/shop/', '/shop'],
    ['/shop/?a=1', '/shop?a=1'],
    ['/products/white-pearl///', '/products/white-pearl'],
    ['/articles/?x=1&y=2', '/articles?x=1&y=2'],
  ])('GET %s → 301 %s', async (from, to) => {
    const res = await app.get(from);
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe(to);
  });

  it('HEAD requests are redirected too', async () => {
    const res = await app.get('/about/', { method: 'HEAD' });
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('/about');
  });

  it('the root and slash-less URLs are not redirected', async () => {
    expect((await app.get('/')).status).toBe(200);
    expect((await app.get('/shop')).status).toBe(200);
  });

  it('POST requests are never redirected', async () => {
    const res = await app.get('/shop/', { method: 'POST' });
    expect(res.status).not.toBe(301);
    expect(res.headers.get('location')).toBeNull();
  });
});

describe('development mode', () => {
  let dev: RunningApp;

  beforeAll(async () => {
    dev = await startApp({ isProd: false, publicOrigin: '' });
  });

  afterAll(async () => {
    await dev.close();
  });

  it('serves SSR HTML without CSP or HSTS, with inlined CSS and a Host-derived origin', async () => {
    const res = await dev.get('/about');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-security-policy')).toBeNull();
    expect(res.headers.get('strict-transport-security')).toBeNull();
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');

    const html = await res.text();
    expect(html).toContain('<style data-ssr-css>');
    expect(html).toContain(`<link rel="canonical" href="${dev.base}/about" />`);
    expect(html).toContain('<title>About | Basement Pickups</title>');
  });

  it('derives the origin from the Host header and forwarded protocol', async () => {
    // fetch() will not override Host, so go through node:http directly. Vite's
    // dev middleware only admits localhost-style hosts.
    const text = await rawGet(dev.base, '/robots.txt', {
      host: 'localhost:4321',
      'x-forwarded-proto': 'https',
    });
    expect(text).toContain('Sitemap: https://localhost:4321/sitemap.xml');
  });
});
