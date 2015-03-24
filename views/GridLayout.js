/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Transform               = require('../core/Transform');
    var ViewSequence            = require('../core/ViewSequence');
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
            this._transforms = [];
            this._sizes = [];
            this._contextSizeCache = null;
            this._dimensionsCache = [0, 0];
            this._activeCount = 0;
            this._sequence = null;
        },
        /**
         * Sets the collection of renderables under the Gridlayout instance's control.
         *
         * @method _sequenceFrom
         * @param {Array|ViewSequence} sequence Either an array of renderables or a Famous view_sequence.
         */
        sequenceFrom : function(sequence){
            if (sequence instanceof Array) sequence = new ViewSequence(sequence);
            this._sequence = sequence;
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
        render : function(parentSpec){
            var size = parentSpec.size;
            var cols = this.options.dimensions[0];
            var rows = this.options.dimensions[1];

            var callReflow = !this._contextSizeCache  ||
                size[0] !== this._contextSizeCache[0] ||
                size[1] !== this._contextSizeCache[1] ||
                cols    !== this._dimensionsCache[0]  ||
                rows    !== this._dimensionsCache[1];

            if (callReflow) _reflow.call(this, size, cols, rows);

            var index = 0;
            var _sequence = this._sequence;
            while (_sequence && (index < this._transforms.length)) {
                var item = _sequence.get();

                if (index >= this._activeCount)
                    _removeState.call(this, index);

                if (item) {
                    var transform = this._transforms[index].get();
                    var size = this._sizes[index].get();
                    this.spec.getChild(index)
                        .setTransform(transform)
                        .setSize(size)
                        .setTarget(item);
                }

                _sequence = _sequence.getNext();
                index++;
            }

            return this.spec.render();
        }
    });

    // PRIVATE FUNCTIONS

    function _reflow(size, cols, rows) {
        var options = this.options;

        var usableSize = [size[0], size[1]];
        usableSize[0] -= options.gutterSize[0] * (cols - 1);
        usableSize[1] -= options.gutterSize[1] * (rows - 1);

        var rowSize = Math.round(usableSize[1] / rows);
        var colSize = Math.round(usableSize[0] / cols);

        var currY = 0;
        var currIndex = 0;
        for (var i = 0; i < rows; i++) {
            var currX = 0;
            for (var j = 0; j < cols; j++) {
                (this._transforms[currIndex] === undefined)
                    ? _addState.call(this, currIndex, [colSize, rowSize], [currX, currY, 0])
                    : _animateState.call(this, currIndex, [colSize, rowSize], [currX, currY, 0]);

                currIndex++;
                currX += colSize + options.gutterSize[0];
            }

            currY += rowSize + options.gutterSize[1];
        }

        this._dimensionsCache = [options.dimensions[0], options.dimensions[1]];
        this._contextSizeCache = [size[0], size[1]];

        this._activeCount = rows * cols;

        for (i = this._activeCount ; i < this._transforms.length; i++)
            _animateState.call(this, i, [Math.round(colSize), Math.round(rowSize)], [0, 0]);

        this.emit('reflow');
    }

    function _addState(index, size, position) {
        this._transforms[index] = new TransitionableTransform(Transform.translate.apply(null, position));
        this._sizes[index] = new Transitionable(size);
    }

    function _removeState(index){
        this._transforms.splice(index, 1);
        this._sizes.splice(index, 1);
    }

    function _animateState(index, size, position) {
        var transition = this.options.transition;
        var currTransform = this._transforms[index];
        var currSize = this._sizes[index];

        currTransform.halt();
        currSize.halt();

        currTransform.setTranslate(position, transition);
        currSize.set(size, transition);
    }
});
