"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Calendar = void 0;

var _Transform = _interopRequireDefault(require("famous/src/core/Transform"));

var _Transitionable = _interopRequireDefault(require("famous/src/transitions/Transitionable"));

var _Easing = _interopRequireDefault(require("famous/src/transitions/Easing"));

var _Molecule = _interopRequireDefault(require("./Molecule"));

var _Grid = _interopRequireDefault(require("./Grid"));

var _DoubleSidedPlane = _interopRequireDefault(require("./DoubleSidedPlane"));

var _forLength = _interopRequireDefault(require("army-knife/forLength"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

/**
 * A calendar widget for selecting a date (WIP).
 *
 * @class Calendar
 * @extends Molecule
 */
class Calendar extends _Molecule.default {
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
    super({
      size: calendarSize
    });
    this.transition = transition;
    this.flipSide = 0; // 0 means the initial front faces are showing, 1 means the initial back faces are showing.

    this.columnsRows = [7, 6];
    this.planes = [];

    this._initializeTransitions();

    this._createGrid();

    setTimeout(function () {
      this.transitions[this.transition]();
      setInterval(this.transitions[this.transition], 2000);
    }.bind(this), 800);
  }
  /**
   * Creates the grid used for the layout of the day cells.
   *
   * @private
   */


  _createGrid() {
    const grid = new _Grid.default(this.columnsRows[0], this.columnsRows[1], this.options.size);
    (0, _forLength.default)(this.columnsRows[0] * this.columnsRows[1], function (i) {
      const plane = new _DoubleSidedPlane.default({
        properties: {
          background: 'teal'
        }
      });
      this.planes.push(plane);
    }.bind(this));
    grid.setChildren(this.planes);
    this.add(grid);
  }
  /**
   * Set up `this.transitions`, containing the available month-to-month
   * transitions.
   *
   * @private
   */


  _initializeTransitions() {
    this.transitions = {
      flipDiagonal: function () {
        this.flipSide = +!this.flipSide; // determine which dimension of the grid is shorter and which is longer.

        let shortest = 0;
        let longest;
        this.columnsRows.forEach(function (item, index) {
          if (item < this.columnsRows[shortest]) shortest = index;
        }.bind(this));
        longest = +!shortest; // for each diagonal of the grid, flip those cells.

        (0, _forLength.default)(this.columnsRows[0] + this.columnsRows[1] - 1, function (column) {
          (0, _forLength.default)(this.columnsRows[shortest], function (row) {
            if (column - row >= 0 && column - row < this.columnsRows[longest]) {
              const plane = this.planes[column - row + this.columnsRows[longest] * row];
              flipOne(plane, column);
            }
          }.bind(this));
        }.bind(this));

        function flipOne(item, column) {
          if (typeof item.__targetRotation == 'undefined') {
            item.__targetRotation = new _Transitionable.default(0);
          }

          const rotation = new _Transitionable.default(item.__targetRotation.get());

          item.__targetRotation.set(item.__targetRotation.get() + Math.PI); //item.get().transformFrom(function() {
          //return Transform.rotateY(rotation.get());
          //});


          item.children[0].get().transformFrom(function () {
            return _Transform.default.rotateY(rotation.get());
          });
          item.children[1].get().transformFrom(function () {
            return _Transform.default.rotateY(rotation.get() + Math.PI);
          });
          setTimeout(function () {
            rotation.set(item.__targetRotation.get(), {
              duration: 2000,
              curve: _Easing.default.outExpo
            });
          }, 0 + 50 * column);
        }
      }.bind(this)
    };
  }

}

exports.Calendar = Calendar;
var _default = Calendar;
exports.default = _default;