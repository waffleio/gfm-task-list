const DefinePlugin = require('webpack/lib/DefinePlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const path = require('path');

module.exports = function(config) {
  config.set({
    autoWatch: true,

    basePath: '.',

    browsers: ['Chrome'],

    colors: true,

    concurrency: Infinity,

    exclude: [],

    files: [
      'spec/**/*.ts'
    ],

    frameworks: ['mocha', 'chai', 'sinon'],

    logLevel: config.LOG_INFO,

    plugins: [
      require("karma-chai"),
      require("karma-chrome-launcher"),
      require("karma-phantomjs-launcher"),
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
          {
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
            query: {
              useBabel: true,
              useCache: true,
              cacheDirectory: path.resolve('./.cache')
            }
          }
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
  });
}
