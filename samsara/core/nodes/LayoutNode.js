/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var MergedStream = require('../../streams/_MergedStream');

    /**
     * Encapsulates a stream of layout data (transform, origin, align, opacity).
     *  Listens on start/update/end events, batches them, and emits them downstream
     *  to descendant layout nodes.
     *
     *  @example
     *
     *      var context = Context();
     *
     *      var surface = new Surface({
     *          size : [100,100],
     *          properties : {background : 'red'}
     *      });
     *
     *      var opacity = new Transitionable(1);
     *
     *      var layout = new LayoutNode({
     *          transform : Transform.translateX(100),
     *          opacity : opacity
     *      });
     *
     *      context.add(layout).add(surface);
     *      context.mount(document.body)
     *
     *      opacity.set(0, {duration : 1000});
     *
     * @class LayoutNode
     * @constructor
     * @namespace Core
     * @private
     * @param sources {Object}                          Object of layout sources
     * @param [sources.transform] {Stream|Transform}    Transform source
     * @param [sources.align] {Stream|Array}            Align source
     * @param [sources.origin] {Stream|Array}           Origin source
     * @param [sources.opacity] {Stream|Number}         Opacity source
     */
    function LayoutNode(sources) {
        MergedStream.call(this, sources);
    }

    LayoutNode.prototype = Object.create(MergedStream.prototype);
    LayoutNode.prototype.constructor = LayoutNode;

    // Enumeration of types of layout properties
    LayoutNode.KEYS = {
        transform : true,
        origin : true,
        align : true,
        opacity : true
    };

    module.exports = LayoutNode;
});
