/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');
const webpack = require('webpack');

const common = require('./webpack.ssr.common');

const server = (_, argv) => {
  const config = {
    entry: {
      app: './src/index-server.ts'
    },
    output: {
      filename: 'server.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.IS_BROWSER': false,
        'process.env.IS_SERVER': true,
        'process.env.MODE': JSON.stringify(argv.mode)
      })
    ],
    target: 'node'
  };

  return config;
};

module.exports = (env, argv) => merge(common(env, argv), server(env, argv));
