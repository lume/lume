/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('../events/EventHandler');
    var EventMapper = require('../events/EventMapper');
    var EventFilter = require('../events/EventFilter');
    var EventSplitter = require('../events/EventSplitter');

    /**
     * A SimpleStream wraps an EventHandler and provides convenience
     *  methods of `map`, `filter`, `split`, and `pluck` to
     *  transform one stream into another.
     *
     * @example
     *
     * @class SimpleStream
     * @extends Core.EventHandler
     * @private
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
    
    module.exports = SimpleStream;
});
