/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Surface from 'famous/core/Surface';

import Molecule from './Molecule';

/**
 * Planes have the properties of [Molecules](#Molecule), plus they contain a
 * [famous/core/Surface](#famous/core/Surface) so that they ultimately render
 * onto the screen. A Surface's events are automatically piped to it's
 * [famous/core/EventHandler](#famous/core/EventHandler), inherited from
 * `Molecule`.
 *
 * @class Plane
 * @extends Molecule
 */
export class Plane extends Molecule {

    /**
     * Creates a new `Plane`. Properties from the `initialOptions` parameter
     * are applied to this Plane's [famous/core/Surface](#famous/core/Surface) as well as to
     * to this Plane's [famous/core/Modifier](#famous/core/Modifier), hence the API of a Plane
     * is currently the combination of the Famo.us `Modifier` and `Surface` APIs.
     *
     * @constructor
     * @param {Object} initialOptions Options for the new Plane.
     */
    constructor(initialOptions) {
        super(initialOptions);

        this.surface = new Surface(this.options);
        this.add(this.surface);
        this.surface.pipe(this.options.handler);
    }

    /**
     * Get the content of this Plane's [famous/core/Surface](#famous/core/Surface).
     * See [famous/core/Surface.getContent](#famous/core/Surface.getContent).
     */
    getContent() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this.surface.getContent.apply(this.surface, args);
    }

    /**
     * Set the content of this Plane's [famous/core/Surface](#famous/core/Surface).
     * See [famous/core/Surface.setContent](#famous/core/Surface.setContent).
     */
    setContent() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this.surface.setContent.apply(this.surface, args);
    }
}
export default Plane;
