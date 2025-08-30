import {stringAttribute, element} from '@lume/element'
import {onCleanup} from 'solid-js'
import {disposeObjectTree, setRandomColorPhongMaterial, isRenderItem} from '../../../utils/three.js'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js'
import {Events} from '../../../core/Events.js'
import {RenderableBehavior} from '../RenderableBehavior.js'
import {autoDefineElements} from '../../LumeConfig.js'

import type {Object3D} from 'three/src/core/Object3D.js'
import type {MaterialBehavior} from '../materials/MaterialBehavior.js'
import type {Group} from 'three/src/objects/Group.js'

export type ObjModelBehaviorAttributes = 'obj' | 'mtl'

export
@element('obj-model', autoDefineElements)
class ObjModelBehavior extends RenderableBehavior {
	@stringAttribute obj = ''
	@stringAttribute mtl = ''

	model?: Group

	objLoader = (() => {
		const loader = new OBJLoader()
		loader.manager.onLoad = () => this.parentElement!.needsUpdate()
		return loader
	})()

	mtlLoader = (() => {
		const loader = new MTLLoader(this.objLoader.manager)
		// Allow cross-origin images to be loaded.
		loader.crossOrigin = ''
		return loader
	})()

	// This is incremented any time we need to cancel a pending load() (f.e. on
	// src change, or on disconnect), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			this.mtl
			this.obj

			// TODO We can update only the material or model specifically
			// instead of reloading the whole object.
			this.#loadModel()

			onCleanup(() => {
				if (this.model) {
					disposeObjectTree(this.model, {
						destroyMaterial: !this.#materialIsFromMaterialBehavior,
					})
				}
				this.#materialIsFromMaterialBehavior = false
				this.model = undefined
				// Increment this in case the loader is still loading, so it will ignore the result.
				this.#version++
			})
		})
	}

	#materialIsFromMaterialBehavior = false

	#loadModel() {
		const {obj, mtl, mtlLoader, objLoader} = this
		const version = this.#version

		if (!obj) return

		if (mtl) {
			mtlLoader!.setResourcePath(mtl.substr(0, mtl.lastIndexOf('/') + 1))

			mtlLoader!.load(mtl, materials => {
				if (version !== this.#version) return

				materials.preload()

				objLoader!.setMaterials(materials)
				this.#loadObj(version, true)
			})
		} else {
			this.#loadObj(version, false)
		}
	}

	#loadObj(version: number, hasMtl: boolean) {
		this.objLoader!.load(
			this.obj,
			model => version == this.#version && this.#setModel(model, hasMtl),
			progress => version === this.#version && this.parentElement!.emit(Events.PROGRESS, progress),
			error => version === this.#version && this.#onError(error),
		)
	}

	#onError(error: unknown) {
		const message = `Failed to load ${this.parentElement!.tagName.toLowerCase()} with obj value "${this.obj}" and mtl value "${
			this.mtl
		}". See the following error.`
		console.warn(message)
		const err = error instanceof ErrorEvent && error.error ? error.error : error
		console.error(err)
		this.parentElement!.emit(Events.MODEL_ERROR, err)
	}

	#setModel(model: Group, hasMtl: boolean) {
		// If the OBJ model does not have an MTL, then use the material behavior if any.
		if (!hasMtl) {
			// Look for material behavior elements as children instead of behaviors
			let materialBehavior: MaterialBehavior | null = null
			
			// Check for material behavior elements in children
			const children = this.parentElement!.children
			for (let i = 0; i < children.length; i++) {
				const child = children[i]
				if (child instanceof HTMLElement && 
					(child.tagName.toLowerCase().includes('material') || 
					 child.classList?.contains('material-behavior') ||
					 child instanceof (globalThis as any).MaterialBehavior)) {
					materialBehavior = child as MaterialBehavior
					break
				}
			}

			if (materialBehavior) {
				this.#materialIsFromMaterialBehavior = true

				// TODO this part only works on Mesh elements at the
				// moment. We will update the geometry and material
				// behaviors to work in tandem with or without a mesh
				// behavior, and other behaviors can use the geometry or
				// material features.
				model.traverse((child: Object3D) => {
					if (isRenderItem(child)) {
						child.material = materialBehavior!.meshComponent || thro(new Error('Expected a material'))
					}
				})
			} else {
				// if no material, make a default one with random color
				setRandomColorPhongMaterial(model)
			}
		}

		this.model = model
		this.parentElement!.three.add(model)
		this.parentElement!.emit(Events.MODEL_LOAD, {format: 'obj', model})
		this.parentElement!.needsUpdate()
	}
}

const thro = (err: any) => {
	throw err
}