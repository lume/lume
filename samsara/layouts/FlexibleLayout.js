/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var View = require('../core/View');
    var Stream = require('../streams/Stream');

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    /**
     * A layout which arranges items vertically or horizontally and
     *  with sizes prescribed by ratios of a containing size. These
     *  ratios can be animated.
     *
     * @class FlexibleLayout
     * @constructor
     * @namespace Layouts
     * @extends Core.View
     * @param [options] {Object}                        Options
     * @param [options.direction]{Number}               Direction to lay out items
     * @param [options.ratios] {Transitionable|Array}   The proportions
     */
    var FlexibleLayout = View.extend({
        defaults : {
            direction : CONSTANTS.DIRECTION.X,
            ratios : []
        },
        initialize : function initialize(options){
            var ratios = (options.ratios instanceof Transitionable)
                ? options.ratios
                : new Transitionable(options.ratios);

            this.nodes = [];

            var stateStream = Stream.lift(function(ratios, parentSize){
                var direction = options.direction;

                // calculate remaining size after true-sized nodes are accounted for
                var flexLength = parentSize[direction];
                var ratioSum = 0;
                for (var i = 0; i < ratios.length; i++) {
                    var ratio = ratios[i];
                    var node = this.nodes[i];

                    (typeof ratio !== 'number')
                        ? flexLength -= node.getSize()[direction] || 0
                        : ratioSum += ratio;
                }

                // calculate sizes and displacements of nodes
                var displacement = 0;
                var transforms = [];
                var sizes = [];
                for (var i = 0; i < ratios.length; i++) {
                    node = this.nodes[i];
                    ratio = ratios[i];

                    var nodeLength = (typeof ratio === 'number')
                        ? flexLength * ratio / ratioSum
                        : node.getSize()[direction];

                    var transform = (direction == CONSTANTS.DIRECTION.X)
                        ? Transform.translateX(displacement)
                        : Transform.translateY(displacement);

                    var size = (direction == CONSTANTS.DIRECTION.X)
                        ? [nodeLength, undefined]
                        : [undefined, nodeLength];

                    sizes.push(size);
                    transforms.push(transform);

                    displacement += nodeLength;
                }

                return {
                    transforms : transforms,
                    sizes : sizes
                };

            }.bind(this), [ratios, this.size]);

            this.transforms = stateStream.pluck('transforms');
            this.sizes = stateStream.pluck('sizes');
        },
        /**
         * Add content as an array of Views or Surfaces.
         *
         * @method addItems
         * @param items {Array}  An array of Views or Surfaces
         */
        addItems : function addItems(items){
            this.nodes = items;

            for (var i = 0; i < this.nodes.length; i++){
                var node = this.nodes[i];

                this.add({
                    size : this.sizes.pluck(i),
                    transform : this.transforms.pluck(i)
                }).add(node);
            }
        }
    }, CONSTANTS);

    module.exports = FlexibleLayout;
});
