import { StrictMode } from 'react';
import type { RenderToPipeableStreamOptions } from 'react-dom/server';
import { renderToPipeableStream } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { routes } from './app/routes';
import { getSeoForUrl, getStatusForUrl } from './seo/getSeoForUrl';
import { getJsonLdForUrl } from './seo/getJsonLdForUrl';
import { renderSeoTags, renderJsonLd } from '../server/seo';

import './design-system/tokens/fonts.css';
import './design-system/tokens/reset.css';
import './design-system/tokens/tokens.css';
import './design-system/tokens/global.css';

export class SsrRedirectError extends Error {
  readonly response: Response;
  constructor(response: Response) {
    super('SSR redirect');
    this.response = response;
  }
}

export interface SsrRenderResult {
  headHtml: string;
  statusCode: number;
  startStream: (
    options: RenderToPipeableStreamOptions,
  ) => ReturnType<typeof renderToPipeableStream>;
}

export async function render(request: Request, nonce: string): Promise<SsrRenderResult> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(request);

  if (context instanceof Response) {
    throw new SsrRedirectError(context);
  }

  const router = createStaticRouter(handler.dataRoutes, context);
  const requestUrl = new URL(request.url);
  const seo = getSeoForUrl(requestUrl.pathname, requestUrl.origin);
  const jsonLd = getJsonLdForUrl(requestUrl.pathname, requestUrl.origin);
  const headHtml =
    jsonLd.length > 0 ? `${renderSeoTags(seo)}\n    ${renderJsonLd(jsonLd)}` : renderSeoTags(seo);
  // Soft-404 fix: send a real 404 for the splat route and unknown slugs while
  // still streaming the friendly not-found UI. Honor any non-200 the router
  // already resolved (e.g. a future loader throwing a Response).
  const statusCode =
    context.statusCode !== 200 ? context.statusCode : getStatusForUrl(requestUrl.pathname);

  return {
    headHtml,
    statusCode,
    startStream(options) {
      return renderToPipeableStream(
        <StrictMode>
          <StaticRouterProvider router={router} context={context} nonce={nonce} />
        </StrictMode>,
        { ...options, nonce },
      );
    },
  };
}
