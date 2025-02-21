import { Request, Response } from 'express';
import fs from 'node:fs';
import { Writable } from 'node:stream';
import { FC } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import Helmet from 'react-helmet';
import { matchPath } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import serialize from 'serialize-javascript';

import { InitialStateProvider } from '@providers';
import { InitialState, SSRContext, SSRRoute } from '@type';

import { GlobalModel } from '../GlobalModel/GlobalModel';

// The cwd of the server process
// will be the project root so
// that's why the files are being
// requested from the 'dist' folder:
const template = fs.readFileSync('dist/index.html', { encoding: 'utf8' });
const root = '<div id="root"></div>';
const [head] = template.split(root);

const assets = JSON.parse(
  fs.readFileSync('dist/assets-manifest.json', { encoding: 'utf8' })
) as Record<string, string>;

const cssAssets = Object.values(assets).filter(
  (asset) => asset.endsWith('.css') && asset.indexOf('public/app.') < 0
);

export class ServerModel {
  static generateStyleTags = (cssHrefList: string[]) => {
    return cssHrefList.reduce((result, href) => {
      result += `<link href="${href}" rel="stylesheet">`;

      return result;
    }, '');
  };

  static getInitialState = async ({ req, routes }: { req: Request; routes: SSRRoute[] }) => {
    const promises: Promise<InitialState<unknown>>[] = [];

    const routesToCheck = GlobalModel.flattenRoutes(routes);

    routesToCheck.forEach((route) => {
      const match = matchPath(route.path, req.path);

      if (match && route.loadData) {
        promises.push(route.loadData({ params: req.params, query: req.query, url: req.url }));
      }

      return match;
    });

    const data = await Promise.all(promises);

    return data.reduce((state, current) => {
      if (typeof state === 'object' && state && typeof current === 'object' && current) {
        return { ...state, ...current };
      } else {
        return state;
      }
    }, {});
  };

  static renderApp = ({
    App,
    context,
    req,
    res
  }: {
    App: FC;
    context: SSRContext;
    req: Request;
    res: Response;
  }) => {
    let didError = false;

    const stream = renderToPipeableStream(
      <InitialStateProvider value={context.data}>
        <StaticRouter location={req.path}>
          <App />
        </StaticRouter>
      </InitialStateProvider>,
      {
        onError(err) {
          didError = true;

          console.error(err);
        },
        onShellError() {
          res.statusCode = 500;

          res.send('<!doctype html><h1>Error loading</h1>');
        },
        onShellReady() {
          res.statusCode = didError ? 500 : 200;

          res.setHeader('Content-type', 'text/html');

          const sanitizedInitialState = serialize(context.data);

          const cssTags = ServerModel.generateStyleTags(cssAssets);

          const helmet = Helmet.renderStatic();

          // eslint-disable-next-line max-len
          const tags = `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}`;

          const updatedHead = `${head}`.replace('</head>', `${cssTags}${tags}</head>`);

          const headWithOpeningRoot = `${updatedHead}<div id="root">`;

          const newStream = new Writable({
            final() {
              // 3. After the react content stream has ended,
              // write the initial state tag and the closing tags:
              res.end(
                // eslint-disable-next-line max-len
                `</div><script id="__INITIAL_STATE__">window.__INITIAL_STATE__= ${sanitizedInitialState}</script></body></html>`
              );
            },
            write(chunk, _encoding, cb) {
              // 2.1. The piped react chunks are
              // being written to the response:
              res.write(chunk, cb);
            }
          });

          // 1. Write the updated head content:
          res.write(headWithOpeningRoot);

          // 2. Start streaming the react content:
          stream.pipe(newStream);
        }
      }
    );
  };
}
