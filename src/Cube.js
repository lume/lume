/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Transform from 'famous/core/Transform';
import MouseSync from 'famous/inputs/MouseSync';
import TouchSync from 'famous/inputs/TouchSync';
import GenericSync from 'famous/inputs/GenericSync';

import Molecule from './Molecule';
import Plane from './Plane';

import forLength from 'army-knife/forLength';

/**
 * A scenegraph tree that lays things out in a cube form. The leaf nodes of the
 * scenegraph (the cube sides) are Molecules. Add anything to the leaf nodes
 * that a [famous/core/RenderNode](#famous/core/RenderNode) would normally accept.
 *
 * @class Cube
 * @extends Molecule
 */
export class Cube extends Molecule {

    /**
     * Create a new Cube.
     *
     * @constructor
     * @param {Number} cubeWidth The integer width of the cube.
     */
    constructor(cubeWidth) {
        super({size: cubeWidth});

        GenericSync.register({
            mouse: MouseSync,
            touch: TouchSync
        });

        this.cubeWidth = cubeWidth;

        this.cubeSideNodes = [];
        this.cubeSides = [];

        // TODO: v0.1.0: Put this in a function.
        forLength(6, this._createCubeSide.bind(this));
    }

    /**
     * Creates the 6 sides of the cube (the leafnodes of the scenegraph).
     *
     * TODO v0.1.0: Rename to CubeLayout.
     * TODO v0.1.0: Don't create Planes for each side, let the user specify their own content for each side using this.setChildren.
     *
     * @private
     * @param {Number} index The index (a integer between 0 and 5) that specifies which side to create.
     */
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
        sync.pipe(this.options.handler);

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

    /**
     * Set the content for the sides of the cube.
     *
     * @param {Array} children An array containing anything that a
     * [famous/core/RenderNode](#famous/core/RenderNode) would accept in it's `add` method. Only the
     * first 6 items are used, the rest are ignored.
     */
    setChildren(children) {
        forLength(6, function(index) {
            //this.cubeSideNodes[index].set(null); // TODO: how do we erase previous children?
            this.cubeSideNodes[index].add(children[index]);
        }.bind(this));
        return this;
    }
}
export default Cube;
