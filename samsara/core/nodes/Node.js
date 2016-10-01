/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var SimpleStream = require('../../streams/SimpleStream');
    var MergedStream = require('../../streams/_MergedStream');
    var Observable = require('../../streams/Observable');

    /**
     * A wrapper around a merged stream used to define Layout or Size nodes.
     *
     * @class Node
     * @constructor
     * @namespace Core
     * @uses _MergedStream
     * @private
     * @param sources {Object} Object of sources
     */
    function Node(sources) {
        // Wrap source in Observable if necessary
        for (var key in sources) {
            var value = sources[key];
            if (!(value instanceof SimpleStream)) {
                var source = new Observable(value);
                sources[key] = source;
            }
        }

        MergedStream.call(this, sources);
    }

    Node.prototype = Object.create(MergedStream.prototype);
    Node.prototype.constructor = Node;

    /**
     * Introduce new data streams to the layout node in {key : value} pairs.
     *  Here the `key` is a value from one of `SizeNode.KEYS` or `LayoutNode.KEYS`.
     *  The `value` is either a stream, or a simple type like a `Number` or `Array`.
     *  Simple types will be wrapped in an `Observerable` to emit appropriate events.
     *
     * @method set
     * @param sources {Object}      Object of data sources
     */
    Node.prototype.set = function(sources) {
        // TODO: be able to overwrite streams. Not only add
        for (var key in sources) {
            var value = sources[key];

            var source = (value instanceof SimpleStream)
                ? value
                : new Observable(value);

            this.addStream(key, source);
        }
    };

    module.exports = Node;
});
