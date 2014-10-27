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
import Molecule from 'javascripts/components/Molecule';

import forLength from 'javascripts/utils/forLength';

export class Grid extends Molecule { // a scenegraph tree that lays things out in a grid. The leaf nodes are Modifiers (the cells of the grid). Put stuff in them.
    constructor(columns, rows, size) {
        super({size: size});

        this.columns = columns;
        this.rows = rows;
        this.cellNodes = [];

        if (typeof this.options.size === 'undefined') { this.setOptions({size: [undefined, undefined]}); }

        forLength(this.columns*this.rows, this.createGridCell.bind(this));
    }

    createGridCell(index) {
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
        // TODO: Use Molecule instead of Modifier.
        this.cellNodes.push(this.add(mod).add(mod2));
    }

    setChildren(children) {
        forLength(this.columns*this.rows, function(index) {
            //this.cellNodes[index].set(null); // TODO: how do we erase previous children?
            this.cellNodes[index].add(children[index]);
        }.bind(this));
        return this;
    }
}
export default Grid;
