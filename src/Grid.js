/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Modifier from 'famous/core/Modifier';
import Transform from 'famous/core/Transform';

import Molecule from './Molecule';

import forLength from 'army-knife/forLength';

/**
 * A scenegraph tree with a variable number of leaf node Modifiers (the grid
 * cells) that are arranged in a grid. Add any [famous/core/RenderNode](#famous/core/RenderNode)-compatible
 * item to each leafnode of the grid.
 *
 * TODO: Use Molecule instead of Modifier for the grid cells.
 * TODO: Add an options parameter, that the Molecule constructor will handle.
 *
 * @class Grid
 * @extends Molecule
 */
export class Grid extends Molecule {

    /**
     * Creates a new Grid having the specified number of columns, number of rows,
     * and famo.us-style size.
     *
     * @constructor
     * @param {Number} columns The integer number of columns.
     * @param {Number} rows The integer number of rows.
     * @param {Array} size A famo.us-style width/height size array.
     */
    constructor(columns, rows, size) {
        super({size: size});

        this.columns = columns;
        this.rows = rows;
        this.cellNodes = [];

        if (typeof this.options.size === 'undefined') { this.setOptions({size: [undefined, undefined]}); }

        forLength(this.columns*this.rows, this._createGridCell.bind(this));
    }

    /**
     * Creates a grid cell at the given index.
     *
     * @private
     * @param {Number} index The integer index of the grid cell.
     */
    _createGridCell(index) {
        var column = index % this.columns;
        var row = Math.floor(index / this.columns);

        var cellSize = null;
        if (typeof this.options.size[0] != 'undefined' && typeof this.options.size[1] != 'undefined') {
            cellSize = [];
            cellSize[0] = this.options.size[0]/this.columns;
            cellSize[1] = this.options.size[1]/this.rows;
        }

        var mod = new Modifier({
            align: [0,0],
            origin: [0,0],
            size: cellSize? [cellSize[0], cellSize[1]]: [undefined, undefined],
            transform: Transform.translate(column*cellSize[0],row*cellSize[1],0)
        });
        var mod2 = new Modifier({
            //transform: Transform.rotateY(Math.PI/10),
            align: [0.5,0.5],
            origin: [0.5,0.5]
        });
        // FIXME: ^^^ Why do I need an extra Modifier to align stuff in the middle of the grid cells?????
        this.cellNodes.push(this.add(mod).add(mod2));
    }

    /**
     * Sets the items to be layed out in the grid.
     *
     * @param {Array} children An array of [famous/core/RenderNode](#famous/core/RenderNode)-compatible items.
     */
    setChildren(children) {
        forLength(this.columns*this.rows, function(index) {
            //this.cellNodes[index].set(null); // TODO: how do we erase previous children?
            this.cellNodes[index].add(children[index]);
        }.bind(this));
        return this;
    }
}
export default Grid;
