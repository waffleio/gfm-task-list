const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const webpack = require('webpack');

module.exports = {
  devServer: {
    historyApiFallback: true,
    port: 3000,
    stats: {
      cached: true,
      cachedAssets: true,
      chunks: true,
      chunkModules: false,
      colors: true,
      hash: false,
      reasons: true,
      timings: true,
      version: false
    }
  },

  devtool: 'source-map',

  entry: './development/development.ts',

  output: {
    filename: 'bundle.js',
    path: path.resolve('./dist')
  },

  module: {
    loaders: [
      { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
      { test: /\.ts$/, loader: 'awesome-typescript-loader' }
    ]
  },

  plugins: [
    new DefinePlugin({ GH_ACCESS_TOKEN: JSON.stringify(process.env.GH_ACCESS_TOKEN) }),
    new ForkCheckerPlugin(),
    new HtmlWebpackPlugin({ template: 'development/development.html' }),
    new ProvidePlugin({ $: 'jquery' })
  ],

  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js'],
    modulesDirectories: ['node_modules'],
    root: path.resolve('.')
  }
};
