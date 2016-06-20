module.exports = function(config) {
  const configuration = {
    autoWatch: true,

    basePath: '..',

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
      noInfo: true
    }
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_Travis_CI'];
  }

  config.set(configuration);
}
