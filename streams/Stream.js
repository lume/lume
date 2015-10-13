/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var EventMapper = require('samsara/events/EventMapper');
    var SimpleStream = require('samsara/streams/SimpleStream');

    var preTickQueue = require('samsara/core/queues/preTickQueue');
    var postTickQueue = require('samsara/core/queues/postTickQueue');
    var dirtyQueue = require('samsara/core/queues/dirtyQueue');
    var State = require('samsara/core/SUE');

    var EVENTS = {
        START : 'start',
        UPDATE : 'update',
        END : 'end',
        RESIZE : 'resize'
    };

    /**
     * Stream listens to `resize`, `start`, `update` and `end` events and
     *  emits `start`, `update` and `end` events.
     *
     *  If listening to multiple sources, Stream emits a single event per
     *  Engine cycle.
     *
     * @class Stream
     * @extends Streams.SimpleStream
     * @namespace Streams
     * @constructor
     */
    function Stream(options){
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        var isUpdating = false;
        var dirtyStart = false;
        var dirtyUpdate = false;
        var dirtyEnd = false;

        function start(data){
            var payload = options && options.start ? options.start(data) : data;
            if (payload !== false) this.emit(EVENTS.START, payload);
            dirtyStart = false;
        }

        function update(data){
            var payload = options && options.update ? options.update(data) : data;
            if (payload !== false) this.emit(EVENTS.UPDATE, payload);
            dirtyUpdate = false;
        }

        function end(data){
            var payload = options && options.end ? options.end(data) : data;
            if (payload !== false) this.emit(EVENTS.END, payload);
            dirtyEnd = false;
        }

        this._eventInput.on(EVENTS.START, function(data){
            if (dirtyStart || isUpdating) return;
            dirtyStart = true;
            preTickQueue.push(start.bind(this, data));
        }.bind(this));

        this._eventInput.on(EVENTS.UPDATE, function(data){
            if (dirtyUpdate) return;
            dirtyUpdate = true;
            isUpdating = true;
            postTickQueue.push(update.bind(this, data));
        }.bind(this));

        this._eventInput.on(EVENTS.END, function(data){
            if (dirtyEnd) return;
            dirtyEnd = true;
            isUpdating = false;
            dirtyQueue.push(end.bind(this, data));
        }.bind(this));

        this._eventInput.on(EVENTS.RESIZE, function(data){
            switch (State.get()){
                case State.STATES.START:
                    this.trigger(EVENTS.START, data);
                    break;
                case State.STATES.UPDATE:
                    this.trigger(EVENTS.UPDATE, data);
                    break;
                case State.STATES.END:
                    this.trigger(EVENTS.END, data);
                    break;
            }
        }.bind(this));
    }

    Stream.prototype = Object.create(SimpleStream.prototype);
    Stream.prototype.constructor = Stream;

    /**
     * Extends SimpleStream.lift
     *
     * @static
     * @return
     */
    Stream.lift = SimpleStream.lift;

    /**
     * Batches events for provided object of streams in
     *  {key : stream} pairs. Emits one event per Engine cycle.
     *
     * @method merge
     * @static
     * @param streams {Object}  Dictionary of `resize` streams
     */
    Stream.merge = function(streamObj){
        var mergedStream = new Stream();
        var mergedData = (streamObj instanceof Array) ? [] : {};

        mergedStream.addStream = function(key, stream){
            var mapper = (function(key){
                return new EventMapper(function(data){
                    mergedData[key] = data;
                    return mergedData;
                });
            })(key);

            mergedStream.subscribe(mapper).subscribe(stream);
        };

        for (var key in streamObj){
            var stream = streamObj[key];
            mergedStream.addStream(key, stream);
        }

        return mergedStream;
    };

    module.exports = Stream;
});
