import {signal} from 'classy-solid'
import {behavior} from '../Behavior.js'
import {RenderableBehavior} from '../RenderableBehavior.js'
import {Mesh} from '../../meshes/Mesh.js'
import {Points} from '../../meshes/Points.js'
import {InstancedMesh} from '../../meshes/InstancedMesh.js'
import {Line} from '../../meshes/Line.js'

import type {BufferGeometry, Material} from 'three'

export type MeshComponentType = 'geometry' | 'material'

/**
 * @class MeshBehavior
 *
 * @extends RenderableBehavior
 */
export {MeshBehavior}
@behavior
abstract class MeshBehavior extends RenderableBehavior {
	declare element: Mesh | Points | InstancedMesh | Line

	override requiredElementType(): (typeof Mesh | typeof Points | typeof InstancedMesh | typeof Line)[] {
		// At the moment, a "mesh" behavior can be used on Mesh, Points, or anything that has a geometry and a material.
		// XXX An alternative to using arrays with multiple types is we could branch the class
		// hierarchy to avoid arrays/unions.
		return [Mesh, Points, InstancedMesh, Line]
	}

	/**
	 * @protected
	 * @method _createComponent -
	 * Subclasses override this to create either a Material or a BufferGeometry.
	 * It is reactive, any reactive dependencies used in here will cause
	 * re-creation of the instance. Use `untrack` for cases where a dependency
	 * should not re-create the instance (in that case an additional effect may
	 * update the instance instead, while in other cases constructing a new
	 * object is the only (or easier) way).
	 *
	 * @returns {BufferGeometry | Material}
	 */
	_createComponent(): BufferGeometry | Material {
		throw new Error('`_createComponent()` is not implemented by subclass.')
	}

	/**
	 * The component that this behavior manages, either a Material, or a
	 * BufferGeometry.
	 */
	@signal meshComponent: ReturnType<this['_createComponent']> | null = null
}
