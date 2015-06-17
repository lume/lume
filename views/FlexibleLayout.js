/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/core/Transitionable');
    var View = require('famous/core/View');
    var Stream = require('famous/streams/Stream');
    var Modifier = require('famous/core/ModifierStream');

    /**
     * A layout which divides a context into sections based on a proportion
     *   of the total sum of ratios.  FlexibleLayout can either lay renderables
     *   out vertically or horizontally.
     * @class FlexibleLayout
     * @constructor
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=0] Direction the FlexibleLayout instance should lay out renderables.
     * @param {Transition} [options.transition=false] The transiton that controls the FlexibleLayout instance's reflow.
     * @param {Ratios} [options.ratios=[]] The proportions for the renderables to maintain
     */

    var CONSTANTS = {
        DIRECTION : {
            X : 0,
            Y : 1
        }
    };

    var FlexibleLayout = View.extend({
        defaults : {
            direction : CONSTANTS.DIRECTION.X,
            transition : true,
            ratios : []
        },
        events : {},
        initialize : function initialize(){
            this.ratios = new Transitionable(this.options.ratios);
            this.nodes = [];

            var stateStream = Stream.lift(
                function(ratios, parentSize){
                    var direction = this.options.direction;

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
                            ? Transform.translate(displacement, 0, 0)
                            : Transform.translate(0, displacement, 0);

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
                }.bind(this),
                [this.ratios, this.sizeStream]
            );

            this.transforms = stateStream.pluck('transforms');
            this.sizes = stateStream.pluck('sizes');
        },
        /**
         * Sets the collection of renderables under the FlexibleLayout instance's control.  Also sets
         * the associated ratio values for sizing the renderables if given.
         *
         * @method sequenceFrom
         * @param {Array} sequence An array of renderables.
         */
        sequenceFrom : function sequenceFrom(sequence){
            this.nodes = sequence;

            for (var i = 0; i < this.nodes.length; i++){
                var node = this.nodes[i];
                var modifier = new Modifier({
                    transform : this.transforms.pluck(i),
                    size : this.sizes.pluck(i)
                });
                this.add(modifier).add(node);
            }
        },
        /**
         * Sets the associated ratio values for sizing the renderables.
         *
         * @method setRatios
         * @param {Array} ratios Array of ratios corresponding to the percentage sizes each renderable should be
         */
        setRatios : function setRatios(ratios, transition, callback){
            if (transition === undefined) transition = this.options.transition;
            this.ratios.set(ratios, transition, callback);
        }
    }, CONSTANTS);

    module.exports = FlexibleLayout;
});
