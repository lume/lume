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
    var Spec = require('famous/core/Spec');

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
            change : updateOptions
        },
        state : {
            ratios : Transitionable,
            nodes : Array,
            lengths : Array,
            transforms : Array,
            length : Number
        },
        initialize : function initialize(options){
            this.state.ratios.set(options.ratios);
            this.state.nodes = [];
            this.state.direction = options.direction;
            this.state.lengths = [];
            this.state.length = Number.NaN;
            this.state.transforms = [];

            var spec = new Spec();

            this.add(function(parentSize){
                var ratios = this.state.ratios.get();
                var direction = this.state.direction;

                this.state.length = parentSize[direction];

                _reflow.call(this);

                for (var i = 0; i < ratios.length; i++) {
                    var transform = this.state.transforms[i];
                    var node = this.state.nodes[i];

                    var size = [undefined, undefined];
                    size[direction] = this.state.lengths[i];

                    spec.getChild(i)
                        .setTransform(transform)
                        .setSize(size)
                        .setTarget(node);
                }

                return spec;
            }.bind(this));
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

    function _reflow() {
        var ratios = this.state.ratios.get();
        var length = this.state.length;
        var direction = this.state.direction;

        this.state.lengths = [];
        this.state.transforms = [];

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

        var translation = 0;
        for (var i = 0; i < ratios.length; i++) {
            node = this.state.nodes[i];
            ratio = ratios[i];

            if (!node || node.getSize === undefined) continue;

            var nodeLength = (typeof ratio === 'number')
                ? flexLength * ratio / ratioSum
                : node.getSize()[direction];

            var currTransform = (direction === CONSTANTS.DIRECTION.X)
                ? Transform.translate(translation, 0, 0)
                : Transform.translate(0, translation, 0);

            this.state.lengths.push(nodeLength);
            this.state.transforms.push(currTransform);

            translation += nodeLength;
        }
    }

});
