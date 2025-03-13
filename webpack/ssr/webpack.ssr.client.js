/* eslint-disable @typescript-eslint/no-var-requires */
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('node:fs');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('node:path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const zlib = require('node:zlib');

const common = require('./webpack.ssr.common');

const client = (_, argv) => {
  const isProd = argv.mode === 'production';

  const config = {
    entry: {
      app: './src/index-client.tsx'
    },
    output: {
      chunkFilename: 'public/[name].chunk.[chunkhash].js',
      filename: 'public/[name].[chunkhash].js'
    },
    plugins: [
      {
        apply(compiler) {
          compiler.hooks.done.tap('CacheSuffixPlugin', () => {
            const timestamp = new Date().getTime();

            console.log('Setting cache suffix:', timestamp);

            const assetsManifest = fs.readFileSync(
              path.resolve(__dirname, '..', '..', 'dist', 'assets-manifest.json')
            );

            const assets = JSON.parse(assetsManifest);

            assets['favicon.ico'] = 'favicon.ico';

            // Prefetch all pages:
            assets.home = '/';
            assets.about = '/about';
            assets.products = '/products';
            assets.articles = '/articles';

            fs.writeFileSync(
              path.resolve(__dirname, '..', '..', 'dist', 'sw-config.js'),
              `
const process = {
  env: {
    ASSETS: ${JSON.stringify(assets)},
    CACHE_VERSION: ${timestamp},
    MODE: ${JSON.stringify(argv.mode)}
  }
}
`
            );
          });
        }
      },
      new CopyWebpackPlugin({
        patterns: [{ from: './src/workers/sw.js', to: '' }]
      }),
      new webpack.DefinePlugin({
        'process.env.IS_BROWSER': true,
        'process.env.IS_SERVER': false,
        'process.env.MODE': JSON.stringify(argv.mode)
      }),
      new HtmlWebPackPlugin({
        favicon: 'src/favicon.ico',
        template: 'src/index.html'
      }),
      isProd &&
        new CompressionPlugin({
          algorithm: 'brotliCompress',
          compressionOptions: {
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]: 11
            }
          },
          deleteOriginalAssets: false,
          filename: '[path][base].br',
          minRatio: 0.8,
          test: /\.(js|css|html|svg)$/,
          threshold: 10240
        }),
      new WebpackAssetsManifest({
        customize(entry, original, manifest, asset) {
          if (asset.name.endsWith('.map') || asset.name.endsWith('.txt')) {
            return false;
          } else {
            return entry;
          }
        },
        sortManifest: true
      }),
      new WebpackPwaManifest({
        background_color: '#081229',
        crossorigin: 'use-credentials',
        description: 'Basement pickups webs ite',
        display: 'standalone',
        icons: [
          {
            ios: true,
            sizes: [96, 128, 192, 256, 384, 512],
            src: path.resolve(__dirname, '..', '..', 'src', 'icon.png')
          },
          {
            ios: true,
            size: '1024x1024',
            src: path.resolve(__dirname, '..', '..', 'src', 'icon.png')
          },
          {
            ios: true,
            purpose: 'maskable',
            size: '1024x1024',
            src: path.resolve(__dirname, '..', '..', 'src', 'icon.png')
          }
        ],
        inject: true,
        ios: true,
        name: 'Basement pickups web site',
        short_name: 'Basement pickups',
        start_url: '.',
        theme_color: '#081229'
      })
    ].filter(Boolean)
  };

  return config;
};

module.exports = (env, argv) => merge(common(env, argv), client(env, argv));
