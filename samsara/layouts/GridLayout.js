/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var View = require('../core/View');
    var FlexLayout = require('./FlexLayout');

    /**
     * A layout that arranges items in a grid and can rearrange the grid responsively.
     *
     *  The user provides the number of items per row in an array or a dictionary
     *  with keys that are pixel values. The items will be sized to fill the available space.
     *
     *  @class GridLayout
     *  @constructor
     *  @extends Core.View
     *  @param [options] {Object}                           Options
     *  @param [options.spacing=0] {Array}                  Gap space between successive rows and columns
     */
    var GridLayout = View.extend({
        defaults : {
            spacing : [0, 0]
        },
        initialize : function initialize(options){
            this.rows = [];
            this.col = new FlexLayout({
                direction: FlexLayout.DIRECTION.Y,
                spacing: options.spacing[1]
            });

            this.add(this.col);
        },
        push : function(item, flex, row){
            if (row > this.rows.length) return;

            if (row === -1){
                this.unshift(item, flex, row);
                return;
            }

            if (row === undefined) row = this.rows.length;

            var flexRow;
            if (row === this.rows.length){
                // append a new row
                flexRow = new FlexLayout({
                    direction: FlexLayout.DIRECTION.X,
                    spacing: this.options.spacing[0]
                });

                this.rows.push(flexRow);
                this.col.push(flexRow, 1);
            }
            else flexRow = this.rows[row];

            flexRow.push(item, flex);
        },
        pop : function(row){
            if (row === undefined) row = this.rows.length - 1;

            var flexRow = this.rows[row];

            var item = flexRow.pop();

            if (flexRow.length() === 0)
                removeRow.call(this, row);

            return item;
        },
        unshift : function(item, flex, row){
            if (row < -1) return;

            if (row === this.rows.length){
                this.push(item, flex, row);
                return;
            }

            if (row === undefined) row = -1;

            var flexRow;
            if (row === -1){
                // prepend a new row
                flexRow = new FlexLayout({
                    direction : FlexLayout.DIRECTION.X,
                    spacing : this.options.spacing[0]
                });

                this.rows.unshift(flexRow);
                this.col.unshift(flexRow, 1);
            }
            else flexRow = this.rows[row];

            flexRow.unshift(item, flex);
        },
        shift : function(row){
            if (row === undefined) row = 0;
            var flexRow = this.rows[row];

            var item = flexRow.shift();

            if (this.rows[row].length() === 0)
                removeRow.call(this, row);

            return item;
        },
        insertAfter : function(row, col, item, flex){
            var flexRow = this.rows[row];
            flexRow.insertAfter(col, item, flex);
        },
        insertBefore : function(row, col, item, flex){
            var flexRow = this.rows[row];
            flexRow.insertBefore(col, item, flex);
        },
        unlink : function(row, col){
            var flexRow = this.rows[row];
            flexRow.unlink(col);
        },
        advance : function(row){
            var nextRow = row + 1;

            var numRows = this.rows.length;

            var surface = this.pop(row);
            surface.remove();

            nextRow -= (numRows - this.rows.length);

            var flex = 1;
            this.unshift(surface, flex, nextRow);
        },
        retreat : function(row){
            var prevRow = row - 1;

            var surface = this.shift(row);
            surface.remove();

            var flex = 1;
            this.push(surface, flex, prevRow);
        },
        resize : function(colsPerRow){
            for (var row = 0; row < colsPerRow.length; row++){
                var nCols = colsPerRow[row];
                var count = this.rows[row].nodes.length;

                while (count > nCols) {
                    this.advance(row);
                    count--;
                }

                while (count < nCols) {
                    this.retreat(row + 1);
                    count++;
                }
            }
        }
    });

    function removeRow(rowIndex){
        var emptyRow = this.col.unlink(this.rows[rowIndex]);
        emptyRow.remove();
        this.rows.splice(rowIndex, 1);
    }

    module.exports = GridLayout;
});
