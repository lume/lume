//var requestFrame = require('request-frame');
//import raf from '../util/raf-polyfill';
import FrameLoop from '../core/FrameLoop';

class RafLoop extends FrameLoop {

  queueFrame() {
    window.requestAnimationFrame(this.stepAndQueue);
  }

}

var rafLoop = new RafLoop();

export default rafLoop;