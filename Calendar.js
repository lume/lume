/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Transform from 'famous/core/Transform';
import Transitionable from 'famous/transitions/Transitionable';
import Easing from 'famous/transitions/Easing';
import Molecule from 'javascripts/components/Molecule';
import Grid from 'javascripts/components/Grid';
import DoubleSidedPlane from 'javascripts/components/DoubleSidedPlane';

import forLength from 'javascripts/utils/forLength';

export class Calendar extends Molecule {
    constructor(calendarSize, transition) {
        super({size: calendarSize});

        this.transition = transition;
        this.flipSide = 0; // 0 means the initial front faces are showing, 1 means the initial back faces are showing.
        this.columnsRows = [7,6];
        this.planes = [];

        this.initializeTransitions();
        this.createGrid();

        setTimeout( function() {
            this.transitions[this.transition]();
            setInterval(this.transitions[this.transition], 2000);
        }.bind(this) , 800);
    }

    createGrid() {
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
        this.add(grid);
    }

    initializeTransitions() {
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
