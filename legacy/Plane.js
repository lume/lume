"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Plane = void 0;

var _Surface = _interopRequireDefault(require("famous/src/core/Surface"));

var _Molecule = _interopRequireDefault(require("./Molecule"));

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
 * Planes have the properties of [Molecules](#Molecule), plus they contain a
 * [famous/src/core/Surface](#famous/src/core/Surface) so that they ultimately render
 * onto the screen. A Surface's events are automatically piped to it's
 * [famous/src/core/EventHandler](#famous/src/core/EventHandler), inherited from
 * `Molecule`.
 *
 * @class Plane
 * @extends Molecule
 */
class Plane extends _Molecule.default {
  /**
   * Creates a new `Plane`. Properties from the `initialOptions` parameter
   * are applied to this Plane's [famous/src/core/Surface](#famous/src/core/Surface) as well as to
   * to this Plane's [famous/src/core/Modifier](#famous/src/core/Modifier), hence the API of a Plane
   * is currently the combination of the Famo.us `Modifier` and `Surface` APIs.
   *
   * @constructor
   * @param {Object} initialOptions Options for the new Plane.
   */
  constructor(initialOptions) {
    super(initialOptions);
    this.surface = new _Surface.default(this.options);
    this.add(this.surface);
    this.surface.pipe(this.options.handler);
  }
  /**
   * Get the content of this Plane's [famous/src/core/Surface](#famous/src/core/Surface).
   * See [famous/src/core/Surface.getContent](#famous/src/core/Surface.getContent).
   */


  getContent() {
    const args = Array.prototype.splice.call(arguments, 0);
    return this.surface.getContent.apply(this.surface, args);
  }
  /**
   * Set the content of this Plane's [famous/src/core/Surface](#famous/src/core/Surface).
   * See [famous/src/core/Surface.setContent](#famous/src/core/Surface.setContent).
   */


  setContent() {
    const args = Array.prototype.splice.call(arguments, 0);
    return this.surface.setContent.apply(this.surface, args);
  }

}

exports.Plane = Plane;
var _default = Plane;
exports.default = _default;