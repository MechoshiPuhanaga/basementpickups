import type { Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { handleContact, parseRequest, type ContactItem } from './contact';

const VALID = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'A set',
  message: 'Hello there',
};

function ok(body: unknown) {
  const parsed = parseRequest(body);
  if (!parsed.ok) throw new Error(`expected ok, got ${parsed.error}`);
  return parsed;
}

function bad(body: unknown) {
  const parsed = parseRequest(body);
  if (parsed.ok) throw new Error('expected invalid');
  return parsed;
}

describe('parseRequest — fields', () => {
  it('accepts a complete message and trims whitespace', () => {
    const parsed = ok({ ...VALID, name: '  Ada ', message: ' hi \n' });
    expect(parsed.data).toEqual({ ...VALID, message: 'hi' });
    expect(parsed.isBot).toBe(false);
  });

  it('tolerates a non-object body by failing on the name', () => {
    expect(bad(null).field).toBe('name');
    expect(bad('str').field).toBe('name');
    expect(bad(undefined).field).toBe('name');
  });

  it('ignores non-string fields', () => {
    expect(bad({ ...VALID, name: 42 }).field).toBe('name');
  });

  it('requires a name within 120 chars', () => {
    expect(bad({ ...VALID, name: '' })).toEqual({
      ok: false,
      error: 'Please let us know your name.',
      field: 'name',
    });
    expect(bad({ ...VALID, name: 'x'.repeat(121) }).field).toBe('name');
    expect(ok({ ...VALID, name: 'x'.repeat(120) }).data.name).toHaveLength(120);
  });

  it('requires a plausible email within 200 chars', () => {
    for (const email of ['', 'nope', 'a@b', 'a b@c.d', `${'x'.repeat(190)}@example.com`]) {
      const parsed = bad({ ...VALID, email });
      expect(parsed.field, email).toBe('email');
      expect(parsed.error).toContain("doesn't look right");
    }
    expect(ok({ ...VALID, email: 'a.b+c@sub.example.co.uk' }).data.email).toBe(
      'a.b+c@sub.example.co.uk',
    );
  });

  it('defaults an empty subject and caps it at 160 chars', () => {
    expect(ok({ ...VALID, subject: '' }).data.subject).toBe('Website inquiry');
    expect(ok({ ...VALID, subject: undefined }).data.subject).toBe('Website inquiry');
    const parsed = bad({ ...VALID, subject: 'x'.repeat(161) });
    expect(parsed.field).toBe('subject');
    expect(parsed.error).toContain('subject line');
  });

  it('caps the message at 5000 chars', () => {
    const parsed = bad({ ...VALID, message: 'x'.repeat(5001) });
    expect(parsed.field).toBe('message');
    expect(parsed.error).toContain('little long');
  });

  it('requires a message when there are no items', () => {
    const parsed = bad({ ...VALID, message: '' });
    expect(parsed.field).toBe('message');
    expect(parsed.error).toContain('short message');
  });

  it('flags the honeypot without rejecting the request', () => {
    const parsed = ok({ ...VALID, company: 'Acme' });
    expect(parsed.isBot).toBe(true);
    expect(ok({ ...VALID, company: '   ' }).isBot).toBe(false);
  });
});

