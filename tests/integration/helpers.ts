import fs from 'node:fs';
import path from 'node:path';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';

import { createApp, type AppOptions } from '../../server/app';

export const ROOT = path.resolve(import.meta.dirname, '../..');
export const ORIGIN = 'https://example.test';

export interface RunningApp {
  readonly base: string;
  readonly get: (pathname: string, init?: RequestInit) => Promise<Response>;
  readonly close: () => Promise<void>;
}

/** Start a fresh app on an ephemeral port. Production mode needs `pnpm run build`. */
export async function startApp(
  options: AppOptions = { isProd: true, publicOrigin: ORIGIN },
): Promise<RunningApp> {
  if (options.isProd !== false && !fs.existsSync(path.join(ROOT, 'dist/server/entry-server.js'))) {
    throw new Error('Integration tests need the production build: run `pnpm run build` first.');
  }
  const app = await createApp(options);
  const server: Server = app.listen(0);
  const { port } = server.address() as AddressInfo;
  const base = `http://127.0.0.1:${String(port)}`;
  return {
    base,
    get: (pathname, init) => fetch(`${base}${pathname}`, { redirect: 'manual', ...init }),
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      }),
  };
}

export function postJson(app: RunningApp, pathname: string, body: unknown): Promise<Response> {
  return app.get(pathname, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** First `<tag …>` in the HTML matching the attribute selector, or null. */
export function findTag(html: string, tag: string, attr: string, value: string): string | null {
  const pattern = new RegExp(`<${tag}[^>]*\\b${attr}="${escapeRegExp(value)}"[^>]*>`);
  return pattern.exec(html)?.[0] ?? null;
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function cspNonce(res: Response): string {
  const csp = res.headers.get('content-security-policy') ?? '';
  const match = /'nonce-([^']+)'/.exec(csp);
  if (match?.[1] === undefined) throw new Error(`No nonce in CSP header: ${csp}`);
  return match[1];
}
