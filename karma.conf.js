// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-spec-reporter'),
      //require('karma-phantomjs-launcher'),
      require('karma-junit-reporter')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      
    ],
    preprocessors: {
      
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },
    junitReported: {
      outputDir: '', // results will be saved as $outputDir/$browserName.xml
      outputFile: 'test.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
    },
    angularCli: {
      environment: 'dev'
    },
    // reporters: config.angularCli && config.angularCli.codeCoverage
    //           ? ['spec', 'coverage-istanbul']
    //           : ['spec'],
    reporters: config.angularCli && config.angularCli.codeCoverage
      ? ['progress', 'coverage-istanbul', 'junit']
      : ['progress', 'kjhtml', 'junit'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--remote-debugging-port=9222',
        ]
      }
    },
    browsers: ['Chrome', 'ChromeHeadless'],
    singleRun: false,
    sourcemaps: false,
    browserNoActivityTimeout: 60000, //default 10000
    browserDisconnectTimeout: 10000, // default 2000
    browserDisconnectTolerance: 1, // default 0
    captureTimeout: 60000
  });
};
