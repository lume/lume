/* Copyright © 2015-2016 David Valdman */
// TODO: allow spacing to be a stream
define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var View = require('../core/View');
    var ReduceStream = require('../streams/ReduceStream');

    var CONSTANTS = {
        DIRECTION : {
            X : 0, 
            Y : 1
        }
    };

    // Default map to convert displacement to transform
    var DEFAULT_LENGTH_MAP = function(length){
        return (this.options.direction === CONSTANTS.DIRECTION.X)
            ? Transform.translateX(length)
            : Transform.translateY(length);
    };

    /**
     * A layout which arranges items in series based on their size.
     *  Items can be arranged vertically or horizontally.
     *
     * @class SequentialLayout
     * @constructor
     * @namespace Layouts
     * @extends Core.View
     * @param [options] {Object}                        Options
     * @param [options.direction]{Number}               Direction to lay out items
     * @param [options.spacing] {Transitionable|Number} Gutter spacing between items
     */
    var SequentialLayout = View.extend({
        defaults : {
            direction : CONSTANTS.DIRECTION.X,
            spacing : 0
        }, 
        initialize : function initialize(options) {
            if (typeof options.spacing === 'number'){
                this.stream = new ReduceStream(function(prev, size){
                    if (!size) return false;
                    return prev + size[options.direction] + options.spacing;
                }.bind(this));
            }
            else {
                this.stream = new ReduceStream(function(prev, size, spacing){
                    if (!size) return false;
                    return prev + size[options.direction] + spacing;
                }, undefined, options.spacing);
            }

            this.setLengthMap(DEFAULT_LENGTH_MAP);
            
            this.output.subscribe(this.stream.headOutput);
        },
        /*
        * Set a custom map from length displacements to transforms.
        * `this` will automatically be bound to the instance.
        *
        * @method setLengthMap
        * @param map [Function] Map `(length) -> transform`
        */
        setLengthMap : function(map){
            this.transformMap = map.bind(this);
        },
        /*
         * Set a custom map from length displacements to transforms.
         * Within the map function, `this` will automatically be bound to the instance.
         *
         * @method push
         * @param map [Function] Map `(length) -> transform`
         */
        push : function(item) {
            var length = this.stream.push(item.size);
            var transform = length.map(this.transformMap);
            this.add({transform : transform}).add(item);
        },
        /*
         * Add a renderable to the beginning of the layout
         *
         * @method unshift
         * @param item {Surface|View} Renderable
         */
        unshift : function(item){
            var length = this.stream.unshift(item.size);
            var transform = length.map(this.transformMap);
            this.add({transform : transform}).add(item);
        },
        /*
         * Add a renderable after a specified renderable
         *
         * @method insertAfter
         * @param prevItem {Surface|View} Renderable to insert after
         * @param item {Surface|View}     Renderable to insert
         */
        insertAfter : function(prevItem, item) {
            if (!prevItem) return this.push(item);
            var length = this.stream.insertAfter(prevItem.size, item.size);
            var transform = length.map(this.transformMap);
            this.add({transform : transform}).add(item);
        },
        /*
         * Add a renderable before a specified renderable
         *
         * @method insertAfter
         * @param prevItem {Surface|View} Renderable to insert before
         * @param item {Surface|View}     Renderable to insert
         */
        insertBefore : function(postItem, item){
            if (!postItem) return this.unshift(item);
            var length = this.stream.insertBefore(postItem.size, item.size);
            var transform = length.map(this.transformMap);
            this.add({transform : transform}).add(item);
        },
        /*
         * Remove a renderable
         *
         * @method removeItem
         * @param item {Surface|View} Item to remove
         */
        removeItem : function(item){
            if (!item || !item.size) return;
            this.stream.remove(item.size);
            item.remove();
        }
    }, CONSTANTS);

    module.exports = SequentialLayout;
}); 
