/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var View = require('./View');

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

    module.exports = View.extend({
        defaults : {
            direction: CONSTANTS.DIRECTION.X,
            transition: false,
            ratios : []
        },
        events : {
            change : updateOptions
        },
        initialize : function initialize(options){
            this._ratios = new Transitionable(options.ratios);
            this._nodes = [];
            this._cachedDirection = null;
            this._cachedLengths = [];
            this._cachedLength = Number.NaN;
            this._cachedTransforms = null;
            this._ratiosDirty = false;

            this.state.set({
                ratios : new Transitionable(options.ratios),
                nodes : [],
                direction : undefined,
                length : undefined,
                lengths : [],
                transforms : null,
                dirty : false,
                direction : options.direction
            });

            this.add(function(parentSpec){
                var ratios = this.state.getKey('ratios');
                var direction = this.state.getKey('direction');

                var length = parentSpec.size[direction];
                
                _reflow.call(this, ratios, length, direction);

                for (var i = 0; i < ratios.length; i++) {
                    var size = [undefined, undefined];
                    length = this._cachedLengths[i];
                    size[direction] = length;
                    this.spec.getChild(i)
                        .transformFrom(this._cachedTransforms[i])
                        .sizeFrom(size)
                        .setTarget(this._nodes[i])
                }

                return this.spec;
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
            this._nodes = sequence;
        },
        /**
         * Sets the associated ratio values for sizing the renderables.
         *
         * @method setRatios
         * @param {Array} ratios Array of ratios corresponding to the percentage sizes each renderable should be
         */
        setRatios : function setRatios(ratios, transition, callback){
            if (transition === undefined) transition = this.options.transition;
            this.state.setKey('ratios', ratios, transition, callback);
        }
    }, CONSTANTS);

    function updateOptions(options){
        var key = options.key;
        var value = options.value;

        if (key == 'direction') this.state.set(key, value)
    }

    function _reflow(ratios, length, direction) {
        var currTransform;
        var translation = 0;
        var flexLength = length;
        var ratioSum = 0;
        var nodeLength;
        var ratio;
        var node;
        var i;

        this._cachedLengths = [];
        this._cachedTransforms = [];

        for (i = 0; i < ratios.length; i++){
            ratio = ratios[i];
            node = this._nodes[i];

            //TODO: getSize will be defined once Sequence refactor is done
            if (!node.getSize()) continue;

            (typeof ratio !== 'number')
                ? flexLength -= node.getSize()[direction] || 0
                : ratioSum += ratio;
        }

        for (i = 0; i < ratios.length; i++) {
            node = this._nodes[i];
            ratio = ratios[i];

            //TODO: getSize will be defined once Sequence refactor is done
            if (!node.getSize()) continue;

            nodeLength = (typeof ratio === 'number')
                ? flexLength * ratio / ratioSum
                : node.getSize()[direction];

            currTransform = (direction === CONSTANTS.DIRECTION.X)
                ? Transform.translate(translation, 0, 0)
                : Transform.translate(0, translation, 0);

            this._cachedTransforms.push(currTransform);
            this._cachedLengths.push(nodeLength);

            translation += nodeLength;
        }
        this._cachedLength = length;
    }

    function _trueSizedDirty(ratios, direction) {
        for (var i = 0; i < ratios.length; i++) {
            if (typeof ratios[i] !== 'number' && this._nodes[i].getSize()[direction] !== this._cachedLengths[i])
                return true;
        }
        return false;
    }
});
