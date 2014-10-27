/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Transform from 'famous/core/Transform';
import Molecule from 'javascripts/components/Molecule';
import Plane from 'javascripts/components/Plane';

export class DoubleSidedPlane extends Molecule { // a basic building block.
    constructor(initialOptions) {
        super(initialOptions);

        this.children = [];
        this.plane1 = new Plane(this.options);
        this.plane1.transform.set(Transform.rotate(0,0,0));
        this.setOptions({properties: {background: 'orange'}});
        this.plane2 = new Plane(this.options);
        this.plane2.transform.set(Transform.rotate(0,Math.PI,0));

        this.children.push(this.plane1);
        this.children.push(this.plane2);
        this.add(this.plane2)
        this.add(this.plane1);
        this.plane1.pipe(this._.handler);
        this.plane2.pipe(this._.handler);

    }

    getContent() {
        return [this.plane1.getContent(), this.plane2.getContent()];
    }
    setContent(content) {
        this.plane1.setContent(content[0]);
        this.plane2.setContent(content[1]);
    }
}
export default DoubleSidedPlane;
