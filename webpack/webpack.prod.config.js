const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const path = require('path');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackMerge = require('webpack-merge');

const baseFilename = 'gfm-task-list';

const baseConfig = {
  entry: './src/main.ts',

  output: {
    path: path.resolve('./dist')
  },

  devtool: 'sourcemap',

  externals: {
    'jquery': 'jQuery'
  },

  module: {
    loaders: [
      { test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader") },
      { test: /\.ts$/, loader: 'awesome-typescript-loader' }
    ]
  },

  plugins: [
    new ProvidePlugin({ $: 'jquery' })
  ],

  resolve: {
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js'],
    modulesDirectories: ['node_modules'],
    root: path.resolve('.')
  }
};

const unminConfig = WebpackMerge(baseConfig, {
  output: {
    filename: `${baseFilename}.js`
  },
  plugins: [
    new ExtractTextPlugin(`${baseFilename}.css`)
  ]
});

const minConfig = WebpackMerge(baseConfig, {
  output: {
    filename: `${baseFilename}.min.js`
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
          except: ['$', 'exports', 'require']
      }
    }),
    new ExtractTextPlugin(`${baseFilename}.min.css`)
  ]
});

module.exports = [unminConfig, minConfig];
