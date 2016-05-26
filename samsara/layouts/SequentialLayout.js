/* Copyright © 2015-2016 David Valdman */

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
            this.stream = new ReduceStream(function(prev, size) {
                if (!size) return false;
                return prev + size[options.direction] + options.spacing;
            });
            
            this.transformMap = function(length) {
                return (options.direction === CONSTANTS.DIRECTION.X) 
                    ? Transform.translateX(length) 
                    : Transform.translateY(length);
            };
        }, 
        push : function(item) {
            var transform = this.stream.push(item.size).map(this.transformMap);
            this.add({transform : transform}).add(item);
        },
        unshift : function(item){
            var transform = this.stream.unshift(item.size).map(this.transformMap);
            this.add({transform : transform}).add(item);
        },
        remove : function(item) {
            this.stream.remove(item.size);
            item.remove();
        }, 
        insertAfter : function(prevItem, item) {
            var transform = this.stream.insertAfter(prevItem.size, item.size)
                .map(this.transformMap);
            this.add({transform : transform}).add(item);
        },
        insertBefore : function(postItem, item){
            if (!postItem) return;
            var transform = this.stream.insertBefore(postItem.size, item.size)
                .map(this.transformMap);
            this.add({transform : transform}).add(item);
        }
    }, CONSTANTS);
    
    module.exports = SequentialLayout;
}); 
