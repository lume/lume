/* global module */
module.exports = function (config) {
    'use strict';
    config.set({
        autoWatch: false,
        singleRun: true,

        frameworks: ['jspm', 'jasmine'],

		files: [
			'node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js'
		],

        jspm: {
            config: 'src/config.js',
            loadFiles: [
             //   'src/**/*.perf.js',
                'perf/*.js'
            ],
            serveFiles: [
                'src/**/!(*perf).js'
            ]
        },

        proxies: {
            '/base': '/base/src'
        },

        browsers: [ /* 'PhantomJS' ,*/ 'Chrome' ],

        reporters: ['progress', /* 'junit' */, 'html'],

        junitReporter: {
          suite: '',
          outputDir: 'benchmarks'
        },

        htmlReporter: {
          outputFile: 'benchmarks/index.html',
          pageTitle: 'famin.js benchmarks',
          subPageTitle: 'Replace this file with saucelabs output for releases'
        }

    });

    function normalizationBrowserName(browser) {
        return browser.toLowerCase().split(/[ /-]/)[0];
    }

};
