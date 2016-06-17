const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const path = require('path');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/main.ts',

  output: {
    filename: 'bundle.js',
    path: path.resolve('./dist')
  },

  externals: [ 'jquery' ],

  module: {
    loaders: [
      { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
      { test: /\.ts$/, loader: 'awesome-typescript-loader' }
    ]
  },

  plugins: [
    new ProvidePlugin({ $: 'jquery' }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
          except: ['$', 'exports', 'require']
      }
    })
  ],

  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js'],
    modulesDirectories: ['node_modules'],
    root: path.resolve('.')
  }
};
