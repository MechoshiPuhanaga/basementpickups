import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { Writable } from 'node:stream';
import type { ViteDevServer } from 'vite';
import { splitTemplate } from './renderHtml';
import type { SsrRenderResult } from '../src/entry-server';
import { pickups } from '../src/data/pickups';
import { articles } from '../src/data/articles';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env['NODE_ENV'] === 'production';
const PORT = Number(process.env['PORT']) || 3000;
const ROOT = path.resolve(__dirname, '..');
const ABORT_DELAY_MS = 10_000;

// In dev, Vite injects component/token CSS via JS *after* the module loads, so
// the first SSR paint is unstyled (FOUC). To make the page fully styled from the
// first byte, we compile every project stylesheet through Vite (`?direct` yields
// the real CSS with the same scoped class names the SSR markup uses) and inline
// the whole lot into the SSR head. Production already ships a render-blocking
// <link>, so this is dev-only.
//
// Token globals must come first so :root variables, the reset, and base
// html/body styles are established before component rules.
const TOKEN_CSS_ORDER = [
  '/src/design-system/tokens/fonts.css',
  '/src/design-system/tokens/reset.css',
  '/src/design-system/tokens/tokens.css',
  '/src/design-system/tokens/global.css',
];

function listCssFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listCssFiles(full, acc);
    else if (entry.name.endsWith('.css')) acc.push(full);
  }
  return acc;
}

async function collectDevCss(vite: ViteDevServer): Promise<string> {
  const all = listCssFiles(path.resolve(ROOT, 'src')).map(
    (file) => '/' + path.relative(ROOT, file).split(path.sep).join('/'),
  );
  const tokens = TOKEN_CSS_ORDER.filter((url) => all.includes(url));
  const rest = all.filter((url) => !tokens.includes(url)).sort();
  const ordered = [...tokens, ...rest];

  const chunks: string[] = [];
  for (const url of ordered) {
    const result = await vite.transformRequest(`${url}?direct`);
    if (result?.code) chunks.push(result.code);
  }
  return `<style data-ssr-css>${chunks.join('\n')}</style>`;
}

type RenderFn = (request: Request, nonce: string) => Promise<SsrRenderResult>;

/**
 * Strict, nonce-based Content-Security-Policy. The only inline element in the
 * production HTML is React Router's hydration <script>, which carries this
 * nonce. Everything else loads from 'self'. Applied in production only — the
 * Vite dev server relies on inline scripts/eval that a strict policy forbids.
 *
 * `require-trusted-types-for 'script'` mitigates DOM-based XSS by forcing
 * dangerous DOM sinks (innerHTML, script.src, eval, …) to receive a typed,
 * policy-vetted value instead of a raw string. No `trusted-types` allowlist is
 * set, so libraries may still create policies as needed.
 *
 * `'unsafe-inline'` is a backward-compatibility fallback only: CSP3 browsers
 * ignore it whenever a nonce/hash is present (so modern security is unchanged),
 * while pre-nonce browsers fall back to it instead of breaking. We deliberately
 * do NOT use `'strict-dynamic'` — it would make `'self'` ignored and block the
 * Vite-injected module <script> tags, which are allowed via `'self'`, not a nonce.
 */
function contentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "form-action 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
    `style-src 'self' 'nonce-${nonce}'`,
    "require-trusted-types-for 'script'",
  ].join('; ');
}

async function createDevViteServer(): Promise<ViteDevServer> {
  const { createServer } = await import('vite');
  return createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: ROOT,
  });
}

function buildFetchRequest(req: express.Request): Request {
  const host = req.get('host') ?? 'localhost';
  const protocol = req.protocol || 'http';
  const requestUrl = `${protocol}://${host}${req.originalUrl}`;

  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) headers.append(name, item);
    } else {
      headers.append(name, value);
    }
  }

  return new Request(requestUrl, { method: req.method, headers });
}

function getRequestOrigin(req: express.Request): string {
  const host = req.get('host') ?? `localhost:${String(PORT)}`;
  const proto = req.protocol || 'http';
  return `${proto}://${host}`;
}

function buildRobotsTxt(origin: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
}

function buildLlmsTxt(origin: string): string {
  const products = pickups
    .map((p) => `- [${p.name}](${origin}/products/${p.slug}): ${p.description}`)
    .join('\n');
  const posts = articles
    .map((a) => `- [${a.headline}](${origin}/articles/${a.slug}): ${a.excerpt}`)
    .join('\n');

  return `# Basement Pickups

> Handcrafted boutique guitar pickups. Premium tone, restrained design, deliberate craftsmanship. Every pickup is wound to order in-house.

Basement Pickups is a boutique workshop building hand-wound electric guitar pickups (humbuckers, single-coils, P-90s). There is no online checkout: customers assemble an enquiry and send it to the workshop, and pickups are made to order.

## Pages

- [Shop](${origin}/shop): The full collection of available pickups.
- [About](${origin}/about): The workshop, the craft, and the philosophy.
- [Articles](${origin}/articles): Editorial on winding, tone, magnets, and process.
- [Contact](${origin}/contact): Get in touch with the workshop.

## Products

${products}

## Articles

${posts}
`;
}

