const webpack = require('webpack');

module.exports = function(config) {
  browsers: ['Chrome'],

  colors: true,

  files: [
    'spec/*.ts'
  ],

  frameworks: ['mocha'],

  plugins: [
    require("karma-mocha"),
    require("karma-spec-reporter"),
    require("karma-chrome-launcher")
  ],

  port: 9876,

  preprocessors: {
    'spec/*': ['webpack']
  },

  reporters: ['spec'],

  webpack: {
    resolve: {
      extensions: ["", ".js", ".ts"]
    },
    module: {
      loaders: [
        { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
        { test: /\.ts$/, loader: 'awesome-typescript-loader' }
      ]
    }
  }
};
