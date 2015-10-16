/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var SimpleStream = require('samsara/streams/SimpleStream');
    var ResizeStream = require('samsara/streams/ResizeStream');
    var SizeObservable = require('samsara/streams/SizeObservable');

    /**
     * Encapsulates a stream of size data (size, proportions, margins).
     *  Listens on start/update/end events, batches them, and emits resize events downstream
     *  to descendant size nodes.
     *
     * @class SizeNode
     * @namespace Core
     * @constructor
     * @param sources {Object}                      Object of size sources
     * @param [sources.size] {Stream|Array}         Size source
     * @param [sources.margin] {Stream|Array}       Margin source
     * @param [sources.proportions] {Stream|Array}  Proportions source
     * @param [sources.aspectRatio] {Stream|Number} Aspect ratio source
     */
    function SizeNode(sources) {
        this.stream = _createStream(sources);
        EventHandler.setOutputHandler(this, this.stream);

        this.stream._eventInput.on('start', function(data){
            this.stream.trigger('resize', data);
        }.bind(this));

        this.stream._eventInput.on('update', function(data){
            this.stream.trigger('resize', data);
        }.bind(this));

        this.stream._eventInput.on('end', function(data){
            this.stream.trigger('resize', data);
        }.bind(this));
    }

    /**
     * Introduce new data streams to the size node in {key : value} pairs.
     *  Here the `key` is one of "size", "proportions" or "marins".
     *  The `value` is either a stream, or a simple type like a `Number` or `Array`.
     *  Simple types will be wrapped in an `Observerable` to emit appropriate events.
     *
     * @method set
     * @param obj {Object}      Object of data sources
     */
    SizeNode.prototype.set = function(obj){
        // TODO: be able to overwrite streams. Not only add
        for (var key in obj){
            var value = obj[key];

            var source = (value instanceof SimpleStream)
                ? value
                : new SizeObservable(value);

            this.stream.addStream(key, source);
        }
    };

    function _createStream(sources){
        for (var key in sources){
            var value = sources[key];
            if (typeof value == 'number' || value instanceof Array){
                var source = new SizeObservable(value);
                sources[key] = source;
            }
        }
        return ResizeStream.merge(sources);
    }

    module.exports = SizeNode;
});
