/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var SimpleStream = require('samsara/streams/SimpleStream');
    var EventMapper = require('samsara/events/EventMapper');
    var EventHandler = require('samsara/core/EventHandler');

    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var postTickQueue = require('samsara/core/queues/postTickQueue');
    var dirtyQueue = require('samsara/core/queues/dirtyQueue');
    var State = require('samsara/core/SUE');

    var EVENTS = {
        RESIZE : 'resize'
    };

    /**
     * ResizeStream is a stream that listens to and emits `resize` events.
     *
     * @class ResizeStream
     * @private
     * @extends Streams.Stream
     * @namespace Streams
     * @constructor
     */
    function ResizeStream(){
        var dirtyResize = false;

        function resize(data){
            this.emit(EVENTS.RESIZE, data);
            dirtyResize = false;
        }

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on(EVENTS.RESIZE, function(data){
            if (!dirtyResize) {
                var queue;
                switch (State.get()){
                    case State.STATES.START:
                        queue = preTickQueue;
                        break;
                    case State.STATES.UPDATE:
                        queue = postTickQueue;
                        break;
                    case State.STATES.END:
                        queue = dirtyQueue;
                        break;
                }
                queue.push(resize.bind(this, data));
            }
            dirtyResize = true;
        }.bind(this));
    }

    ResizeStream.prototype = Object.create(SimpleStream.prototype);
    ResizeStream.prototype.constructor = ResizeStream;

    /**
     * Extends SimpleStream.lift
     *
     * @method lift
     * @static
     * @private
     */
    ResizeStream.lift = SimpleStream.lift;

    /**
     * Batches resize events for provided object of streams in
     *  {key : stream} pairs. Emits one `resize` event per Engine cycle.
     *
     * @method merge
     * @static
     * @private
     * @param streams {Object}  Dictionary of `resize` streams
     */
    ResizeStream.merge = function(streams){
        var mergedStream = new ResizeStream();
        var mergedData = (streams instanceof Array) ? [] : {};

        mergedStream.addStream = function(key, stream){
            var mapper = (function(key){
                return new EventMapper(function(data){
                    mergedData[key] = data;
                    return mergedData;
                });
            })(key);

            mergedStream.subscribe(mapper).subscribe(stream);
        };

        for (var key in streams){
            var stream = streams[key];
            mergedStream.addStream(key, stream);
        }

        return mergedStream;
    };

    module.exports = ResizeStream;
});
