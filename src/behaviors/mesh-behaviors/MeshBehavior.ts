import {RenderableBehavior} from '../RenderableBehavior.js'
import {Mesh} from '../../meshes/Mesh.js'
import {Points} from '../../meshes/Points.js'
import {InstancedMesh} from '../../meshes/InstancedMesh.js'

import type {BufferGeometry, Geometry, Material} from 'three'

export type MeshComponentType = 'geometry' | 'material'

/**
 * @class MeshBehavior
 *
 * @extends RenderableBehavior
 */
export abstract class MeshBehavior extends RenderableBehavior {
	requiredElementType(): (typeof Mesh | typeof Points | typeof InstancedMesh)[] {
		// At the moment, a "mesh" behavior can be used on Mesh, Points, or anything that has a geometry and a material.
		// XXX An alternative to using arrays with multiple types is we could branch the class
		// hierarchy to avoid arrays/unions.
		return [Mesh, Points, InstancedMesh]
	}

	_createComponent(): BufferGeometry | Geometry | Material {
		throw new Error('`_createComponent()` is not implemented by subclass.')
	}

	meshComponent?: ReturnType<this['_createComponent']>
}
