/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var MergedStream = require('./_MergedStream');
    var LiftedStream = require('./_LiftedStream');
    var EventHandler = require('../events/EventHandler');
    var SimpleStream = require('../streams/SimpleStream');

    var preTickQueue = require('../core/queues/preTickQueue');
    var postTickQueue = require('../core/queues/postTickQueue');
    var dirtyQueue = require('../core/queues/dirtyQueue');

    var EVENTS = {
        START : 'start',
        UPDATE : 'update',
        END : 'end'
    };

    /**
     * Stream listens to `start`, `update` and `end` events and
     *  emits `start`, `update` and `end` events.
     *
     *  If listening to multiple sources, Stream emits a single event per
     *  Engine cycle.
     *
     *  @example
     *
     *      var position = new Transitionable([0,0]);
     *      var size = new EventEmitter();
     *
     *      var translationStream = Stream.lift(function(position, size){
     *          var translation = [
     *              position[0] + size[0],
     *              position[1] + size[1]
     *          ];
     *
     *          return Transform.translate(translation);
     *      }, [positionStream, sizeStream]);
     *
     *      translationStream.on('start', function(transform){
     *          console.log(transform);
     *      });
     *
     *      translationStream.on('update', function(transform){
     *          console.log(transform);
     *      });
     *
     *      translationStream.on('end', function(transform){
     *          console.log(transform);
     *      });
     *
     *      position.set([100, 50], {duration : 500});
     *
     * @class Stream
     * @extends Streams.SimpleStream
     * @namespace Streams
     * @param [options] {Object}            Options
     * @param [options.start] {Function}    Custom logic to map the `start` event
     * @param [options.update] {Function}   Custom logic to map the `update` event
     * @param [options.end] {Function}      Custom logic to map the `end` event
     * @constructor
     */
    function Stream(options){
        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        var counter = 0;
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
            counter++;
            if (dirtyStart || isUpdating) return false;
            dirtyStart = true;
            preTickQueue.push(start.bind(this, data));
        }.bind(this));

        this._eventInput.on(EVENTS.UPDATE, function(data){
            isUpdating = true;
            if (dirtyUpdate) return false;
            dirtyUpdate = true;
            postTickQueue.push(update.bind(this, data));
        }.bind(this));

        this._eventInput.on(EVENTS.END, function(data){
            counter--;
            // if (isUpdating && counter > 0){
            //     update.call(this, data);
            //     return;
            // }
            isUpdating = false;
            if (dirtyEnd) return;
            dirtyEnd = true;
            dirtyQueue.push(end.bind(this, data));
        }.bind(this));
    }

    Stream.prototype = Object.create(SimpleStream.prototype);
    Stream.prototype.constructor = Stream;

    /**
     * Batches events for provided object of streams in
     *  {key : stream} pairs. Emits one event per Engine cycle.
     *
     * @method merge
     * @static
     * @param streams {Object}  Dictionary of `resize` streams
     */
    Stream.merge = function(streams) {
        return new MergedStream(streams);
    };

    /**
     * Lift is like map, except it maps several event sources,
     *  not only one.
     *
     *  @example
     *
     *      var liftedStream = Stream.lift(function(payload1, payload2){
     *          return payload1 + payload2;
     *      }, [stream2, stream2]);
     *
     *      liftedStream.on('name'), function(data){
     *          // data = 3;
     *      });
     *
     *      stream2.emit('name', 1);
     *      stream2.emit('name', 2);
     *
     * @method lift
     * @static
     * @param map {Function}            Function to map stream payloads
     * @param streams {Array|Object}    Stream sources
     */
    Stream.lift = function(maps, streams){
        return new LiftedStream(maps, new MergedStream(streams));
    };

    module.exports = Stream;
});
