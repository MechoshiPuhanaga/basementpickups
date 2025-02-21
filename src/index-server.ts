import express, { Request, Response } from 'express';
import expressStaticGzip from 'express-static-gzip';
import path from 'node:path';

import { routes } from '@pages';
import { ServerModel } from '@services';
import { SSRContext } from '@type';

import AppConfig from './App';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  '/public',
  expressStaticGzip('./dist/public', { enableBrotli: true, orderPreference: ['br'] })
);

app.get('/*.json', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('/robots.txt', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('/favicon.png', (_, res) => res.sendFile(path.join(__dirname, 'favicon.ico')));

app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('/*.png', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('/sitemap.xml', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('/sitemap.xml.gz', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('/sw.js', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('/sw-config.js', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('*', async (req: Request, res: Response) => {
  const initialState = await ServerModel.getInitialState({ req, routes });

  const context: SSRContext = {
    data: initialState,
    params: req.params,
    query: req.query,
    url: req.url
  };

  ServerModel.renderApp({
    App: AppConfig.element,
    context,
    req,
    res
  });
});

app.listen(PORT, () => {
  console.log(`Rendering server listening on port ${PORT}`);
});
