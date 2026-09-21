import type express from 'express';

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
export function contentSecurityPolicy(nonce: string): string {
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

/** Baseline security headers on every response (dev + prod). */
export function securityHeaders(isProd: boolean): express.RequestHandler {
  return (_req, res, next) => {
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
  };
}
