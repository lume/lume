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
     * @param mapperFn {Function}    Function to map event payload
     * @return stream {SimpleStream} Mapped stream
     */
    SimpleStream.prototype.map = function map(mapperFn){
        var stream = new SimpleStream();
        var mapper = new EventMapper(mapperFn);
        stream.subscribe(mapper).subscribe(this);
        return stream;
    };

    /**
     * Filter converts the current stream into a new stream
     *  that only emits if the filter condition is satisfied.
     *  The filter function should return a Boolean value.
     *
     * @method filter
     * @param filterFn {Function}    Function to filter event payload
     * @return stream {SimpleStream} Filtered stream
     */
    SimpleStream.prototype.filter = function filter(filterFn){
        var filter = new EventFilter(filterFn);
        var filteredStream = new SimpleStream();
        filteredStream.subscribe(filter).subscribe(this);
        return filteredStream;
    };

    /**
     * Split maps one of several streams based on custom logic.
     *  The splitter function should return an EventEmitter type.
     *
     * @method split
     * @param splitterFn {Function}  Splitter function
     */
    SimpleStream.prototype.split = function split(splitterFn){
        var splitter = new EventSplitter(splitterFn);
        splitter.subscribe(this);
    };

    /**
     * Pluck is an opinionated mapper. It projects a Stream
     *  onto one of its return values.
     *
     *  Useful if a Stream returns an array or object.
     *
     * @method pluck
     * @param key {String|Number}    Key to project event payload onto
     * @return stream {SimpleStream} Plucked stream
     */
    SimpleStream.prototype.pluck = function pluck(key){
        return this.map(function(value){
            return value[key];
        });
    };
    
    module.exports = SimpleStream;
});
