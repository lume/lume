// import {reactive, untrack} from '@lume/variable'
import {MeshBehavior, MeshComponentType} from './MeshBehavior.js'

import type {Material} from 'three/src/materials/Material.js'
import type {Geometry} from 'three/src/core/Geometry.js'
import type {BufferGeometry} from 'three/src/core/BufferGeometry.js'

/**
 * @class GeometryOrMaterialBehavior
 * Abstract base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * _createComponent() - return a geometry or material instance.
 *
 * @extends MeshBehavior
 */

// @reactive
export abstract class GeometryOrMaterialBehavior extends MeshBehavior {
	abstract type: MeshComponentType

	loadGL() {
		this.resetMeshComponent()
		this.element.needsUpdate()
	}

	unloadGL() {
		this.#disposeMeshComponent()
		this.element.needsUpdate()
	}

	resetMeshComponent(): void {
		// Reactivity enables the remove of the following TODO. So nice. No deferring, just use what you need (f.e. calculatedSize).
		// TODO We might have to defer so that calculatedSize is already calculated
		// (note, this method is called when the size or sizeMode prop of subclasses has
		// changed)
		this.#disposeMeshComponent()
		this.#setMeshComponent()
		this.element.needsUpdate()
	}

	_createComponent(): BufferGeometry | Geometry | Material {
		throw new Error('`_createComponent()` is not implemented by subclass.')
	}

	// records the initial size of the geometry, so that we have a
	// reference for how much scale to apply when accepting new sizes from
	// the user.
	// TODO
	// #initialSize: null,

	#disposeMeshComponent() {
		// TODO handle material arrays
		this.meshComponent?.dispose()
		this.meshComponent = undefined
	}

	#setMeshComponent() {
		const newComponent = this._createComponent()
		// @ts-expect-error not type safe, but shows what we intend
		this.element.three[this.type] = newComponent
		// @ts-expect-error
		this.meshComponent = newComponent
	}
}
