import {untrack, onCleanup, createEffect, on} from 'solid-js'
import {MeshBehavior, MeshComponentType} from './MeshBehavior.js'

import type {Material} from 'three/src/materials/Material.js'
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
export abstract class GeometryOrMaterialBehavior extends MeshBehavior {
	abstract type: MeshComponentType

	override loadGL() {
		console.log('LOAD GL', this.element.tagName + '#' + this.element.id)

		this.createEffect(() => this.resetMeshComponent())
	}

	resetMeshComponent(): void {
		// console.log('RESET MESH COMPONENT', this.element.tagName + '#' + this.element.id)
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

		// untrack in case we make .three is reactive
		untrack(() => {
			// @ts-expect-error not type safe, but shows what we intend
			this.element.three[this.type] = newComponent
		})

		// console.log(
		// 	'SET MESH COMPONENT',
		// 	this.element.tagName + '#' + this.element.id,
		// 	untrack(() => this.element.three),
		// )

		// createEffect(
		// 	on(
		// 		() => this.element.three,
		// 		() => {
		// 			console.error(
		// 				'TODO: element.three changed, needs new mesh component',
		// 				this.element.tagName + '#' + this.element.id,
		// 			)
		// 			debugger
		// 		},
		// 	),
		// )

		// @ts-expect-error
		this.meshComponent = newComponent
	}
}
