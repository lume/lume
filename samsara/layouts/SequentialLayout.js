/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var View = require('../core/View');
    var Stream = require('../streams/Stream');

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
        initialize : function initialize(){},
        /**
         * Add content as an array of Views or Surfaces.
         *
         * @method addItems
         * @param items {Array}  An array of Views or Surfaces
         */
        addItems : function addItems(items){
            var sizes = [];
            for (var i = 0; i < items.length; i++)
                sizes.push(items[i].size);

            var stream = Stream.lift(function(){
                var sizes = arguments;
                var direction = this.options.direction;
                var transforms = [];

                var length = 0;
                for (var i = 0; i < sizes.length; i++){
                    var size = sizes[i];

                    var transform = direction === CONSTANTS.DIRECTION.X
                        ? Transform.translateX(length)
                        : Transform.translateY(length);

                    transforms.push(transform);

                    length += size[direction] + this.options.spacing;
                }

                return {
                    transforms : transforms,
                    length: length
                };
            }.bind(this), sizes);

            var transforms = stream.pluck('transforms');
            var length = stream.pluck('length');

            this.output.subscribe(length);

            for (var i = 0; i < items.length; i++){
                var node = items[i];
                var transform = transforms.pluck(i);
                this.add({transform : transform}).add(node);
            }
        }
    }, CONSTANTS);

    module.exports = SequentialLayout;
});
