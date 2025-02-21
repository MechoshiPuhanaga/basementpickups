/* eslint-disable @typescript-eslint/no-var-requires */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('node:path');
const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (_, argv) => {
  const isDev = argv.mode === 'development';

  return {
    devtool: isDev ? 'eval-source-map' : 'source-map',
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.(ts|tsx)$/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          generator: {
            filename: 'public/fonts/[name][ext]'
          },
          test: /\.(woff|woff2|ttf|eot)$/,
          type: 'asset/resource'
        },
        {
          generator: {
            filename: 'public/images/[name][ext]'
          },
          test: /\.(png|jpe?g|gif|svg|ico)$/,
          type: 'asset/resource'
        },
        {
          include: /node_modules/,
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                modules: false
              }
            }
          ]
        },
        {
          exclude: /node_modules/,
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 3,
                modules: {
                  localIdentName: '[name]__[local]__container__[hash:base64:5]'
                },
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['autoprefixer']
                }
              }
            },
            { loader: 'sass-loader' }
          ]
        }
      ]
    },
    output: {
      path: path.resolve(__dirname, '../../dist'),
      publicPath: '/'
    },
    plugins: [
      new MiniCssExtractPlugin({
        chunkFilename: 'public/[id].[chunkhash].css',
        filename: 'public/[name].[chunkhash].css'
      }),
      new RobotstxtPlugin(),
      new SitemapPlugin({
        base: isDev ? 'http://localhost:3000' : 'https://basementpickups.com',
        paths: ['/', '/about', '/products']
      })
    ],
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, '..', 'src', 'assets'),
        '@components': path.resolve(__dirname, '..', 'src', 'components'),
        '@pages': path.resolve(__dirname, '..', 'src', 'pages'),
        '@providers': path.resolve(__dirname, '..', 'src', 'providers'),
        '@services': path.resolve(__dirname, '..', 'src', 'services'),
        '@styles': path.resolve(__dirname, '..', 'src', 'styles'),
        '@type': path.resolve(__dirname, '..', 'src', 'types'),
        '@ui': path.resolve(__dirname, '..', 'src', 'ui')
      },
      extensions: ['.js', '.ts', '.tsx', '.scss'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, '..', '..', 'tsconfig.json'),
          extensions: ['.ts', '.tsx']
        })
      ]
    },
    stats: 'errors-only'
  };
};
