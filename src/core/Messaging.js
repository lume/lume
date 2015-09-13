import Event from '../util/Event';
import log from '../util/log';

var Messaging = {

  /*
   * Here it's unavoidable to use an array, which is ultimately handed
   * over intact to the target thread, which take measures to limit
   * garbage collection.
   */
  _queue: new Array(50),

  // And this one doesn't change much.
  _receivers: [],

  toUI: function(/* arguments */) {
    var i = 0, len = arguments.length;
    this._queue.push(len);
    while (i < len)
      this._queue.push(arguments[i++]);
  },

  flush: function() {
    // just for now :)
    this.receive(this._queue);
    this._queue = [];
  },

  // currently only on receiver allowed
  on: function(event, callback) {
    this._receivers[event] = callback;
  },

  receive: function(queue) {
    var i = 0, len = queue.length;
    while (i < len) {
      let argCount = queue[i++];
      let command = queue[i++];
      let j = 1, args = [];
      while (j++ < argCount)
        args.push(queue[i++]);

      let dest = this._receivers[command];

      log.trace(Event[command], args);

      if (dest) {
        if (dest instanceof Array)
          dest[0].apply(dest[1], args);
        else
          dest.apply(null, args);
      }
    }
  }

};

export default Messaging;