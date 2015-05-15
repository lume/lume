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
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');
    var View = require('famous/core/View');
    var Stream = require('famous/core/Stream');

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

    var FlexibleLayout = module.exports = View.extend({
        defaults : {
            direction: CONSTANTS.DIRECTION.X,
            transition: false,
            ratios : []
        },
        events : {
            change : updateOptions,
            resize : onResize
        },
        state : {
            ratios : Transitionable,
            length : Number,
            nodes : Array
        },
        initialize : function initialize(options){
            this.state.ratios.set(options.ratios);
            this.state.length = Number.NaN;
            this.state.nodes = [];
        },
        setup : function(){
            var direction = this.options.direction;

            this.sizesStream = _setupSizeStream.call(this);
            this.displacementStream = _setupDisplacementStream.call(this);

            // TODO: use observer for simple types to fix this
            // subscribe from this.state.length, or better just this.length

            this.sizesStream.subscribe(this.state);
            this.displacementStream.subscribe(this.state);

            for (var i = 0; i < this.options.ratios.length; i++){
                var transform = new TransitionableTransform();

                var displacement = this.displacementStream.pluck(i);
                (direction == CONSTANTS.DIRECTION.X)
                    ? transform.translateXFrom(displacement)
                    : transform.translateYFrom(displacement);

                var node = this.state.nodes[i];

                this.add({
                    transform : transform,
                    size : this.sizesStream.pluck(i)
                }).add(node);
            }
        },
        /**
         * Sets the collection of renderables under the FlexibleLayout instance's control.  Also sets
         * the associated ratio values for sizing the renderables if given.
         *
         * @method sequenceFrom
         * @param {Array} sequence An array of renderables.
         */
        sequenceFrom : function sequenceFrom(sequence){
            this.state.nodes = sequence;
        },
        /**
         * Sets the associated ratio values for sizing the renderables.
         *
         * @method setRatios
         * @param {Array} ratios Array of ratios corresponding to the percentage sizes each renderable should be
         */
        setRatios : function setRatios(ratios, transition, callback){
            if (transition === undefined) transition = this.options.transition;
            this.state.ratios.set(ratios, transition, callback);
        }
    }, CONSTANTS);

    function updateOptions(options){
        var key = options.key;
        var value = options.value;
        if (key === 'direction') this.state[key] = value;
    }

    function _setupDisplacementStream(){
        var ratioStream = new Stream();
        ratioStream.subscribe(this.state.ratios);

        return ratioStream.map(function(ratios){
            var length = this.state.length;
            var direction = this.options.direction;

            // calculate remaining size after true-sized nodes are accounted for
            var flexLength = length;
            var ratioSum = 0;
            for (var i = 0; i < ratios.length; i++){
                var ratio = ratios[i];
                var node = this.state.nodes[i];

                if (!node || node.getSize === undefined) continue;

                (typeof ratio !== 'number')
                    ? flexLength -= node.getSize()[direction] || 0
                    : ratioSum += ratio;
            }

            // calculate sizes and displacements of nodes
            var displacement = 0;
            var displacements = [];
            for (var i = 0; i < ratios.length; i++) {
                node = this.state.nodes[i];
                ratio = ratios[i];

                if (!node || node.getSize === undefined) continue;

                var nodeLength = (typeof ratio === 'number')
                    ? flexLength * ratio / ratioSum
                    : node.getSize()[direction];

                displacements.push(displacement);
                displacement += nodeLength;
            }

            return displacements;
        }.bind(this));
    }

    function _setupSizeStream(){
        var ratioStream = new Stream();
        ratioStream.subscribe(this.state.ratios);

        return ratioStream.map(function(ratios){
            var length = this.state.length;
            var direction = this.options.direction;

            // calculate remaining size after true-sized nodes are accounted for
            var flexLength = length;
            var ratioSum = 0;
            for (var i = 0; i < ratios.length; i++){
                var ratio = ratios[i];
                var node = this.state.nodes[i];

                if (!node || node.getSize === undefined) continue;

                (typeof ratio !== 'number')
                    ? flexLength -= node.getSize()[direction] || 0
                    : ratioSum += ratio;
            }

            // calculate sizes and displacements of nodes
            var sizes = [];
            for (var i = 0; i < ratios.length; i++) {
                node = this.state.nodes[i];
                ratio = ratios[i];

                if (!node || node.getSize === undefined) continue;

                var nodeLength = (typeof ratio === 'number')
                    ? flexLength * ratio / ratioSum
                    : node.getSize()[direction];

                var size = (direction == CONSTANTS.DIRECTION.X)
                    ? [nodeLength, undefined]
                    : [undefined, nodeLength];

                sizes.push(size);
            }

            return sizes;
        }.bind(this));
    }

    function onResize(size) {
        this.state.length = size[this.options.direction];
        this.emit('resize');
    }

});