describe('parseRequest — items', () => {
  it('allows an empty message when structured items are present', () => {
    const parsed = ok({
      ...VALID,
      message: '',
      items: [{ name: 'Rockroach', qty: 1, price: 125 }],
    });
    expect(parsed.data.message).toBe('');
    expect(parsed.data.items).toEqual([{ name: 'Rockroach', qty: 1, price: 125 }]);
  });

  it('omits items when the list is not an array or has no valid entries', () => {
    expect(ok({ ...VALID, items: 'x' }).data).not.toHaveProperty('items');
    expect(ok({ ...VALID, items: [] }).data).not.toHaveProperty('items');
    expect(ok({ ...VALID, items: [null, 1, 'a', {}] }).data).not.toHaveProperty('items');
  });

  it('drops malformed entries and normalises the good ones', () => {
    const parsed = ok({
      ...VALID,
      items: [
        { name: '', qty: 1, price: 1 },
        { name: 'no qty', price: 1 },
        { name: 'zero qty', qty: 0, price: 1 },
        { name: 'nan qty', qty: Number.NaN, price: 1 },
        { name: 'neg price', qty: 1, price: -1 },
        { name: 'inf price', qty: 1, price: Number.POSITIVE_INFINITY },
        { name: 'string price', qty: 1, price: '5' },
        { name: '  Fractional qty ', qty: 2.9, price: 0 },
        { name: 'x'.repeat(130), qty: 1, price: 140.5 },
      ],
    });
    expect(parsed.data.items).toEqual([
      { name: 'Fractional qty', qty: 2, price: 0 },
      { name: 'x'.repeat(120), qty: 1, price: 140.5 },
    ]);
  });

  it('caps the list at 50 items', () => {
    const items = Array.from({ length: 60 }, (_, i) => ({
      name: `i${String(i)}`,
      qty: 1,
      price: 1,
    }));
    expect(ok({ ...VALID, items }).data.items).toHaveLength(50);
  });

  it('parses per-item options, dropping bad entries, truncating and capping at 20', () => {
    const options = [
      { label: 'Wire', value: '4-conductor' },
      { label: '', value: 'x' },
      { label: 'x', value: '' },
      null,
      'str',
      { label: 1, value: 'x' },
      { label: `  ${'l'.repeat(70)} `, value: `${'v'.repeat(130)} ` },
    ];
    const parsed = ok({ ...VALID, items: [{ name: 'A', qty: 1, price: 1, options }] });
    expect(parsed.data.items?.[0]?.options).toEqual([
      { label: 'Wire', value: '4-conductor' },
      { label: 'l'.repeat(60), value: 'v'.repeat(120) },
    ]);

    const many = Array.from({ length: 25 }, (_, i) => ({ label: `L${String(i)}`, value: 'v' }));
    const capped = ok({ ...VALID, items: [{ name: 'A', qty: 1, price: 1, options: many }] });
    expect(capped.data.items?.[0]?.options).toHaveLength(20);
  });

  it('omits options when none survive or the value is not an array', () => {
    const parsed = ok({
      ...VALID,
      items: [
        { name: 'A', qty: 1, price: 1, options: [] },
        { name: 'B', qty: 1, price: 1, options: 'x' },
        { name: 'C', qty: 1, price: 1, options: [{ label: '', value: '' }] },
      ],
    });
    for (const item of parsed.data.items ?? []) {
      expect(item, item.name).not.toHaveProperty('options');
    }
  });
});

interface FakeRes {
  statusCode: number | undefined;
  body: unknown;
  res: Response;
}

function fakeRes(): FakeRes {
  const out: FakeRes = { statusCode: undefined, body: undefined, res: {} as Response };
  const res = {
    status(code: number) {
      out.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      out.body = payload;
      return res;
    },
  };
  out.res = res as unknown as Response;
  return out;
}

function req(body: unknown): Request {
  return { body } as unknown as Request;
}

