/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Modifier from 'famous/core/Modifier';
import Surface from 'famous/core/Surface';
import Transform from 'famous/core/Transform';
import MouseSync from 'famous/inputs/MouseSync';
import TouchSync from 'famous/inputs/TouchSync';
import GenericSync from 'famous/inputs/GenericSync';
    GenericSync.register({
        mouse: MouseSync,
        touch: TouchSync
    });

import Molecule from 'javascripts/components/Molecule';
import Plane from 'javascripts/components/Plane';

import forLength from 'javascripts/utils/forLength';

export class Cube extends Molecule { // a scenegraph tree that lays things out in a cube. The leaf nodes are Modifiers (the sides of the cube). Put stuff in them.
    constructor(cubeWidth) {
        super({size: cubeWidth});
        this.cubeWidth = cubeWidth;

        this.cubeSideNodes = [];
        this.cubeSides = [];

        forLength(6, this._createCubeSide.bind(this));
    }

    _createCubeSide(index) {
        var T = Transform;
        var sideMol = new Molecule();
        var side = new Plane({
            size: [this.cubeWidth,this.cubeWidth],
            properties: {
                background: 'pink',
                backfaceVisibility: 'visible'
            }
        });
        var sync = new GenericSync(['mouse','touch']);

        this.cubeSides.push(side);

        side.pipe(sync);
        sync.pipe(this._.handler);

        // rotate and place each side.
        if (index < 4) { // sides
            sideMol.modifier.transformFrom( T.multiply(T.rotate(0, (Math.PI/2)*index, 0), T.translate(0,0,this.cubeWidth/2)));
        }
        else { // top/bottom
            sideMol.modifier.transformFrom( T.multiply(T.rotate( (Math.PI/2)*(index%2?-1:1), 0, 0), T.translate(0,0,this.cubeWidth/2)));
        }

        this.cubeSideNodes.push(
            this.add(sideMol)
        );
        sideMol.add(side);
    }

    setChildren(children) {
        forLength(6, function(index) {
            //this.cubeSideNodes[index].set(null); // TODO: how do we erase previous children?
            this.cubeSideNodes[index].add(children[index]);
        }.bind(this));
        return this;
    }
}
export default Cube;
