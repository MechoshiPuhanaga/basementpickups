import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { Writable } from 'node:stream';
import type { ViteDevServer } from 'vite';
import { handleContact } from './contact';
import { buildLlmsTxt, buildRobotsTxt, buildSitemapXml } from './crawlers';
import { splitTemplate } from './renderHtml';
import { contentSecurityPolicy, securityHeaders } from './security';
import type { SsrRenderResult } from '../src/entry-server';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const ABORT_DELAY_MS = 10_000;
const DEFAULT_PROD_ORIGIN = 'https://basementpickups.com';

export interface AppOptions {
  /** Production mode: serve `dist/`, strict CSP, HSTS. Defaults to NODE_ENV === 'production'. */
  readonly isProd?: boolean;
  /**
   * Public origin for canonical/OG URLs, sitemap, robots and llms.txt. In
   * production this must never follow the request Host (a direct *.herokuapp.com
   * hit would otherwise declare itself canonical); in dev it follows the request
   * so localhost previews stay self-consistent. Defaults to PUBLIC_ORIGIN.
   */
  readonly publicOrigin?: string;
  /** Port used only for the Host fallback when a request carries none. */
  readonly port?: number;
}

interface AppConfig {
  readonly isProd: boolean;
  readonly publicOrigin: string;
  readonly port: number;
}

export function resolvePublicOrigin(isProd: boolean, configured: string | undefined): string {
  return (configured ?? (isProd ? DEFAULT_PROD_ORIGIN : '')).trim().replace(/\/+$/, '');
}

function resolveConfig(options: AppOptions): AppConfig {
  const isProd = options.isProd ?? process.env['NODE_ENV'] === 'production';
  return {
    isProd,
    publicOrigin:
      options.publicOrigin !== undefined
        ? resolvePublicOrigin(isProd, options.publicOrigin)
        : resolvePublicOrigin(isProd, process.env['PUBLIC_ORIGIN']),
    port: options.port ?? (Number(process.env['PORT']) || 3000),
  };
}

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

async function createDevViteServer(): Promise<ViteDevServer> {
  const { createServer } = await import('vite');
  return createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: ROOT,
  });
}

function getRequestOrigin(req: express.Request, config: AppConfig): string {
  if (config.publicOrigin !== '') return config.publicOrigin;
  const host = req.get('host') ?? `localhost:${String(config.port)}`;
  const proto = req.protocol || 'http';
  return `${proto}://${host}`;
}

function buildFetchRequest(req: express.Request, config: AppConfig): Request {
  // The origin feeds the SSR SEO layer (canonical/OG URLs); the path drives routing.
  const requestUrl = `${getRequestOrigin(req, config)}${req.originalUrl}`;

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

/**
 * Build the Express app (without listening). `server/index.ts` is the runtime
 * entry; tests create their own instance with explicit options.
 */
export async function createApp(options: AppOptions = {}): Promise<express.Express> {
  const config = resolveConfig(options);
  const { isProd } = config;

  const app = express();
  app.set('trust proxy', true);
  // Make the option authoritative for Express itself (its default error handler
  // prints stack traces unless the app env is 'production').
  app.set('env', isProd ? 'production' : 'development');

  app.use(securityHeaders(isProd));

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
    // The built template is an SSR input, not a page: `express.static` would
    // otherwise serve it raw (placeholder comments and all) at /index.html.
    app.get('/index.html', (_req, res) => {
      res.redirect(301, '/');
    });
    app.use(
      express.static(path.resolve(ROOT, 'dist/client'), {
        index: false,
        maxAge: '1y',
      }),
    );
  }

  // Contact form submission. Mounted before the SSR catch-all so it is not
  // swallowed by the React renderer. JSON body, capped to a small size.
  app.post('/api/contact', express.json({ limit: '64kb' }), (req, res) => {
    void handleContact(req, res);
  });

  // Crawler files are cheap to rebuild but change only on deploy; let caches
  // (and Cloudflare) hold them for an hour.
  const CRAWLER_CACHE_CONTROL = 'public, max-age=3600';

  app.get('/robots.txt', (req, res) => {
    res.setHeader('Cache-Control', CRAWLER_CACHE_CONTROL);
    res.type('text/plain').send(buildRobotsTxt(getRequestOrigin(req, config)));
  });

  app.get('/sitemap.xml', (req, res) => {
    res.setHeader('Cache-Control', CRAWLER_CACHE_CONTROL);
    res.type('application/xml').send(buildSitemapXml(getRequestOrigin(req, config)));
  });

  app.get('/llms.txt', (req, res) => {
    res.setHeader('Cache-Control', CRAWLER_CACHE_CONTROL);
    res.type('text/plain').send(buildLlmsTxt(getRequestOrigin(req, config)));
  });

  // One URL per page: a trailing slash (except the root) redirects permanently
  // to the slash-less form, keeping any query string.
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }
    if (req.path.length > 1 && req.path.endsWith('/')) {
      const query = req.originalUrl.slice(req.path.length);
      res.redirect(301, req.path.replace(/\/+$/, '') + query);
      return;
    }
    next();
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

      const fetchRequest = buildFetchRequest(req, config);
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

  return app;
}
