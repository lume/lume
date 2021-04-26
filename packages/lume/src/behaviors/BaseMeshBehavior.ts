import {BoxGeometry} from 'three/src/geometries/BoxGeometry.js'
import {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial.js'
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
export abstract class BaseMeshBehavior extends RenderableBehavior {
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

		// if the behavior is being disconnected, but the element still has GL
		// mode (.three), then leave the element with a default mesh GL
		// component to be rendered.
		if (this.element.three) this.#setDefaultComponent(this.element, this.type)
		else this.#disposeMeshComponent(this.element, this.type)
		this.element.needsUpdate()

		return true
	}

	resetMeshComponent() {
		// TODO We might have to defer so that calculatedSize is already calculated
		// (note, resetMeshComponent is only called when the size prop has
		// changed)
		this.#setMeshComponent(this.element, this.type, this._createComponent())
		this.element.needsUpdate()
	}

	getMeshComponent<T>(name: 'geometry' | 'material'): T {
		return (this.element.three[name] as unknown) as T
	}

	_createComponent(): BufferGeometry | Geometry | Material {
		throw new Error('`_createComponent()` is not implemented by subclass.')
	}

	// records the initial size of the geometry, so that we have a
	// reference for how much scale to apply when accepting new sizes from
	// the user.
	// TODO
	// #initialSize: null,

	#disposeMeshComponent(element: Mesh | Points, name: 'geometry' | 'material') {
		// TODO handle material arrays
		if (element.three[name]) (element.three[name] as Geometry | Material).dispose()
	}

	#setMeshComponent(
		element: Mesh | Points,
		name: 'geometry' | 'material',
		newComponent: BufferGeometry | Geometry | Material,
	) {
		this.#disposeMeshComponent(element, name)

		// the following type casting is not type safe, but shows what we intend
		// (we can't type this sort of JavaScript in TypeScript)
		element.three[name as 'geometry'] = newComponent as Geometry
		// or element.three[name as 'material'] = newComponent as Material
	}

	#setDefaultComponent(element: Mesh | Points, name: 'geometry' | 'material') {
		this.#setMeshComponent(element, name, this.#makeDefaultComponent(element, name))
	}

	#makeDefaultComponent(element: Mesh | Points, name: 'geometry' | 'material'): Geometry | Material {
		switch (name) {
			case 'geometry':
				return new BoxGeometry(element.calculatedSize.x, element.calculatedSize.y, element.calculatedSize.z)
			case 'material':
				return new MeshPhongMaterial({color: 0xff6600})
		}
	}
}
