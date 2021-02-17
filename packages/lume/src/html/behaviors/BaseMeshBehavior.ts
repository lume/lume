import {BoxGeometry} from 'three/src/geometries/BoxGeometry.js'
import {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial.js'
import {RenderableBehavior} from './RenderableBehavior.js'
import Mesh from '../../core/Mesh.js'

import type {Material} from 'three/src/materials/Material.js'
import type {Geometry} from 'three/src/core/Geometry.js'

export type MeshComponentType = 'geometry' | 'material'

/**
 * Base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * _createComponent() - return a geometry or material instance.
 */
export default abstract class BaseMeshBehavior extends RenderableBehavior {
	abstract type: MeshComponentType

	requiredElementType() {
		return Mesh
	}

	element!: Mesh

	get glLoaded() {
		return this._glLoaded
	}

	get cssLoaded() {
		return this._cssLoaded
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
		if (this.element.three) this.__setDefaultComponent(this.element, this.type)
		else this.__disposeMeshComponent(this.element, this.type)
		this.element.needsUpdate()

		return true
	}

	resetMeshComponent() {
		// TODO We might have to defer so that calculatedSize is already calculated
		// (note, resetMeshComponent is only called when the size prop has
		// changed)
		this.__setMeshComponent(this.element, this.type, this._createComponent())
		this.element.needsUpdate()
	}

	getMeshComponent<T>(name: 'geometry' | 'material'): T {
		return (this.element.three[name] as unknown) as T
	}

	protected _createComponent(): Geometry | Material {
		throw new Error('`_createComponent()` is not implemented by subclass.')
	}

	// records the initial size of the geometry, so that we have a
	// reference for how much scale to apply when accepting new sizes from
	// the user.
	// TODO
	// private __initialSize: null,

	private __disposeMeshComponent(element: Mesh, name: 'geometry' | 'material') {
		// TODO handle material arrays
		if (element.three[name]) (element.three[name] as Geometry | Material).dispose()
	}

	private __setMeshComponent(element: Mesh, name: 'geometry' | 'material', newComponent: Geometry | Material) {
		this.__disposeMeshComponent(element, name)

		// the following type casting is not type safe, but shows what we intend
		// (we can't type this sort of JavaScript in TypeScript)
		element.three[name as 'geometry'] = newComponent as Geometry
		// or element.three[name as 'material'] = newComponent as Material
	}

	private __setDefaultComponent(element: Mesh, name: 'geometry' | 'material') {
		this.__setMeshComponent(element, name, this.__makeDefaultComponent(element, name))
	}

	private __makeDefaultComponent(element: Mesh, name: 'geometry' | 'material'): Geometry | Material {
		switch (name) {
			case 'geometry':
				return new BoxGeometry(element.calculatedSize.x, element.calculatedSize.y, element.calculatedSize.z)
			case 'material':
				return new MeshPhongMaterial({color: 0xff6600})
		}
	}
}

export {BaseMeshBehavior}
