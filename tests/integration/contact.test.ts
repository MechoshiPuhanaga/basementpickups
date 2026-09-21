import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { postJson, startApp, type RunningApp } from './helpers';

let app: RunningApp;

const VALID = {
  name: 'Ada',
  email: 'ada@example.test',
  subject: 'Set enquiry',
  message: 'Hello workshop',
};

interface ContactResponse {
  ok: boolean;
  error?: string;
  field?: string;
}

beforeAll(async () => {
  app = await startApp();
});

afterAll(async () => {
  await app.close();
});

beforeEach(() => {
  // The success path (Resend mocked) lives in the unit tests; here the
  // endpoint must be deliberately unconfigured.
  vi.stubEnv('RESEND_API_KEY', '');
  vi.stubEnv('CONTACT_TO', '');
  vi.stubEnv('FROM_EMAIL', '');
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('POST /api/contact validation', () => {
  it.each([
    ['missing name', { ...VALID, name: '' }, 'name'],
    ['whitespace name', { ...VALID, name: '   ' }, 'name'],
    ['over-long name', { ...VALID, name: 'x'.repeat(121) }, 'name'],
    ['missing email', { ...VALID, email: '' }, 'email'],
    ['malformed email', { ...VALID, email: 'not-an-email' }, 'email'],
    ['over-long subject', { ...VALID, subject: 's'.repeat(161) }, 'subject'],
    ['over-long message', { ...VALID, message: 'm'.repeat(5001) }, 'message'],
    ['empty message without items', { ...VALID, message: '' }, 'message'],
    ['empty object', {}, 'name'],
    ['array body', [], 'name'],
  ])('%s → 400 with a field-level error', async (_label, body, field) => {
    const res = await postJson(app, '/api/contact', body);
    expect(res.status).toBe(400);
    expect(res.headers.get('content-type')).toMatch(/^application\/json/);
    const json = (await res.json()) as ContactResponse;
    expect(json.ok).toBe(false);
    expect(json.field).toBe(field);
    expect(typeof json.error).toBe('string');
    expect(json.error?.length ?? 0).toBeGreaterThan(0);
  });

  it('a non-JSON body is treated as empty and rejected on the name', async () => {
    const res = await app.get('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: 'name=Ada',
    });
    expect(res.status).toBe(400);
    const json = (await res.json()) as ContactResponse;
    expect(json).toEqual({ ok: false, error: expect.any(String) as string, field: 'name' });
  });

  it('malformed JSON is rejected with 400', async () => {
    const res = await app.get('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"name": ',
    });
    expect(res.status).toBe(400);
  });

  it('bodies above 64kb are rejected with 413', async () => {
    const res = await postJson(app, '/api/contact', { ...VALID, message: 'x'.repeat(70_000) });
    expect(res.status).toBe(413);
  });

  it('an itemised enquiry needs no message', async () => {
    const res = await postJson(app, '/api/contact', {
      ...VALID,
      message: '',
      items: [{ name: 'White Pearl', qty: 1, price: 250 }],
    });
    // Valid request; fails later only because Resend is unconfigured.
    expect(res.status).toBe(500);
  });
});

describe('POST /api/contact behaviour', () => {
  it('silently accepts honeypot submissions', async () => {
    const res = await postJson(app, '/api/contact', { ...VALID, company: 'Bots Inc' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('reports a 500 with a friendly message when email is not configured', async () => {
    const res = await postJson(app, '/api/contact', VALID);
    expect(res.status).toBe(500);
    const json = (await res.json()) as ContactResponse;
    expect(json.ok).toBe(false);
    expect(json.error).toMatch(/email the workshop directly/i);
    expect(json.field).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Contact endpoint misconfigured'),
    );
  });

  it('GET /api/contact is not an API route and falls through to the 404 page', async () => {
    const res = await app.get('/api/contact');
    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8');
  });

  it('a payload-too-large error is a plain HTML error page', async () => {
    // NB: the stack trace is hidden only when process NODE_ENV=production
    // (Express reads it at app creation, not from createApp's isProd).
    const res = await postJson(app, '/api/contact', { ...VALID, message: 'x'.repeat(70_000) });
    expect(res.status).toBe(413);
    expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8');
    const text = await res.text();
    expect(text).toContain('Payload Too Large');
    expect(text).not.toContain('    at ');
  });
});
