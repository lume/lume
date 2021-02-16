import forLength from 'army-knife/forLength.js'
import Node from '../core/Node.js'

// !! WIP under construction

/**
 * @extends Node
 * @class Cube - A scenegraph tree that lays things out in a cube form.@
 *
 * TODO: extend from lume-mesh, using a Cube geometry? Or perhaps this is a CubeLayout, not necessarily a Cube mesh.
 * TODO: this is written imperatively. How would it be declaratively?
 */
export default class Cube extends Node {
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
		super({size: [size, size, size], ...options})

		//GenericSync.register({
		//mouse: MouseSync,
		//touch: TouchSync
		//});

		forLength(6, n => this._createCubeSide(n))
	}

	/**
	 * @method createCubeSide - Creates one side of the cube.
	 * @param {number} index - A number between 0 and 5 specifying which side to create.
	 * @param {string} name - The name of the side.
	 */
	_createCubeSide(index: number) {
		const rotator = new Node({
			align: [0.5, 0.5],
			mountPoint: [0.5, 0.5],
		})

		const side = new Node({
			align: [0.5, 0.5],
			mountPoint: [0.5, 0.5],
			size: [this.size, this.size],
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
			rotator.rotation.y = 90 * index
		// top/bottom
		else rotator.rotation.x = 90 * (index % 2 ? -1 : 1)

		side.position.z = this.size.x / 2

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
		forLength(6, index => {
			//this.cubeSideNodes[index].set(null); // TODO: how do we erase previous content?
			this.sides[index].add(content[index])
		})
		return this
	}
}

export {Cube}
