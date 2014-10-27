/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Surface from 'famous/core/Surface';
import Molecule from 'javascripts/components/Molecule';

export class Plane extends Molecule {
    constructor(initialOptions) {
        super(initialOptions);

        this.surface = new Surface(this.options);
        this.add(this.surface);
        this.surface.pipe(this._.handler);
    }

    // Surface interface
    getContent() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this.surface.getContent.apply(this.surface, args);
    }
    setContent() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this.surface.setContent.apply(this.surface, args);
    }
}
export default Plane;
