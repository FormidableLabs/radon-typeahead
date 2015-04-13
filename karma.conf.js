'use strict';

var path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon-chai'],
    files: [
      'test/helpers/**/*.js',
      'test/spec/**/*.js'
    ],
    preprocessors: {
      'test/spec/**/*.js': ['webpack']
    },
    webpack: {
      cache: true,
      module: {
        loaders: [{
          test: /\.jsx$/,
          loader: 'babel-loader'
        }]
      },
      resolve: {
        root: [path.join(__dirname, '/src')]
      }
    },
    webpackServer: {
      stats: {
        colors: true
      }
    },
    exclude: [],
    port: 8080,
    logLevel: config.LOG_INFO,
    colors: true,
    autoWatch: false,
    browsers: ['PhantomJS'],
    reporters: ['mocha'],
    plugins: [
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-phantomjs-launcher'),
      require('karma-sinon-chai'),
      require('karma-webpack')
    ],
    captureTimeout: 60000,
    singleRun: true
  });
};