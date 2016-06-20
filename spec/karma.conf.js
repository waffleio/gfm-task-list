module.exports = function(config) {
  config.set({
    autoWatch: true,

    basePath: '..',

    browsers: ['Chrome'],

    colors: true,

    concurrency: Infinity,

    exclude: [],

    files: [
      'spec/spec-helper.ts',
      'spec/**/*spec.ts'
    ],

    frameworks: ['mocha'],

    logLevel: config.LOG_INFO,

    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-spec-reporter"),
      require("karma-chrome-launcher")
    ],

    port: 9876,

    preprocessors: {
      'spec/**/*.ts': ['webpack']
    },

    reporters: ['dots'],

    singleRun: false,

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
    },

    webpackMiddleware: {
        // webpack-dev-middleware configuration
        // i. e.
        noInfo: true
    }
  });
}
