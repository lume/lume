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
        events : {
            change : onChange,
            resize : onResize
        },
        state : {
            positions : Array,
            sizes : Array,
            dimensions : Array,
            sequence : ViewSequence,
            count : Number,
            gutterSize : Array
        },
        initialize : function(options){
            this.state.positions = [];
            this.state.sizes = [];
            this.state.dimensions = options.dimensions;
            this.state.count = 0;
            this.state.gutterSize = options.gutterSize;
            this.transforms = [];
        },
        setup : function(){
            var index = 0;
            var sequence = this.state.sequence;
            while (sequence){
                var item = sequence.get();

                this.add({
                    transform : this.transforms[index],
                    size : this.state.sizes[index]
                }).add(item);

                sequence = sequence.getNext();
                index++;
            }
        },
        /**
         * Sets the collection of renderables under the Gridlayout instance's control.
         *
         * @method _sequenceFrom
         * @param {Array|ViewSequence} sequence Either an array of renderables or a Famous view_sequence.
         */
        sequenceFrom : function(sequence){
            this.state.sequence.setBacking(sequence);
        },
        setDimensions : function(dimensions){
            this.state.dimensions = dimensions;
            this.state.count = dimensions[0] * dimensions[1];
        }
    });

    // PRIVATE FUNCTIONS

    function onChange(option){
        var key = option.key;
        var value = option.value;
        if (key == 'dimensions') this.setDimensions(value);
        if (key == 'gutterSize') this.state.gutterSize = value;
    }

    function onResize(size) {
        var options = this.options;

        var cols = this.state.dimensions[0];
        var rows = this.state.dimensions[1];

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
                (this.transforms[currIndex] === undefined)
                    ? _addState.call(this, currIndex, [colSize, rowSize], [currX, currY, 0])
                    : _animateState.call(this, currIndex, [colSize, rowSize], [currX, currY, 0]);

                currIndex++;
                currX += colSize + options.gutterSize[0];
            }

            currY += rowSize + options.gutterSize[1];
        }

        this.state.count = rows * cols;

        for (i = this.state.count; i < this.state.positions.length; i++)
            _animateState.call(this, i, [Math.round(colSize), Math.round(rowSize)], [0, 0]);

        this.emit('resize');
    }

    function _addState(index, size, position) {
        this.transforms[index] = new TransitionableTransform(Transform.translate.apply(null, position));
        this.state.positions[index] = new Transitionable(position);
        this.transforms[index].translateFrom(this.state.positions[index]);
        this.state.sizes[index] = new Transitionable(size);
    }

    function _removeState(index){
        this.transforms.splice(index, 1);
        this.state.positions.splice(index, 1);
        this.state.sizes.splice(index, 1);
    }

    function _animateState(index, size, position) {
        var transition = this.options.transition;
        var currPosition = this.state.positions[index];
        var currSize = this.state.sizes[index];

        currPosition.set(position, transition);
        currSize.set(size, transition);
    }
});