describe('handleContact', () => {
  beforeEach(() => {
    sendMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.stubEnv('RESEND_API_KEY', 'key');
    vi.stubEnv('CONTACT_TO', 'workshop@example.com');
    vi.stubEnv('FROM_EMAIL', 'hello@example.com');
    vi.stubEnv('PUBLIC_ORIGIN', 'https://site.test/');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('responds 400 with the field for an invalid body', async () => {
    const out = fakeRes();
    await handleContact(req({ ...VALID, email: 'bad' }), out.res);
    expect(out.statusCode).toBe(400);
    expect(out.body).toEqual({
      ok: false,
      error: "That email address doesn't look right — please double-check it.",
      field: 'email',
    });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('silently accepts honeypot hits without sending', async () => {
    const out = fakeRes();
    await handleContact(req({ ...VALID, company: 'bot' }), out.res);
    expect(out.statusCode).toBe(200);
    expect(out.body).toEqual({ ok: true });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it.each(['RESEND_API_KEY', 'CONTACT_TO', 'FROM_EMAIL'])(
    'responds 500 when %s is missing',
    async (name) => {
      vi.stubEnv(name, '');
      const out = fakeRes();
      await handleContact(req(VALID), out.res);
      expect(out.statusCode).toBe(500);
      expect(out.body).toMatchObject({ ok: false });
      expect((out.body as { error: string }).error).toContain('briefly offline');
      expect(sendMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('misconfigured'));
    },
  );

  it('sends the notification and the confirmation on success', async () => {
    sendMock.mockResolvedValue({ data: { id: '1' }, error: null });
    const items: ContactItem[] = [
      { name: 'Rockroach', qty: 2, price: 125, options: [{ label: 'Wire', value: '4-c <x>' }] },
      { name: 'Twin Bliss', qty: 1, price: 140.5 },
    ];
    const out = fakeRes();
    await handleContact(req({ ...VALID, message: 'Line 1\nLine 2 <b>', items }), out.res);

    expect(out.statusCode).toBe(200);
    expect(out.body).toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledTimes(2);

    const [notification, confirmation] = sendMock.mock.calls.map(
      (call: unknown[]) => call[0] as Record<string, unknown>,
    );
    if (notification === undefined || confirmation === undefined) throw new Error('calls');

    expect(notification['from']).toBe('Basement Pickups <hello@example.com>');
    expect(notification['to']).toBe('workshop@example.com');
    expect(notification['replyTo']).toBe('ada@example.com');
    expect(notification['subject']).toBe('[Contact] A set — Ada');
    const nHtml = notification['html'] as string;
    const nText = notification['text'] as string;
    expect(nHtml).toContain('Line 1<br>Line 2 &lt;b&gt;');
    expect(nHtml).toContain('4-c &lt;x&gt;');
    expect(nHtml).toContain('€250');
    expect(nHtml).toContain('€140.50');
    expect(nHtml).toContain('€390.50');
    expect(nHtml).toContain('Custom requirements');
    expect(nHtml).toContain('cid:bp-logo');
    expect(nHtml).toContain('href="https://site.test"');
    expect(nText).toContain('- 2 × Rockroach [Wire: 4-c <x>] — €250');
    expect(nText).toContain('Indicative subtotal: €390.50');
    expect(nText).toContain('Custom requirements:');
    expect(notification['attachments']).toEqual([
      expect.objectContaining({ filename: 'BP_Gold_horizont.png', contentId: 'bp-logo' }),
    ]);

    expect(confirmation['to']).toBe('ada@example.com');
    expect(confirmation['subject']).toBe('We received your message — Basement Pickups');
    expect(confirmation).not.toHaveProperty('replyTo');
    const cHtml = confirmation['html'] as string;
    const cText = confirmation['text'] as string;
    expect(cHtml).toContain('Hello Ada,');
    expect(cHtml).toContain('Your selection');
    expect(cHtml).toContain('Your message');
    expect(cText).toContain('Subject: A set');
    expect(cText).toContain('Your message:');
    expect(confirmation['attachments']).toHaveLength(1);
  });

  it('renders the plain-message variant when there are no items', async () => {
    sendMock.mockResolvedValue({ data: { id: '1' }, error: null });
    const out = fakeRes();
    await handleContact(req(VALID), out.res);
    const [notification, confirmation] = sendMock.mock.calls.map(
      (call: unknown[]) => call[0] as Record<string, unknown>,
    );
    expect(notification?.['html']).toContain('>Message<');
    expect(notification?.['html']).not.toContain('Selected pickups');
    expect(notification?.['text']).toContain('Message:\nHello there');
    expect(confirmation?.['html']).not.toContain('Your selection');
    expect(confirmation?.['text']).not.toContain('Selected pickups');
  });

  it('renders "No additional notes." for an itemised enquiry without a message', async () => {
    sendMock.mockResolvedValue({ data: { id: '1' }, error: null });
    const out = fakeRes();
    await handleContact(
      req({ ...VALID, message: '', items: [{ name: 'A', qty: 1, price: 1 }] }),
      out.res,
    );
    const notification = sendMock.mock.calls[0]?.[0] as Record<string, unknown>;
    const confirmation = sendMock.mock.calls[1]?.[0] as Record<string, unknown>;
    expect(notification['html']).toContain('No additional notes.');
    expect(notification['text']).toContain('No additional notes.');
    expect(confirmation['html']).not.toContain('Your message');
    expect(confirmation['text']).not.toContain('Your message:');
  });

  it('falls back to the default site origin when PUBLIC_ORIGIN is unset', async () => {
    vi.stubEnv('PUBLIC_ORIGIN', '');
    sendMock.mockResolvedValue({ data: { id: '1' }, error: null });
    await handleContact(req(VALID), fakeRes().res);
    const notification = sendMock.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(notification['html']).toContain('href="https://basementpickups.com"');
    expect(notification['html']).toContain('>basementpickups.com<');
  });

  it('responds 502 when the notification fails', async () => {
    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'nope' } });
    const out = fakeRes();
    await handleContact(req(VALID), out.res);
    expect(out.statusCode).toBe(502);
    expect((out.body as { error: string }).error).toContain("couldn't send");
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith('Resend notification error:', { message: 'nope' });
  });

  it('still responds 200 when only the confirmation fails', async () => {
    sendMock
      .mockResolvedValueOnce({ data: { id: '1' }, error: null })
      .mockResolvedValueOnce({ data: null, error: { message: 'bounce' } });
    const out = fakeRes();
    await handleContact(req(VALID), out.res);
    expect(out.statusCode).toBe(200);
    expect(out.body).toEqual({ ok: true });
    expect(console.error).toHaveBeenCalledWith('Resend confirmation error:', {
      message: 'bounce',
    });
  });

  it('responds 502 when the client throws', async () => {
    sendMock.mockRejectedValueOnce(new Error('network'));
    const out = fakeRes();
    await handleContact(req(VALID), out.res);
    expect(out.statusCode).toBe(502);
    expect(out.body).toMatchObject({ ok: false });
    expect(console.error).toHaveBeenCalledWith('Contact endpoint failure:', expect.any(Error));
  });
});
