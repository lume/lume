import 'element-behaviors'
import type {ElementBehaviors} from 'element-behaviors'
import {stringAttribute} from '@lume/element'
import {onCleanup} from 'solid-js'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js'
import type {Object3D} from 'three/src/core/Object3D.js'
import type {Group} from 'three/src/objects/Group.js'
import {disposeObjectTree} from '../../../utils/three/dispose.js'
import {setRandomColorPhongMaterial} from '../../../utils/three/material.js'
import {isRenderItem} from '../../../utils/three/is.js'
import {behavior} from '../../Behavior.js'
import {receiver} from '../../PropReceiver.js'
import {Events} from '../../../core/Events.js'
import {ModelBehavior} from './ModelBehavior.js'
import type {MaterialBehavior} from '../materials/MaterialBehavior.js'
import {LoadEvent} from '../../../models/LoadEvent.js'
import {ObjModel} from '../../../models/ObjModel.js'
import {ErrorEvent, normalizeError} from '../../../models/ErrorEvent.js'

// TODO move this somewhere better, perhaps element-behaviors
declare global {
	interface Element extends ElementBehaviors {}
}

export type ObjModelBehaviorAttributes = 'obj' | 'mtl'

/**
 * A behavior containing the logic that loads OBJ models for `<lume-obj-model>`
 * elements.
 * @deprecated Don't use this behavior directly, instead use a `<lume-obj-model>` element.
 * @extends ModelBehavior
 */
export
@behavior
class ObjModelBehavior extends ModelBehavior {
	@stringAttribute @receiver obj = ''
	@stringAttribute @receiver mtl = ''

	/** @deprecated access `.threeModel` on the lume-obj-model element instead. */
	declare model?: Group

	declare element: ObjModel

	override requiredElementType() {
		return [ObjModel]
	}

	objLoader = (() => {
		const loader = new OBJLoader()
		loader.manager.onLoad = () => this.element.needsUpdate()
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
				if (this.element.threeModel) {
					disposeObjectTree(this.element.threeModel, {
						destroyMaterial: !this.#materialIsFromMaterialBehavior,
					})
				}
				this.#materialIsFromMaterialBehavior = false
				this.model = undefined
				this.element.threeModel = null
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
			progress =>
				version === this.#version &&
				(this.element.emit(Events.PROGRESS, progress), this.element.dispatchEvent(progress)),
			error => version === this.#version && this.#onError(error),
		)
	}

	#onError(error: unknown) {
		const message = `Failed to load ${this.element.tagName.toLowerCase()} with obj value "${this.obj}" and mtl value "${
			this.mtl
		}". See the following error.`
		console.warn(message)
		const err = normalizeError(error)
		console.error(err)
		this.element.emit(Events.MODEL_ERROR, err)
		this.element.dispatchEvent(new ErrorEvent(err))
	}

	#setModel(model: Group, hasMtl: boolean) {
		// If the OBJ model does not have an MTL, then use the material behavior if any.
		if (!hasMtl) {
			// TODO Simplify this by getting based on type.
			let materialBehavior = this.element.behaviors.get('basic-material') as MaterialBehavior
			if (!materialBehavior) materialBehavior = this.element.behaviors.get('phong-material') as MaterialBehavior
			if (!materialBehavior) materialBehavior = this.element.behaviors.get('standard-material') as MaterialBehavior
			if (!materialBehavior) materialBehavior = this.element.behaviors.get('lambert-material') as MaterialBehavior

			if (materialBehavior) {
				this.#materialIsFromMaterialBehavior = true

				// TODO this part only works on Mesh elements at the
				// moment. We will update the geometry and material
				// behaviors to work in tandem with or without a mesh
				// behavior, and other behaviors can use the geometry or
				// material features.
				model.traverse((child: Object3D) => {
					if (isRenderItem(child)) {
						child.material = materialBehavior.meshComponent || thro(new Error('Expected a material'))
					}
				})
			} else {
				// if no material, make a default one with random color
				setRandomColorPhongMaterial(model)
			}
		}

		this.element.three.add(model)
		this.model = model
		this.element.threeModel = model

		this.element.emit(Events.MODEL_LOAD, {format: 'obj', model})
		this.element.dispatchEvent(new LoadEvent())
		this.element.needsUpdate()
	}
}

if (globalThis.window?.document && !elementBehaviors.has('obj-model'))
	elementBehaviors.define('obj-model', ObjModelBehavior)

const thro = (err: any) => {
	throw err
}
