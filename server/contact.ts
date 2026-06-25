import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Request, Response } from 'express';
import { Resend } from 'resend';

/**
 * Contact endpoint backed by Resend.
 *
 * The browser POSTs structured JSON ({ name, email, subject, message }) to
 * `/api/contact`. The server validates it, then sends two emails:
 *
 *   1. a notification to the workshop (CONTACT_TO) with `replyTo` set to the
 *      visitor so a reply in Zoho goes straight back to them;
 *   2. an automatic confirmation to the visitor.
 *
 * The Resend API key never leaves the server. Email HTML uses inline styles
 * because mail clients do not support external/scoped CSS — this is transactional
 * email markup, not application UI, so the design-system CSS rules do not apply.
 */

const BRAND = 'Basement Pickups';
// Canonical public origin used for permanent links/assets in emails. Emails are
// long-lived, so they must never point at the request host (which could be
// localhost or a *.herokuapp.com domain). Override via PUBLIC_ORIGIN if needed.
const DEFAULT_SITE_ORIGIN = 'https://basementpickups.com';
const GOLD = '#c2a14d';
const INK = '#1c1a17';
const PAPER = '#f7f4ee';
const MUTED = '#6b6459';

const MAX = {
  name: 120,
  email: 200,
  subject: 160,
  message: 5000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const LOGO_FILENAME = 'BP_Gold_horizont.png';
// Content ID for the inline logo, referenced from the HTML as `cid:bp-logo`.
const LOGO_CID = 'bp-logo';

interface LogoAttachment {
  readonly filename: string;
  readonly content: string;
  readonly contentId: string;
}

let cachedLogo: LogoAttachment | null | undefined;

/**
 * The logo as an inline (cid) attachment so it renders without the recipient
 * enabling remote images — abv.bg, Zoho and Outlook all block remote images by
 * default. Read from disk once and base64-cached. Tries the built location
 * first, then the source `public/` dir. Returns null if the file can't be read,
 * in which case the email falls back to the hosted image URL.
 */
function getLogoAttachment(): LogoAttachment | null {
  if (cachedLogo !== undefined) return cachedLogo;
  const candidates = [
    path.resolve(ROOT, 'dist/client/assets/logo', LOGO_FILENAME),
    path.resolve(ROOT, 'public/assets/logo', LOGO_FILENAME),
  ];
  for (const file of candidates) {
    try {
      const content = fs.readFileSync(file).toString('base64');
      cachedLogo = { filename: LOGO_FILENAME, content, contentId: LOGO_CID };
      return cachedLogo;
    } catch {
      // Try the next candidate path.
    }
  }
  console.error('Email logo file not found; falling back to remote image URL.');
  cachedLogo = null;
  return cachedLogo;
}

/** A spec line for a pickup, e.g. { label: 'Bobbin', value: 'Cream' }. */
export interface ContactItemOption {
  readonly label: string;
  readonly value: string;
}

/** A single enquiry line item, carried as structured data from the cart. */
export interface ContactItem {
  readonly name: string;
  readonly qty: number;
  readonly price: number;
  readonly options?: readonly ContactItemOption[];
}

export interface ContactPayload {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
  readonly items?: readonly ContactItem[];
}

interface ParsedRequest {
  readonly ok: true;
  readonly data: ContactPayload;
  readonly isBot: boolean;
}

interface InvalidRequest {
  readonly ok: false;
  readonly error: string;
}

function readField(body: unknown, key: string): string {
  if (typeof body !== 'object' || body === null) return '';
  const value = (body as Record<string, unknown>)[key];
  return typeof value === 'string' ? value.trim() : '';
}

const MAX_ITEMS = 50;
const MAX_OPTIONS = 20;

function parseOptions(value: unknown): ContactItemOption[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const options: ContactItemOption[] = [];
  for (const raw of value.slice(0, MAX_OPTIONS)) {
    if (typeof raw !== 'object' || raw === null) continue;
    const obj = raw as Record<string, unknown>;
    const label = typeof obj['label'] === 'string' ? obj['label'].trim() : '';
    const optionValue = typeof obj['value'] === 'string' ? obj['value'].trim() : '';
    if (label === '' || optionValue === '') continue;
    options.push({ label: label.slice(0, 60), value: optionValue.slice(0, 120) });
  }
  return options.length > 0 ? options : undefined;
}

/** Parse optional structured line items; silently drops malformed entries. */
function parseItems(value: unknown): ContactItem[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items: ContactItem[] = [];
  for (const raw of value.slice(0, MAX_ITEMS)) {
    if (typeof raw !== 'object' || raw === null) continue;
    const obj = raw as Record<string, unknown>;
    const name = typeof obj['name'] === 'string' ? obj['name'].trim() : '';
    const qty =
      typeof obj['qty'] === 'number' && Number.isFinite(obj['qty']) ? Math.trunc(obj['qty']) : 0;
    const price =
      typeof obj['price'] === 'number' && Number.isFinite(obj['price']) ? obj['price'] : -1;
    if (name === '' || qty <= 0 || price < 0) continue;
    const options = parseOptions(obj['options']);
    const item: ContactItem = options
      ? { name: name.slice(0, 120), qty, price, options }
      : { name: name.slice(0, 120), qty, price };
    items.push(item);
  }
  return items.length > 0 ? items : undefined;
}

/** Validate and normalise the request body. */
function parseRequest(body: unknown): ParsedRequest | InvalidRequest {
  const name = readField(body, 'name');
  const email = readField(body, 'email');
  const subject = readField(body, 'subject') || 'Website inquiry';
  const message = readField(body, 'message');
  // Honeypot: a real visitor never fills the hidden "company" field.
  const isBot = readField(body, 'company') !== '';

  if (name === '' || name.length > MAX.name) {
    return { ok: false, error: 'Please let us know your name.' };
  }
  if (email === '' || email.length > MAX.email || !EMAIL_PATTERN.test(email)) {
    return {
      ok: false,
      error: "That email address doesn't look right — please double-check it.",
    };
  }
  if (subject.length > MAX.subject) {
    return { ok: false, error: 'That subject line is a little long — please shorten it.' };
  }
  if (message.length > MAX.message) {
    return { ok: false, error: 'That message is a little long — please trim it.' };
  }

  const items = parseItems((body as Record<string, unknown> | null)?.['items']);

  // The message is optional for an itemised enquiry (the items are the request,
  // and the message is for any extra custom requirements). For a plain enquiry
  // with no items, a message is required.
  if (items === undefined && message === '') {
    return { ok: false, error: 'Please add a short message so we know how we can help.' };
  }

  const data: ContactPayload = items
    ? { name, email, subject, message, items }
    : { name, email, subject, message };

  return { ok: true, data, isBot };
}

/** Escape user-supplied text for safe inclusion in HTML email bodies. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Wrap email body content in a shared branded shell. `siteUrl` is the canonical
 * site (used for links/footer); `assetUrl` is where the logo image loads from
 * (same as siteUrl in production, but the request origin in the dev preview so
 * the logo renders locally).
 */
function shell(title: string, inner: string, siteUrl: string, assetUrl: string): string {
  // Prefer the inline (cid) logo so it shows even when remote images are
  // blocked; fall back to the hosted URL only if the file couldn't be read.
  const logoSrc = getLogoAttachment()
    ? `cid:${LOGO_CID}`
    : `${assetUrl}/assets/logo/${LOGO_FILENAME}`;
  const displayUrl = siteUrl.replace(/^https?:\/\//, '');
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:${PAPER};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e6e0d4;border-radius:4px;overflow:hidden;font-family:Georgia,'Times New Roman',serif;color:${INK};">
            <tr>
              <td style="background:${INK};padding:28px 32px;text-align:center;">
                <img src="${logoSrc}" alt="BASEMENT PICKUPS" width="220" style="display:inline-block;width:220px;max-width:68%;height:auto;border:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;letter-spacing:0.22em;text-transform:uppercase;color:${GOLD};text-decoration:none;" />
              </td>
            </tr>
            <tr>
              <td style="height:3px;background:${GOLD};"></td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="margin:0 0 20px;font-size:20px;font-weight:normal;letter-spacing:0.04em;color:${INK};">${title}</h1>
                ${inner}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #e6e0d4;font-size:12px;color:${MUTED};text-align:center;">
                ${BRAND} — wound and voiced in the workshop.<br>
                <a href="${siteUrl}" style="color:${MUTED};text-decoration:underline;">${displayUrl}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function row(label: string, value: string): string {
  return `<tr>
      <td style="padding:6px 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};width:96px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-size:15px;color:${INK};">${value}</td>
    </tr>`;
}

function formatEuros(amount: number): string {
  return Number.isInteger(amount) ? `€${String(amount)}` : `€${amount.toFixed(2)}`;
}

function itemsSubtotal(items: readonly ContactItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/** Beautiful itemised table for the enquiry emails, built from structured data. */
function itemsTableHtml(items: readonly ContactItem[]): string {
  const rows = items
    .map((item) => {
      const optionsHtml =
        item.options !== undefined
          ? `<div style="margin-top:4px;font-size:13px;color:${MUTED};">${item.options
              .map(
                (o) =>
                  `${escapeHtml(o.label)}: <span style="color:${INK};">${escapeHtml(o.value)}</span>`,
              )
              .join(' &nbsp;·&nbsp; ')}</div>`
          : '';
      return `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #ece6da;font-size:15px;color:${INK};vertical-align:top;">${escapeHtml(item.name)}${optionsHtml}</td>
        <td style="padding:12px 0;border-bottom:1px solid #ece6da;font-size:15px;color:${MUTED};text-align:center;vertical-align:top;white-space:nowrap;">×${String(item.qty)}</td>
        <td style="padding:12px 0;border-bottom:1px solid #ece6da;font-size:15px;color:${INK};text-align:right;vertical-align:top;white-space:nowrap;">${formatEuros(item.price * item.qty)}</td>
      </tr>`;
    })
    .join('');

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0;border-top:1px solid #e6e0d4;">
      <tr>
        <td style="padding:10px 0 6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">Item</td>
        <td style="padding:10px 0 6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};text-align:center;">Qty</td>
        <td style="padding:10px 0 6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};text-align:right;">Total</td>
      </tr>
      ${rows}
      <tr>
        <td colspan="2" style="padding:14px 0 0;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};">Indicative subtotal</td>
        <td style="padding:14px 0 0;font-size:16px;color:${INK};text-align:right;white-space:nowrap;">${formatEuros(itemsSubtotal(items))}</td>
      </tr>
    </table>
    <p style="margin:12px 0 0;font-size:12px;color:${MUTED};">Indicative subtotal — excludes shipping and any custom work. We confirm availability, options, and final pricing by email.</p>`;
}

function itemsTableText(items: readonly ContactItem[]): string {
  const lines = items.map((item) => {
    const options =
      item.options !== undefined
        ? ` [${item.options.map((o) => `${o.label}: ${o.value}`).join(', ')}]`
        : '';
    return `- ${String(item.qty)} × ${item.name}${options} — ${formatEuros(item.price * item.qty)}`;
  });
  return [
    'Selected pickups:',
    ...lines,
    '',
    `Indicative subtotal: ${formatEuros(itemsSubtotal(items))} (excludes shipping and any custom work)`,
  ].join('\n');
}

/** Email sent to the workshop inbox. */
function notificationEmail(
  data: ContactPayload,
  siteUrl: string,
  assetUrl: string,
): { html: string; text: string } {
  const safe = {
    name: escapeHtml(data.name),
    email: escapeHtml(data.email),
    subject: escapeHtml(data.subject),
    message: escapeHtml(data.message).replace(/\n/g, '<br>'),
  };

  const itemsHtml =
    data.items !== undefined
      ? `<p style="margin:24px 0 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">Selected pickups</p>${itemsTableHtml(data.items)}`
      : '';

  const inner = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${row('From', safe.name)}
        ${row('Email', `<a href="mailto:${safe.email}" style="color:${GOLD};">${safe.email}</a>`)}
        ${row('Subject', safe.subject)}
      </table>
      ${itemsHtml}
      <p style="margin:24px 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">${data.items !== undefined ? 'Custom requirements' : 'Message'}</p>
      <div style="padding:20px;background:${PAPER};border-radius:4px;font-size:15px;line-height:1.6;color:${safe.message !== '' ? INK : MUTED};${safe.message !== '' ? '' : 'font-style:italic;'}">${safe.message !== '' ? safe.message : 'No additional notes.'}</div>`;

  const text = [
    `New contact message — ${BRAND}`,
    '',
    `From:    ${data.name}`,
    `Email:   ${data.email}`,
    `Subject: ${data.subject}`,
    ...(data.items !== undefined ? ['', itemsTableText(data.items)] : []),
    '',
    data.items !== undefined ? 'Custom requirements:' : 'Message:',
    data.message !== '' ? data.message : 'No additional notes.',
  ].join('\n');

  return { html: shell('New contact message', inner, siteUrl, assetUrl), text };
}

/**
 * Automatic confirmation sent back to the visitor. It echoes their exact
 * enquiry (subject + message) so they have a clear, branded acknowledgement of
 * precisely what reached the workshop.
 */
function confirmationEmail(
  data: ContactPayload,
  siteUrl: string,
  assetUrl: string,
): { html: string; text: string } {
  const safe = {
    name: escapeHtml(data.name),
    subject: escapeHtml(data.subject),
    message: escapeHtml(data.message).replace(/\n/g, '<br>'),
  };

  const inner = `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Hello ${safe.name},</p>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">Thank you for reaching out to ${BRAND}. We've received your enquiry and will reply personally — most messages are answered within a couple of working days. Below is a copy of exactly what you sent us.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e6e0d4;">
        <tr>
          <td style="padding:16px 0 6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">Subject</td>
        </tr>
        <tr>
          <td style="padding:0 0 16px;font-size:15px;color:${INK};">${safe.subject}</td>
        </tr>
      </table>
      ${
        data.items !== undefined
          ? `<p style="margin:0 0 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">Your selection</p>${itemsTableHtml(data.items)}<div style="height:24px;"></div>`
          : ''
      }
      ${
        safe.message !== ''
          ? `<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">Your message</p>
      <div style="padding:20px;background:${PAPER};border-radius:4px;font-size:15px;line-height:1.6;color:${INK};border-left:3px solid ${GOLD};">${safe.message}</div>`
          : ''
      }
      <p style="margin:24px 0 0;font-size:15px;line-height:1.6;">With thanks,<br><span style="color:${GOLD};">The ${BRAND} workshop</span></p>`;

  const text = [
    `Hello ${data.name},`,
    '',
    `Thank you for reaching out to ${BRAND}. We've received your enquiry and will reply personally — most messages are answered within a couple of working days. Below is a copy of exactly what you sent us.`,
    '',
    `Subject: ${data.subject}`,
    ...(data.items !== undefined ? ['', itemsTableText(data.items)] : []),
    ...(data.message !== '' ? ['', 'Your message:', data.message] : []),
    '',
    `With thanks,`,
    `The ${BRAND} workshop`,
  ].join('\n');

  return { html: shell('We received your enquiry', inner, siteUrl, assetUrl), text };
}

/** Canonical public origin for links and assets embedded in emails. */
function siteOrigin(): string {
  const configured = process.env['PUBLIC_ORIGIN'];
  return configured ? configured.replace(/\/+$/, '') : DEFAULT_SITE_ORIGIN;
}

let client: Resend | undefined;

function getClient(apiKey: string): Resend {
  client ??= new Resend(apiKey);
  return client;
}

/**
 * Express handler for `POST /api/contact`. Expects a JSON-parsed body, so it
 * must be mounted behind `express.json()`.
 */
export async function handleContact(req: Request, res: Response): Promise<void> {
  const parsed = parseRequest(req.body);
  if (!parsed.ok) {
    res.status(400).json({ ok: false, error: parsed.error });
    return;
  }

  // Silently accept honeypot hits so bots get no signal, but send nothing.
  if (parsed.isBot) {
    res.status(200).json({ ok: true });
    return;
  }

  const apiKey = process.env['RESEND_API_KEY'];
  const to = process.env['CONTACT_TO'];
  const fromEmail = process.env['FROM_EMAIL'];

  if (!apiKey || !to || !fromEmail) {
    console.error(
      'Contact endpoint misconfigured: RESEND_API_KEY, CONTACT_TO and FROM_EMAIL are required.',
    );
    res.status(500).json({
      ok: false,
      error:
        "Our message desk is briefly offline. Please email the workshop directly and we'll reply personally.",
    });
    return;
  }

  const resend = getClient(apiKey);
  const from = `${BRAND} <${fromEmail}>`;
  const { data } = parsed;
  const site = siteOrigin();
  const logo = getLogoAttachment();

  try {
    const notification = notificationEmail(data, site, site);
    const result = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `[Contact] ${data.subject} — ${data.name}`,
      html: notification.html,
      text: notification.text,
      ...(logo ? { attachments: [logo] } : {}),
    });

    if (result.error) {
      console.error('Resend notification error:', result.error);
      res.status(502).json({
        ok: false,
        error: "We couldn't send your message just now. Please try again in a moment.",
      });
      return;
    }

    // Best-effort confirmation: if it fails the workshop already has the
    // message, so we still report success to the visitor.
    const confirmation = confirmationEmail(data, site, site);
    const confirmationResult = await resend.emails.send({
      from,
      to: data.email,
      subject: `We received your message — ${BRAND}`,
      html: confirmation.html,
      text: confirmation.text,
      ...(logo ? { attachments: [logo] } : {}),
    });
    if (confirmationResult.error) {
      console.error('Resend confirmation error:', confirmationResult.error);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact endpoint failure:', err);
    res.status(502).json({
      ok: false,
      error: "We couldn't send your message just now. Please try again in a moment.",
    });
  }
}
