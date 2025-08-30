import {signal} from 'classy-solid'
import {element} from '@lume/element'
import {RenderableBehavior} from './RenderableBehavior.js'
import {Mesh} from '../meshes/Mesh.js'
import {Points} from '../meshes/Points.js'
import {InstancedMesh} from '../meshes/InstancedMesh.js'
import {Line} from '../meshes/Line.js'

import type {BufferGeometry, Material} from 'three'

export type MeshComponentType = 'geometry' | 'material'

/**
 * @class MeshBehavior
 *
 * @extends RenderableBehavior
 */
export
abstract class MeshBehavior extends RenderableBehavior {
	declare parentElement: Mesh | Points | InstancedMesh | Line | null

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