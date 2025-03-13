import express, { Request, Response } from 'express';
import expressStaticGzip from 'express-static-gzip';
import path from 'node:path';

import { ServerModel } from '@services';
import { AppState, SSRContext } from '@type';

import AppConfig from './App';
import products from './data/products.json';

const appState: AppState = {
  products
};

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

app.get('/*.jpg', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('/sitemap.xml', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('/sitemap.xml.gz', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('/sw.js', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('/sw-config.js', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, req.url)));

app.get('*', async (req: Request, res: Response) => {
  const context: SSRContext = {
    data: appState,
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
