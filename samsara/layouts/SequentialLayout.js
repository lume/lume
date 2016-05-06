/* Copyright © 2015-2016 David Valdman */
define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var View = require('../core/View');
    var SizeArray = require('../streams/SizeArray');

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
            this.stream = new SizeArray(function(prev, size) {
                return prev + size[options.direction] + options.spacing;
            });
            
            this.transformMap = function(length) {
                return (options.direction === CONSTANTS.DIRECTION.X) ? Transform.translateX(length) : Transform.translateY(length);
            };
        }, 
        addItem : function(item) {
            var transform = this.stream.addStream(item.size).map(this.transformMap);
            this.add({transform : transform}).add(item);
        }, 
        removeItem : function(item) {
            this.stream.removeStream(item.size);
            item.remove();
        }, 
        insertAfter : function(prevItem, item) {
            var transform = this.stream.insertAfterStream(prevItem.size, item.size)
                .map(this.transformMap);
            this.add({transform : transform}).add(item);
        }
    }, CONSTANTS);
    
    module.exports = SequentialLayout;
}); 
