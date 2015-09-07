/* global module */
module.exports = function (config) {
    'use strict';
    config.set({
        autoWatch: true,
        singleRun: true,

        frameworks: ['jspm', 'jasmine'],

		files: [
			'node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js'
		],

        jspm: {
            config: 'src/config.js',
            loadFiles: [
                'src/**/*.spec.js'
            ],
            serveFiles: [
                'src/**/!(*spec).js'
            ]
        },

        proxies: {
            '/base': '/base/src'
        },

        browsers: ['PhantomJS' /*, 'Chrome' */],

        reporters: ['progress', 'coverage'],

        preprocessors: {
            'src/!(*spec).js': ['babel', 'sourcemap', 'coverage']
        },

        babelPreprocessor: {
            options: {
                sourceMap: 'inline',
                blacklist: ['useStrict']
            },
            sourceFileName: function(file) {
                return file.originalPath;
            }
        },

        coverageReporter: {
            instrumenters: {isparta: require('isparta')},
            instrumenter: {
                'src/**/.js': 'isparta'
            },

            reporters: [
                {
                    type: 'text-summary',
                    subdir: normalizationBrowserName
                },
                {
                    type: 'html',
                    dir: 'coverage/',
                    subdir: normalizationBrowserName
                }
            ]
        }

    });

    function normalizationBrowserName(browser) {
        return browser.toLowerCase().split(/[ /-]/)[0];
    }

};
