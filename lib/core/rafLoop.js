/*
 * The requestAnimationFrame loop
 *
 * This tries to run once per frame in the UI thread.  Calling
 * `rafLoop.onNextTick()` will queue a function to be run on
 * the next frame.  If, while dequeuing callbacks, we exceed
 * a prespecified "threshold", we'll stop and continue on the
 * next frame, to make sure we don't fall behind / jitter.
 * We log.debug every time we pass the threshold (DONE) and every
 * time we miss a frame (TODO).
 *
 */

import SinglyLinkedList from '../util/SinglyLinkedList';

//var requestFrame = require('request-frame');
import raf from '../util/raf-polyfill';
import log from '../util/log';

// Singleton, no need for class instantiation here
let rafLoop = {

  FPS: ( 1000 / 60 ),

  /**
   * The "threshold", in ms, that if we exceed we'll break the loop
   */
  THRESHOLD: ( 1000 / 60 ) * 0.75,  // 75% of 1/60th of a second, assuming 60fps,

  /**
   * Starts the loop.  Run once at start of your app.
   */
  start: function() {
    raf.requestAnimationFrame(rafLoop._runTick);
  },

  _queue: SinglyLinkedList(),      // for upcoming tick
  _nextQueue: SinglyLinkedList(),  // for tick after that

  _inTick: false,                  // true during _runTick
  _currentTimeStamp: null,         // last value from rAf
  _exceedCount: 0,

  /**
   * True is we're below the threshold.
   */
  timeOk: function() {
    return performance.now() - this._currentTimeStamp < this.THRESHOLD;
  },

  /**
   * For devel use.  Block the thread totally for at least `time` ms.
   */
  blockFor(time) {
    var now = performance.now();
    while (performance.now() - now < time);
  },

  /**
   * Queues a function, context and data to be called on the next tick.  It
   * will also be called with the DOMHighResTimeStamp for that frame.
   *
   * @param {function} - the function (callback) to be called - avoid anonymous
   * @param {object} - the context (`this`) for that function
   * @param {object} - data the function should be called with
   */
  onNextTick: function(func, context, data) {
    // re-use `arguments` to avoid creation of new array
    (this._inTick ? this._nextQueue : this._queue).push(arguments);
  },

  // called without context, don't use `this`, use `rafLoop` singleton
  // (apparently bind has performance issues)
  _runTick: function(timestamp) {
    var current, data, completed = true;

    // Short circuit if the queue is empty
    if (rafLoop._queue.head) {

      // so if any functions call onNextTick, we'll queue them in nextQueue
      rafLoop._inTick = true;
      rafLoop._currentTimeStamp = timestamp;

      /*
       * KEEP BAREBONES.  This is the code that is run more than anything else
       */
      for (current = rafLoop._queue.head; current; current = current.next) {

        // callback.call(context, data, timestamp);
        current.data[0].call(current.data[1], current.data[2], timestamp);

        // If we exceeded the threshold and didn't complete the queue
        if ( ! rafLoop.timeOk() && current.next ) {
          if (++rafLoop._exceedCount === 30)
            log.debug('Didn\'t complete all updates for 30 frames in a row!');
          rafLoop._queue.recycleUntil(current);
          completed = false;
          break;
        }
      }

      // while (current = queue.getNext())
      //  current[0].call(current[1], current[2], timestamp);

      if (completed) {
        if (rafLoop._exceedCount) {
          log.debug("Didn't complete updates for " + rafLoop._exceedCount + ' consecutive frame(s) until now');
          rafLoop._exceedCount = 0;
        }

        rafLoop._queue.recycle();
        rafLoop._queue = rafLoop._nextQueue;
        rafLoop._nextQueue = SinglyLinkedList();
      }

      rafLoop._inTick = false;
    }

    // queue next tick
    raf.requestAnimationFrame(rafLoop._runTick);
  }

}

export default rafLoop;