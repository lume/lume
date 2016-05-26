/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module) {
    var Transform = require('../core/Transform');
    var View = require('../core/View');
    var Stream = require('../streams/Stream');
    var Transitionable = require('../core/Transitionable');

    /**
     * A layout that arranges items in a grid and can rearrange the grid responsively.
     *
     *  The user provides the number of items per row in an array or a dictionary
     *  with keys that are pixel values. The items will be sized to fill the available space.
     *
     *  Let itemsPerRow be a dictionary if you want the grid to rearrange responsively. The
     *  keys should be pixel values. The row arrangement will be one of the entries of
     *  the dictionary whose key value is closest to the parent width without exceeding it.
     *
     *  @class GridLayout
     *  @constructor
     *  @extends Core.View
     *  @param [options] {Object}                           Options
     *  @param options.itemsPerRow {Array|Object}            Number of items per row, or an object of {width : itemsPerRow} pairs
     *  @param [options.gutter=0] {Transitionable|Number}   Gap space between successive items
     */
    var GridLayout = View.extend({
        defaults : {
            itemsPerRow : [],
            gutter : 0
        },
        events : {},
        initialize : function initialize(options){
            var gutter = (options.gutter instanceof Transitionable)
                ? options.gutter
                : new Transitionable(options.gutter);

            this.stream = Stream.lift(function(size, gutter){
                if (!size) return false; // TODO: fix bug

                var width = size[0];
                var height = size[1];

                var rows = ((options.itemsPerRow instanceof Array))
                    ? options.itemsPerRow
                    : selectRows(options.itemsPerRow, width);

                var numRows = rows.length;
                var rowHeight = (height - ((numRows - 1) * gutter)) / numRows;

                var sizes = [];
                var positions = [];

                var y = 0;
                for (var row = 0; row < numRows; row++){
                    var numCols = rows[row];
                    var colWidth = (width - ((numCols - 1) * gutter)) / numCols;

                    var x = 0;
                    for (var col = 0; col < numCols; col++){
                        var size = [colWidth, rowHeight];
                        sizes.push(size);
                        positions.push([x,y]);
                        x += colWidth + gutter;
                    }

                    y += rowHeight + gutter;
                }

                return {
                    sizes : sizes,
                    positions : positions
                };
            }, [this.size, gutter])
        },
        /**
         * Add items to the layout.
         *
         * @method addItems
         * @param [items] {Array}   Array of Surfaces or Views
         */
        addItems : function addItems(items){
            var sizes = this.stream.pluck('sizes');
            var positions = this.stream.pluck('positions');

            for (var i = 0; i < items.length; i++){
                var node = items[i];

                var size = sizes.pluck(i);
                var position = positions.pluck(i);

                var transform = position.map(function(position){
                    return Transform.translate(position);
                });

                this.add({size : size, transform : transform}).add(node);
            }
        }
    });

    function selectRows(rows, width){
        for (var cutoff in rows) {
            if (width <= parseInt(cutoff))
                break;
        }
        return rows[cutoff];
    }

    module.exports = GridLayout;
});
