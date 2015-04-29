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
    var ViewSequence = require('famous/core/ViewSequence');
    var Transitionable = require('famous/core/Transitionable');
    var View = require('famous/core/View');
    var Spec = require('famous/core/Spec');
    var TransitionableTransform = require('famous/transitions/TransitionableTransform');

    /**
     * A layout which divides a context into several evenly-sized grid cells.
     *   If dimensions are provided, the grid is evenly subdivided with children
     *   cells representing their own context, otherwise the cellSize property is used to compute
     *   dimensions so that items of cellSize will fit.
     * @class GridLayout
     */

    var GridLayout = module.exports = View.extend({
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
        state : {
            transforms : Array,
            sizes : Array,
            dimensions : Array,
            sequence : ViewSequence,
            count : Number
        },
        initialize : function(options){
            this.state.transforms = [];
            this.state.sizes = [];
            this.state.dimensions = [0, 0];
            this.state.count = 0;
            this.state.sequence = null;

            var spec = new Spec();
            this.add(function(size){
                var cols = options.dimensions[0];
                var rows = options.dimensions[1];

                //TODO: make sure only called when dirty
                _reflow.call(this, size, cols, rows);

                var index = 0;
                var sequence = this.state.sequence;
                while (sequence && (index < this.state.transforms.length)) {
                    var item = sequence.get();

                    if (index >= this.state.count)
                        _removeState.call(this, index);

                    if (item) {
                        var transform = this.state.transforms[index].get();
                        var size = this.state.sizes[index].get();
                        spec.getChild(index)
                            .setTransform(transform)
                            .setSize(size)
                            .setTarget(item);
                    }

                    sequence = sequence.getNext();
                    index++;
                }
                return spec;
            }.bind(this));
        },
        /**
         * Sets the collection of renderables under the Gridlayout instance's control.
         *
         * @method _sequenceFrom
         * @param {Array|ViewSequence} sequence Either an array of renderables or a Famous view_sequence.
         */
        sequenceFrom : function(sequence){
            if (sequence instanceof Array) sequence = new ViewSequence(sequence);
            this.state.sequence = sequence;
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
                (this.state.transforms[currIndex] === undefined)
                    ? _addState.call(this, currIndex, [colSize, rowSize], [currX, currY, 0])
                    : _animateState.call(this, currIndex, [colSize, rowSize], [currX, currY, 0]);

                currIndex++;
                currX += colSize + options.gutterSize[0];
            }

            currY += rowSize + options.gutterSize[1];
        }

        this.state.count = rows * cols;

        for (i = this._activeCount ; i < this.state.transforms.length; i++)
            _animateState.call(this, i, [Math.round(colSize), Math.round(rowSize)], [0, 0]);

        this.emit('reflow');
    }

    function _addState(index, size, position) {
        this.state.transforms[index] = new TransitionableTransform(Transform.translate.apply(null, position));
        this.state.sizes[index] = new Transitionable(size);
    }

    function _removeState(index){
        this.state.transforms.splice(index, 1);
        this.state.sizes.splice(index, 1);
    }

    function _animateState(index, size, position) {
        var transition = this.options.transition;
        var currTransform = this.state.transforms[index];
        var currSize = this.state.sizes[index];

        currTransform.setTranslate(position, transition);
        currSize.set(size, transition);
    }
});
