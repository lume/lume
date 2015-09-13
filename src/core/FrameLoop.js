/*
 * The requestAnimationFrame loop
 *
 * This tries to run once per frame in the UI thread.  Calling
 * `this.onNextTick()` will queue a function to be run on
 * the next frame.  If, while dequeuing callbacks, we exceed
 * a prespecified "threshold", we'll stop and continue on the
 * next frame, to make sure we don't fall behind / jitter.
 * We log.debug every time we pass the threshold (DONE) and every
 * time we miss a frame (TODO).
 *
 */

import SinglyLinkedList from '../util/SinglyLinkedList';
import log from '../util/log';

class FrameLoop {

  constructor(options) {
    if (!options) options = {};

    this._FPS = 60;
    this._FRAME_DURATION = 1000 / this._FPS;
    this._THRESHOLD = this._FRAME_DURATION * 0.6;  // browser overhead

    this._queue = SinglyLinkedList();      // for upcoming tick
    this._nextQueue = SinglyLinkedList();  // for tick after that

    this._started = false;
    this._inTick = false;                  // true during step()
    this._exceedCount = 0;
    this._currentFrame = 0;

    // Believe it or not, bind() isn't performant (see CONTRIBUTING.md)
    var self = this;
    this.stepAndQueue = function() {
      self.step();
      if (self.onFinish) self.onFinish();
      self.queueFrame();
    }
  }

  queueFrame() {
    window.setTimeout(this.stepAndQueue,
      this._FRAME_DURATION - (this._lastFrameEnd - this._lastFrameStart));
  }

  start() {
    if (this._started)
      throw new Error("FrameLoop already started", this);
    this._started = false;
    this.queueFrame();
  }

  /**
   * True is we're below the threshold.
   */
  timeOk() {
    return performance.now() - this._lastFrameStart < this._THRESHOLD;
  }

  /**
   * For devel use.  Block the thread totally for at least `time` ms.
   */
  blockFor(time) {
    var now = performance.now();
    while (performance.now() - now < time);
  }

  /**
   * Queues a function, context and data to be called on the next tick.  It
   * will also be called with the DOMHighResTimeStamp for that frame.
   *
   * @param {function} - the function (callback) to be called - avoid anonymous
   * @param {object} - the context (`this`) for that function
   * @param {object} - data the function should be called with
   */
  onNextTick(func, context, data) {
    // re-use `arguments` to avoid creation of new array
    (this._inTick ? this._nextQueue : this._queue).push(arguments);
  }

  step(timestamp) {
    var current, data, completed = true;
    this._lastFrameStart = timestamp || performance.now();
    var finishThreshold = this._lastFrameStart + this._THRESHOLD;

    this._currentFrame++;

    // Short circuit if the queue is empty
    if (this._queue.head) {

      // so if any functions call onNextTick, we'll queue them in nextQueue
      this._inTick = true;

      /*
       * KEEP BAREBONES.  This is the code that is run more than anything else
       */
      for (current = this._queue.head; current; current = current.next) {

        // callback.call(context, data, timestamp);
        current.data[0].call(current.data[1], current.data[2],
          this._lastFrameStart);

        // If we exceeded the threshold and didn't complete the queue
        if ( performance.now() > finishThreshold && current.next ) {
          if (++this._exceedCount === 30)
            log.debug('Didn\'t complete all updates for 30 frames in a row!');
          this._queue.recycleUntil(current);
          completed = false;
          break;
        }

      }

      if (completed) {
        if (this._exceedCount) {
          log.debug("Didn't complete updates for " + this._exceedCount + ' consecutive frame(s) until now');
          this._exceedCount = 0;
        }

        this._queue.recycle();
        this._queue = this._nextQueue;
        this._nextQueue = SinglyLinkedList();
      }

      this._inTick = false;

    }

    this._lastFrameEnd = performance.now();
  }

}

export default FrameLoop;