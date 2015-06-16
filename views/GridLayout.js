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
    var Stream = require('famous/streams/Stream');
    var Observable = require('famous/core/Observable');
    var View = require('famous/core/View');
    var Modifier = require('famous/core/ModifierStream');

    /**
     * A layout which divides a context into several evenly-sized grid cells.
     *   If dimensions are provided, the grid is evenly subdivided with children
     *   cells representing their own context, otherwise the cellSize property is used to compute
     *   dimensions so that items of cellSize will fit.
     * @class GridLayout
     */

    var GridLayout = View.extend({
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
            transition: true
        },
        events : {
            change : onChange
        },
        initialize : function(options){
            this.nodes = [];
            this.dimensions = new Observable(options.dimensions);

            //TODO: separate out positions to control them on dimension change
            var stateStream = Stream.lift(function(dimensions, size){
                if (!dimensions) dimensions = this.dimensions.get();

                var cols = dimensions[0];
                var rows = dimensions[1];

                var usableSize = [size[0], size[1]];
                usableSize[0] -= options.gutterSize[0] * (cols - 1);
                usableSize[1] -= options.gutterSize[1] * (rows - 1);

                var rowSize = Math.round(usableSize[1] / rows);
                var colSize = Math.round(usableSize[0] / cols);

                var x = y = 0;
                var index = 0;
                var positions = [];
                var sizes = [];

                for (var row = 0; row < rows; row++) {
                    x = 0;
                    for (var col = 0; col < cols; col++) {
                        positions[index] = [x, y];
                        sizes[index] = [colSize, rowSize];

                        index++;
                        x += colSize + options.gutterSize[0];
                    }
                    y += rowSize + options.gutterSize[1];
                }

                return {
                    positions : positions,
                    sizes : sizes
                };

            }.bind(this), [this.dimensions, this.size]);

            var positions = stateStream.pluck('positions');
            this.sizes = stateStream.pluck('sizes');

            this.transforms = positions.map(function(positions){
                var transforms = [];
                for (var i = 0; i < positions.length; i++){
                    var position = positions[i];
                    transforms.push(Transform.translate(position[0], position[1], 0));
                }
                return transforms;
            });
        },
        /**
         * Sets the collection of renderables under the Gridlayout instance's control.
         *
         * @method _sequenceFrom
         * @param {Array|ViewSequence} sequence Either an array of renderables or a Famous view_sequence.
         */
        sequenceFrom : function(sequence){
            this.nodes = sequence;
            for (var i = 0; i < sequence.length; i++){
                var item = sequence[i];
                var modifier = new Modifier({
                    transform : this.transforms.pluck(i),
                    size : this.sizes.pluck(i)
                });
                this.add(modifier).add(item);
            }
        },
        setDimensions : function(dimensions){
            this.dimensions.set(dimensions);
        }
    });

    // PRIVATE FUNCTIONS

    function onChange(option){
        var key = option.key;
        var value = option.value;
        if (key == 'dimensions') this.setDimensions(value);
    }

    module.exports = GridLayout;
});
