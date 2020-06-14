import {BoxGeometry, MeshPhongMaterial, Material, Geometry} from 'three'
import Behavior from './Behavior'
import {Events} from '../../core/Events'
import Mesh from '../../core/Mesh'

export type MeshComponentType = 'geometry' | 'material'

/**
 * Base class for Geometry and Material behaviors, not intended for direct use.
 *
 * Subclasses should implement:
 * _createComponent() - return a geometry or material instance.
 */
export default abstract class BaseMeshBehavior extends Behavior {
	abstract type: MeshComponentType

	// use a getter because Mesh is undefined at module evaluation time due
	// to a circular dependency.
	get requiredElementType() {
		return Mesh
	}

	element!: Mesh

	get glLoaded() {
		return this._glLoaded
	}

	get cssLoaded() {
		return this._cssLoaded
	}

	async connectedCallback() {
		super.connectedCallback()
		this.loadGL()
	}

	async disconnectedCallback() {
		super.disconnectedCallback()
		this.unloadGL()
	}

	loadGL() {
		if (!this.element.three) return

		if (this._glLoaded) return
		this._glLoaded = true

		this.resetMeshComponent()

		this.triggerUpdateForAllProps()
		this.element.needsUpdate()
	}

	unloadGL() {
		if (!this._glLoaded) return
		this._glLoaded = false

		// if the behavior is being disconnected, but the element still has GL
		// mode (.three), then leave the element with a default mesh GL
		// component to be rendered.
		if (this.element.three) this.__setDefaultComponent(this.element, this.type)
		else this.__disposeMeshComponent(this.element, this.type)
		this.element.needsUpdate()
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

	protected _glLoaded = false
	protected _cssLoaded = false

	protected _createComponent(): Geometry | Material {
		throw new Error('`_createComponent()` is not implemented by subclass.')
	}

	protected _listenToElement() {
		super._listenToElement()
		this.element.on(Events.BEHAVIOR_GL_LOAD, this.loadGL, this)
		this.element.on(Events.BEHAVIOR_GL_UNLOAD, this.unloadGL, this)
	}

	protected _unlistenToElement() {
		super._unlistenToElement()
		this.element.off(Events.BEHAVIOR_GL_LOAD, this.loadGL)
		this.element.off(Events.BEHAVIOR_GL_UNLOAD, this.unloadGL)
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
