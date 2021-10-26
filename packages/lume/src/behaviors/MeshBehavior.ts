import {RenderableBehavior} from './RenderableBehavior.js'
import {Mesh} from '../meshes/Mesh.js'
import {Points} from '../meshes/Points.js'

import type {Material} from 'three/src/materials/Material.js'
import type {Geometry} from 'three/src/core/Geometry.js'
import type {BufferGeometry} from 'three/src/core/BufferGeometry.js'

export type MeshComponentType = 'geometry' | 'material'

/**
 * Base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * _createComponent() - return a geometry or material instance.
 */
export abstract class MeshBehavior extends RenderableBehavior {
	abstract type: MeshComponentType

	requiredElementType() {
		// At the moment, a "mesh" behavior can be used on Mesh, Points, or anything that has a geometry and a material.
		// XXX An alternative to using arrays with multiple types is we could branch the class
		// hierarchy to avoid arrays/unions.
		return [Mesh, Points]
	}

	loadGL() {
		if (!super.loadGL()) return false

		this.resetMeshComponent()
		this.element.needsUpdate()

		return true
	}

	unloadGL() {
		if (!super.unloadGL()) return false

		this.#disposeMeshComponent(this.type)
		this.element.needsUpdate()

		return true
	}

	resetMeshComponent() {
		// TODO We might have to defer so that calculatedSize is already calculated
		// (note, this method is called when the size or sizeMode prop of subclasses has
		// changed)
		this.#setMeshComponent(this.type, this._createComponent())
		this.element.needsUpdate()
	}

	getMeshComponent<T>(name: 'geometry' | 'material'): T {
		return this.element.three[name] as unknown as T
	}

	_createComponent(): BufferGeometry | Geometry | Material {
		throw new Error('`_createComponent()` is not implemented by subclass.')
	}

	// records the initial size of the geometry, so that we have a
	// reference for how much scale to apply when accepting new sizes from
	// the user.
	// TODO
	// #initialSize: null,

	#disposeMeshComponent(name: 'geometry' | 'material') {
		// TODO handle material arrays
		if (this.element.three[name]) (this.element.three[name] as Geometry | Material).dispose()
	}

	#setMeshComponent(name: 'geometry' | 'material', newComponent: BufferGeometry | Geometry | Material) {
		this.#disposeMeshComponent(name)

		// the following type casting is not type safe, but shows what we intend
		// (we can't type this sort of JavaScript in TypeScript)
		this.element.three[name as 'geometry'] = newComponent as Geometry
		// or element.three[name as 'material'] = newComponent as Material
	}
}
