/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Transform from 'famous/src/core/Transform';
import Transitionable from 'famous/src/transitions/Transitionable';
import Easing from 'famous/src/transitions/Easing';

import Molecule from './Molecule';
import Grid from './Grid';
import DoubleSidedPlane from './DoubleSidedPlane';

import forLength from 'army-knife/forLength';

/**
 * A calendar widget for selecting a date (WIP).
 *
 * @class Calendar
 * @extends Molecule
 */
export class Calendar extends Molecule {

    /**
     * Create a new `Calendar` with the given Famo.us-style size array and
     * transition. The transition is the type of animation used when switching
     * between months.
     *
     * @constructor
     * @param {Array} calendarSize A Famo.us-style width/height size array.
     * @param {String} transition The name of the animation transition to use when switching months.
     */
    constructor(calendarSize, transition) {
        super({size: calendarSize});

        this.transition = transition;
        this.flipSide = 0; // 0 means the initial front faces are showing, 1 means the initial back faces are showing.
        this.columnsRows = [7,6];
        this.planes = [];

        this._initializeTransitions();
        this._createGrid();

        setTimeout( function() {
            this.transitions[this.transition]();
            setInterval(this.transitions[this.transition], 2000);
        }.bind(this) , 800);
    }

    /**
     * Creates the grid used for the layout of the day cells.
     *
     * @private
     */
    _createGrid() {
        var grid = new Grid(this.columnsRows[0], this.columnsRows[1], this.options.size);

        forLength(this.columnsRows[0]*this.columnsRows[1], function(i) {
            var plane = new DoubleSidedPlane({
                properties: {
                    background: 'teal',
                }
            });
            this.planes.push(plane);
        }.bind(this));

        grid.setChildren(this.planes);
        this.node.add(grid);
    }

    /**
     * Set up `this.transitions`, containing the available month-to-month
     * transitions.
     *
     * @private
     */
    _initializeTransitions() {
        this.transitions = {
            flipDiagonal: function() {
                this.flipSide = +!this.flipSide;
                // determine which dimension of the grid is shorter and which is longer.
                var shortest = 0;
                var longest;
                this.columnsRows.forEach(function(item, index) {
                    if (item < this.columnsRows[shortest])
                        shortest = index;
                }.bind(this));
                longest = +!shortest;

                // for each diagonal of the grid, flip those cells.
                forLength(this.columnsRows[0]+this.columnsRows[1]-1, function(column) {
                    forLength(this.columnsRows[shortest], function(row) {
                        if (column-row >= 0 && column-row < this.columnsRows[longest]) {
                            var plane = this.planes[column-row + this.columnsRows[longest]*row];
                            flipOne(plane, column);
                        }
                    }.bind(this));
                }.bind(this));

                function flipOne(item, column) {
                    if (typeof item.__targetRotation == 'undefined') {
                        item.__targetRotation = new Transitionable(0);
                    }
                    var rotation = new Transitionable(item.__targetRotation.get());
                    item.__targetRotation.set(item.__targetRotation.get()+Math.PI);

                    //item.get().transformFrom(function() {
                        //return Transform.rotateY(rotation.get());
                    //});
                    item.children[0].get().transformFrom(function() {
                        return Transform.rotateY(rotation.get());
                    });
                    item.children[1].get().transformFrom(function() {
                        return Transform.rotateY(rotation.get()+Math.PI);
                    });

                    setTimeout(function() {
                        rotation.set(item.__targetRotation.get(), { duration: 2000, curve: Easing.outExpo });
                    }, 0+50*column);
                }
            }.bind(this)
        };
    }
}
export default Calendar;