function buildSitemapXml(origin: string): string {
  const entries: { path: string; lastmod?: string }[] = [
    '/',
    '/shop',
    '/about',
    '/articles',
    '/contact',
  ].map((path) => ({ path }));

  for (const pickup of pickups) {
    entries.push({ path: `/products/${pickup.slug}` });
    for (const variant of pickup.variants ?? []) {
      entries.push({ path: `/products/${variant.slug}` });
    }
  }

  for (const article of articles) {
    entries.push({
      path: `/articles/${article.slug}`,
      lastmod: article.metadata.publishedAt,
    });
  }

  const urls = entries
    .map(({ path: urlPath, lastmod }) => {
      const lastmodTag = lastmod !== undefined ? `<lastmod>${lastmod}</lastmod>` : '';
      return `  <url><loc>${origin}${urlPath}</loc>${lastmodTag}</url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function start(): Promise<void> {
  const app = express();
  app.set('trust proxy', true);

  // Baseline security headers on every response (dev + prod).
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    );
    // Origin isolation: detach window.opener from cross-origin windows and stop
    // other origins from embedding our resources. (COEP is intentionally omitted
    // — full cross-origin isolation isn't needed and gates all subresources.)
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    if (isProd) {
      // 2-year max-age + includeSubDomains + preload satisfies the HSTS preload
      // list requirements. NB: includeSubDomains forces HTTPS on every subdomain;
      // `preload` is the prerequisite directive, but actual enrollment is a
      // separate one-time submission at https://hstspreload.org (and hard to undo).
      res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    }
    next();
  });

  // Serve the service worker from root scope with no-cache so updates are
  // always detected (before the long-lived static handler).
  app.get('/sw.js', (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Service-Worker-Allowed', '/');
    res.type('application/javascript');
    res.sendFile(path.resolve(ROOT, isProd ? 'dist/client/sw.js' : 'public/sw.js'));
  });

  let vite: ViteDevServer | undefined;

  if (!isProd) {
    vite = await createDevViteServer();
    app.use(vite.middlewares);
  } else {
    app.use(
      express.static(path.resolve(ROOT, 'dist/client'), {
        index: false,
        maxAge: '1y',
      }),
    );
  }

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain').send(buildRobotsTxt(getRequestOrigin(req)));
  });

  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml').send(buildSitemapXml(getRequestOrigin(req)));
  });

  app.get('/llms.txt', (req, res) => {
    res.type('text/plain').send(buildLlmsTxt(getRequestOrigin(req)));
  });

  app.use(async (req, res, next) => {
    try {
      let template: string;
      let render: RenderFn;

      if (vite) {
        const rawTemplate = fs.readFileSync(path.resolve(ROOT, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, rawTemplate);
        const mod = (await vite.ssrLoadModule('/src/entry-server.tsx')) as {
          render: RenderFn;
        };
        render = mod.render;
      } else {
        template = fs.readFileSync(path.resolve(ROOT, 'dist/client/index.html'), 'utf-8');
        const mod = (await import(
          url.pathToFileURL(path.resolve(ROOT, 'dist/server/entry-server.js')).href
        )) as { render: RenderFn };
        render = mod.render;
      }

      const nonce = crypto.randomBytes(16).toString('base64');
      if (isProd) {
        res.setHeader('Content-Security-Policy', contentSecurityPolicy(nonce));
      }

      const fetchRequest = buildFetchRequest(req);
      const { headHtml, statusCode, startStream } = await render(fetchRequest, nonce);
      const fullHead = vite ? (await collectDevCss(vite)) + headHtml : headHtml;
      const { head, tail } = splitTemplate(template, fullHead);

      let didError = false;
      const stream = startStream({
        onShellReady() {
          res.statusCode = didError ? 500 : statusCode;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          // SSR HTML is dynamic and references content-hashed assets; always
          // revalidate so a new deploy's HTML (and its new asset hashes) is
          // picked up immediately by browsers and the service worker.
          res.setHeader('Cache-Control', 'no-cache');
          res.write(head);

          const sink = new Writable({
            write(chunk: Buffer, _enc, cb) {
              res.write(chunk, (err) => {
                cb(err ?? null);
              });
            },
            final(cb) {
              res.end(tail, () => {
                cb();
              });
            },
          });
          stream.pipe(sink);
        },
        onShellError(err) {
          didError = true;
          console.error('SSR shell error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end('<!doctype html><h1>Internal Server Error</h1>');
        },
        onError(err) {
          didError = true;
          console.error('SSR render error:', err);
        },
      });

      setTimeout(() => {
        stream.abort();
      }, ABORT_DELAY_MS);
    } catch (err) {
      if (vite && err instanceof Error) vite.ssrFixStacktrace(err);
      next(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${String(PORT)}`);
  });
}

void start();
