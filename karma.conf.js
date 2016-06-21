const DefinePlugin = require('webpack/lib/DefinePlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const path = require('path');

module.exports = function(config) {
  const configuration = {
    autoWatch: true,

    basePath: '.',

    browsers: ['Chrome'],

    colors: true,

    concurrency: Infinity,

    customLaunchers: {
      Chrome_Travis_CI: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    exclude: [],

    files: [
      'spec/**/*.ts'
    ],

    frameworks: ['mocha', 'chai', 'sinon'],

    logLevel: config.LOG_INFO,

    plugins: [
      require("karma-chai"),
      require("karma-chrome-launcher"),
      require("karma-mocha"),
      require("karma-sinon"),
      require("karma-spec-reporter"),
      require("karma-webpack")
    ],

    port: 9876,

    preprocessors: {
      'spec/**/*.ts': ['webpack']
    },

    reporters: ['dots'],

    singleRun: false,

    webpack: {
      output: {},
      resolve: {
        extensions: ["", ".js", ".ts", ".d.ts"]
      },
      module: {
        loaders: [
          { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
          { test: /\.ts$/, loader: 'awesome-typescript-loader' }
        ]
      },
      plugins: [
        new DefinePlugin({ GH_ACCESS_TOKEN: JSON.stringify(process.env.GH_ACCESS_TOKEN) }),
        new ProvidePlugin({ $: 'jquery' })
      ]
    },

    webpackMiddleware: {
      noInfo: true
    }
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_Travis_CI'];
  }

  config.set(configuration);
}
