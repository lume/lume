//var requestFrame = require('request-frame');
//import raf from '../util/raf-polyfill';
import FrameLoop from '../core/FrameLoop';

/*
 * Since this will only ever be a single instance, and it's high traffic,
 * let's avoid the cost of true inheritance
 */

var rafLoop = {};

for (var key in FrameLoop.prototype)
  rafLoop[key] = FrameLoop.prototype[key];

FrameLoop.apply(rafLoop);

rafLoop.queueFrame = function() {
  window.requestAnimationFrame(this.stepAndQueue);
};

export default rafLoop;