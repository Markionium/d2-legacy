module.exports = function( config ) {
  config.set({
    basePath: '../src',
    frameworks: ['jasmine'],

    preprocessors: {
      'common/**/*.html': 'html2js'
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,

    autoWatch: true,
    autoWatchBatchDelay: 100,
    usePolling: true,

    browsers: ['PhantomJS'],
    singleRun: true
  });
};
