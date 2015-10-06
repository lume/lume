/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var EventMapper = require('samsara/events/EventMapper');
    var EventFilter = require('samsara/events/EventFilter');
    var EventSplitter = require('samsara/events/EventSplitter');

    /**
     * A SimpleStream wraps an EventHandler and provides convenience
     *  methods of `map`, `filter`, `split`, and `pluck` to
     *  transform one stream into another.
     *
     *
     * @class SimpleStream
     * @extends Core.EventHandler
     * @namespace Streams
     * @constructor
     */
    function SimpleStream(){
        EventHandler.call(this);
    }

    SimpleStream.prototype = Object.create(EventHandler.prototype);
    SimpleStream.prototype.constructor = SimpleStream;

    /**
     * Map converts the current stream into a new stream
     *  with a modified (mapped) data payload.
     *
     * @method map
     * @param mapperFn {Function}   Function to map event payload
     */
    SimpleStream.prototype.map = function(mapperFn){
        var stream = new SimpleStream();
        var mapper = new EventMapper(mapperFn);
        stream.subscribe(mapper).subscribe(this);
        return stream;
    };

    /**
     * Filter converts the current stream into a new stream
     *  that only emits if the filter condition is satisfied.
     *  The function should return a Boolean.
     *
     * @method filter
     * @param filterFn {Function}   Function to filter event payload
     */
    SimpleStream.prototype.filter = function(filterFn){
        var filter = new EventFilter(filterFn);
        var filteredStream = new SimpleStream();
        filteredStream.subscribe(filter).subscribe(this);
        return filteredStream;
    };

    /**
     * Split maps one of several streams based on custom logic.
     *  The function should return an EventEmitter.
     *
     * @method split
     * @param splitterFn {Function}  Splitter function
     */
    SimpleStream.prototype.split = function(splitterFn){
        var splitter = new EventSplitter(splitterFn);
        var splitStream = new SimpleStream();
        splitStream.subscribe(splitter).subscribe(this);
        return splitStream;
    };

    /**
     * Pluck is an opinionated mapper. It projects a Stream
     *  onto one of its return values.
     *
     *  Useful if a Stream returns an array or an object.
     *
     * @method pluck
     * @param key {String|Number}   Key to project event payload onto
     */
    SimpleStream.prototype.pluck = function(key){
        return this.map(function(value){
            return value[key];
        });
    };

    //TODO: can this be inherited by other streams?
    SimpleStream.merge = function(){};

    /**
     * Lift is like map, except it maps several event sources,
     *  not only one.
     *
     *  @example
     *
     *      var liftedStream = SimpleStream.lift(function(payload1, payload2){
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
    SimpleStream.lift = function(map, streams){
        //TODO: fix comma separated arguments
        var mergedStream = (streams instanceof Array)
            ? this.merge(streams)
            : this.merge.apply(null, Array.prototype.splice.call(arguments, 1));

        var mappedStream = new EventMapper(function liftMap(data){
            return map.apply(null, data);
        });

        var liftedStream = new SimpleStream();
        liftedStream.subscribe(mappedStream).subscribe(mergedStream);

        return liftedStream;
    };

    module.exports = SimpleStream;
});
