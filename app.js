const path = require('path');
const webpack = require('webpack')
const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const pageId = require('spike-page-id')
const sugarml = require('sugarml')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const env = process.env.SPIKE_ENV
const sourceMapQueryStr = (env === 'production') ? '+sourceMap' : '-sourceMap';
const assetsFilenames = (env === 'production') ? '[name]_[hash]' : '[name]';

module.exports = {
  devtool: 'source-map',
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.scss' },
  ignore: ['**/layout.html', '**/layout.sgr', '**/_*', '**/.*', 'readme.md', 'yarn.lock', 'package-lock.json'],
  module: {
    rules: [
      { 
        test: /\.scss/, 
        include: path.resolve(__dirname, 'assets'),
        use: ExtractTextPlugin.extract({
          use: [
            `css-loader?${sourceMapQueryStr}`,
            'postcss-loader',
            `resolve-url-loader?${sourceMapQueryStr}`,
            `sass-loader?${sourceMapQueryStr}`,
          ],
        })
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    }),
    new ExtractTextPlugin({
      filename: `css/${assetsFilenames}.css`,
      allChunks: true
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.s?css$/,
      options: {
        output: { path: 'public' },
        context: 'assets',
        postcss: [
          autoprefixer({ 
            browsers: [
              "last 2 versions",
              "android 4",
              "opera 12"
            ] 
          }),
        ],
      },
    }),
  ],
  reshape: htmlStandards({
    parser: sugarml,
    locals: (ctx) => { return { pageId: pageId(ctx), foo: 'bar' } },
    minify: env === 'production'
  }),
  postcss: cssStandards({
    minify: env === 'production',
    warnForDuplicates: env !== 'production'
  }),
  babel: jsStandards()
}