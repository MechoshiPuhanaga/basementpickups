import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { startApp, type RunningApp } from './helpers';

let app: RunningApp;

beforeAll(async () => {
  app = await startApp();
});

afterAll(async () => {
  await app.close();
});

describe('built template', () => {
  it('redirects /index.html to / instead of serving the raw SSR template', async () => {
    const res = await app.get('/index.html');
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('/');
  });

  it('does not leak a stack trace on an oversized JSON body', async () => {
    const res = await app.get('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'x'.repeat(70_000) }),
    });
    expect(res.status).toBe(413);
    const text = await res.text();
    expect(text).not.toContain('    at ');
    expect(text).not.toContain('node_modules');
  });
});
