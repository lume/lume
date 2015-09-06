require('babelify/polyfill');

import log from './util/log';
import rafLoop from './rafLoop';

rafLoop.start();

// global export? :)
window.rafLoop = rafLoop;
window.log = log;
