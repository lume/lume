import {Node} from '../core/Node.js'
import {XYZNonNegativeValues} from '../xyz-values/XYZNonNegativeValues.js'
import {XYZNumberValues} from '../xyz-values/XYZNumberValues.js'

// !! WIP under construction

/* TODO
 * @extends Node
 * @class Cube -
 * > :construction: :hammer: Under construction! :hammer: :construction:
 *
 * A scenegraph tree that lays things out in a cube form.@
 */
// TODO: This is written imperatively. How would it be declaratively?
// TODO: Make an example.
export class CubeLayout extends Node {
	/**
	 * @property {Node[]} sides - An array of the cube's side nodes. Each side is a node in the scene graph tree.
	 */
	sides: Node[] = []

	/**
	 * @constructor - Create a new Cube with the given `size` applied to all sides.
	 * @param {Number} size The size width of the sides of the cube.
	 */
	constructor(size: number, options: object) {
		// cubes, the same size on all sides
		super()

		this.set({size: new XYZNonNegativeValues(size, size, size), ...options})

		//GenericSync.register({
		//mouse: MouseSync,
		//touch: TouchSync
		//});

		for (let n = 0; n < 6; n += 1) this._createCubeSide(n)
	}

	/**
	 * @method createCubeSide - Creates one side of the cube.
	 * @param {number} index - A number between 0 and 5 specifying which side to create.
	 * @param {string} name - The name of the side.
	 */
	_createCubeSide(index: number) {
		const rotator = new Node().set({
			alignPoint: new XYZNumberValues(0.5, 0.5),
			mountPoint: new XYZNumberValues(0.5, 0.5),
		})

		const side = new Node().set({
			alignPoint: new XYZNumberValues(0.5, 0.5),
			mountPoint: new XYZNumberValues(0.5, 0.5),
			size: new XYZNonNegativeValues(this.getSize().x, this.getSize().x),
		})

		this.sides.push(side)

		rotator.add(side)

		// TODO: make a new GenericSync-like thing based on Famous?
		//const sync = new GenericSync(['mouse','touch']);
		//side.pipe(sync);
		//sync.pipe(this.options.handler);

		// rotate and place each side.
		if (index < 4)
			// 4 sides
			rotator.getRotation().y = 90 * index
		// top/bottom
		else rotator.getRotation().x = 90 * (index % 2 ? -1 : 1)

		side.getPosition().z = this.getSize().x / 2

		this.add(rotator)
	}

	/**
	 * @method setContent - Set the content for the sides of the cube.
	 * @param {Array<Node>} content - An array containing [Node](../core/Node)
	 * instances to place in the cube sides. Only the first 6 items are used,
	 * the rest are ignored.
	 * @returns {this}
	 */
	setContent(content: Node[]) {
		for (let index = 0; index < 6; index += 1) {
			//this.cubeSideNodes[index].set(null); // TODO: how do we erase previous content?
			this.sides[index].add(content[index])
		}
		return this
	}
}
