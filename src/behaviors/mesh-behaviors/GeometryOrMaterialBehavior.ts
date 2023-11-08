import {untrack, onCleanup} from 'solid-js'
import {MeshBehavior, type MeshComponentType} from './MeshBehavior.js'

import type {Material} from 'three/src/materials/Material.js'
import type {BufferGeometry} from 'three/src/core/BufferGeometry.js'

/**
 * @class GeometryOrMaterialBehavior
 * Abstract base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * _createComponent() - return a BufferGeometry or Material instance.
 *
 * @extends MeshBehavior
 */
export abstract class GeometryOrMaterialBehavior extends MeshBehavior {
	abstract type: MeshComponentType

	override loadGL() {
		this.createEffect(() => this.resetMeshComponent())
	}

	resetMeshComponent(): void {
		this.#setMeshComponent()
		this.element.needsUpdate()

		onCleanup(this.#disposeMeshComponent)
	}

	override _createComponent(): BufferGeometry | Material {
		throw new Error('`_createComponent()` is not implemented by subclass.')
	}

	// records the initial size of the geometry, so that we have a
	// reference for how much scale to apply when accepting new sizes from
	// the user.
	// TODO
	// #initialSize: null,

	#disposeMeshComponent = () => {
		// TODO handle material arrays
		this.meshComponent?.dispose()
		this.meshComponent = null
	}

	#setMeshComponent() {
		const newComponent = this._createComponent()

		// untrack in case we make .three reactive later
		untrack(() => {
			// @ts-expect-error FIXME
			this.element.three[this.type] = newComponent
		})

		// @ts-expect-error
		this.meshComponent = newComponent
	}
}
