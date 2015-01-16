/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: felix@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transform               = require('../core/Transform');
    var ViewSequence            = require('../core/ViewSequence');
    var Modifier                = require('../core/Modifier');
    var Transitionable          = require('../core/Transitionable');
    var View                    = require('../views/View');
    var TransitionableTransform = require('../transitions/TransitionableTransform');

    /**
     * A layout which divides a context into several evenly-sized grid cells.
     *   If dimensions are provided, the grid is evenly subdivided with children
     *   cells representing their own context, otherwise the cellSize property is used to compute
     *   dimensions so that items of cellSize will fit.
     * @class GridLayout
     */

    module.exports = View.extend({
        name : 'GridLayout',
        defaults : {
            /**
             * @param {Array.Number} [dimensions=[1, 1]] A two value array which specifies the amount of columns
             * and rows in your Gridlayout instance.
             */
            dimensions: [1, 1],
            /**
             * @param {Array.Number} [gutterSize=[0, 0]] A two-value array which specifies size of the
             * horizontal and vertical gutters between items in the grid layout.
             */
            gutterSize: [0, 0],
            /**
             * @param {Transition} [transition=false] The transition that controls the GridLayout instance's reflow.
             */
            transition: false
        },
        initialize : function(){
            this._modifiers = [];
            this._states = [];
            this._contextSizeCache = [0, 0];
            this._dimensionsCache = [0, 0];
            this._activeCount = 0;
            this.sequence = null;
        },
        /**
         * Sets the collection of renderables under the Gridlayout instance's control.
         *
         * @method sequenceFrom
         * @param {Array|ViewSequence} sequence Either an array of renderables or a Famous viewSequence.
         */
        sequenceFrom : function(sequence){
            if (sequence instanceof Array) sequence = new ViewSequence(sequence);
            this.sequence = sequence;
        },
        /**
         * Returns the size of the grid layout.
         *
         * @method getSize
         * @return {Array} Total size of the grid layout.
         */
        getSize : function(){
            return this._contextSizeCache;
        },
        /**
         * Generate a render spec from the contents of this component.
         *
         * @private
         * @method render
         * @return {Object} Render spec for this component
         */
        render : function(input, context){
            var size = context.getSize();

            var cols = this.options.dimensions[0];
            var rows = this.options.dimensions[1];

            var callReflow =
                size[0] !== this._contextSizeCache[0] ||
                size[1] !== this._contextSizeCache[1] ||
                cols    !== this._dimensionsCache[0]  ||
                rows    !== this._dimensionsCache[1];

            if (callReflow) _reflow.call(this, size, cols, rows);

            var result = [];
            var currIndex = 0;
            var sequence = this.sequence;
            while (sequence && (currIndex < this._modifiers.length)) {
                var item = sequence.get();
                var modifier = this._modifiers[currIndex];

                if (currIndex >= this._activeCount && this._states[currIndex].opacity.isActive()) {
                    this._modifiers.splice(currIndex, 1);
                    this._states.splice(currIndex, 1);
                }

                if (item) result.push(modifier.render(item.render()));

                sequence = sequence.getNext();
                currIndex++;
            }

            return result;
        }
    });

    // PRIVATE FUNCTIONS

    function _reflow(size, cols, rows) {
        var usableSize = [size[0], size[1]];
        usableSize[0] -= this.options.gutterSize[0] * (cols - 1);
        usableSize[1] -= this.options.gutterSize[1] * (rows - 1);

        var rowSize = Math.round(usableSize[1] / rows);
        var colSize = Math.round(usableSize[0] / cols);

        var currY = 0;
        var currX;
        var currIndex = 0;
        for (var i = 0; i < rows; i++) {
            currX = 0;
            for (var j = 0; j < cols; j++) {
                if (this._modifiers[currIndex] === undefined) {
                    _createModifier.call(this, currIndex, [colSize, rowSize], [currX, currY, 0], 1);
                }
                else {
                    _animateModifier.call(this, currIndex, [colSize, rowSize], [currX, currY, 0], 1);
                }

                currIndex++;
                currX += colSize + this.options.gutterSize[0];
            }

            currY += rowSize + this.options.gutterSize[1];
        }

        this._dimensionsCache = [this.options.dimensions[0], this.options.dimensions[1]];
        this._contextSizeCache = [size[0], size[1]];

        this._activeCount = rows * cols;

        for (i = this._activeCount ; i < this._modifiers.length; i++) _animateModifier.call(this, i, [Math.round(colSize), Math.round(rowSize)], [0, 0], 0);

        this.emit('reflow');
    }

    function _createModifier(index, size, position, opacity) {
        var transitionItem = {
            transform: new TransitionableTransform(Transform.translate.apply(null, position)),
            opacity: new Transitionable(opacity),
            size: new Transitionable(size)
        };

        var modifier = new Modifier({
            transform: transitionItem.transform,
            opacity: transitionItem.opacity,
            size: transitionItem.size
        });

        this._states[index] = transitionItem;
        this._modifiers[index] = modifier;
    }

    function _animateModifier(index, size, position, opacity) {
        var currState = this._states[index];

        var currSize = currState.size;
        var currOpacity = currState.opacity;
        var currTransform = currState.transform;

        var transition = this.options.transition;

        currTransform.halt();
        currOpacity.halt();
        currSize.halt();

        currTransform.setTranslate(position, transition);
        currSize.set(size, transition);
        currOpacity.set(opacity, transition);
    }
});
