import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

import { contentSecurityPolicy, securityHeaders } from './security';

describe('contentSecurityPolicy', () => {
  it('builds a strict nonce-based policy', () => {
    const csp = contentSecurityPolicy('abc123');
    const directives = csp.split('; ');
    expect(directives).toEqual([
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "form-action 'self'",
      "script-src 'self' 'nonce-abc123' 'unsafe-inline'",
      "style-src 'self' 'nonce-abc123'",
      "require-trusted-types-for 'script'",
    ]);
    expect(csp).not.toContain('strict-dynamic');
  });
});

describe('securityHeaders', () => {
  function run(isProd: boolean): Record<string, string> {
    const headers: Record<string, string> = {};
    const res = {
      setHeader(name: string, value: string) {
        headers[name] = value;
      },
    } as unknown as Response;
    const next = vi.fn();
    securityHeaders(isProd)({} as Request, res, next);
    expect(next).toHaveBeenCalledOnce();
    return headers;
  }

  it('sets the baseline headers in every mode', () => {
    const headers = run(false);
    expect(headers).toEqual({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
    });
  });

  it('adds HSTS with preload only in production', () => {
    expect(run(true)['Strict-Transport-Security']).toBe(
      'max-age=63072000; includeSubDomains; preload',
    );
    expect(run(false)).not.toHaveProperty('Strict-Transport-Security');
  });
});
