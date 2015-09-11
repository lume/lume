/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('samsara/core/EventHandler');
    var SimpleStream = require('samsara/streams/SimpleStream');
    var Stream = require('samsara/streams/Stream');
    var Observable = require('samsara/core/Observable');

    /**
     * Encapsulates a stream of layout specs (transform, origin, align, opacity).
     *  Listens on start/update/end events, batches them, and emits them downstream
     *  to descendant layout nodes.
     *
     * @class LayoutNode
     * @constructor
     * @param sources {Object}  Object size spec
     */

    function LayoutNode(sources) {
        this.stream = _createStream(sources);
        EventHandler.setOutputHandler(this, this.stream);
    }

    /**
     * Introduce new data streams to the layout node in {key : value} pairs.
     *  Here the `key` is one of "transform", "origin", "align" or "opacity".
     *  The `value` is either a stream, or a simple type like a `Number` or `Array`.
     *  Simple types will be wrapped in an `Observerable` to emit appropriate events.
     *
     * @method set
     * @param obj {Object}      Object of data sources
     */
    LayoutNode.prototype.set = function(obj){
        for (var key in obj){
            var value = obj[key];

            var source = (value instanceof SimpleStream)
                ? value
                : new Observable(value);

            this.stream.addStream(key, source);
        }
    };

    function _createStream(sources){
        for (var key in sources){
            var value = sources[key];
            if (typeof value === 'number' || value instanceof Array){
                var source = new Observable(value);
                sources[key] = source;
            }
        }
        return Stream.merge(sources);
    }

    module.exports = LayoutNode;
});
