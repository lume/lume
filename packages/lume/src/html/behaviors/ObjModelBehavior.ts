import 'element-behaviors'
import {reactive, stringAttribute, autorun, StopFunction} from '@lume/element'
import {disposeObjectTree, setRandomColorPhongMaterial, isRenderItem} from '../../utils/three.js'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js'
import {Events} from '../../core/Events.js'
import {RenderableBehavior} from './RenderableBehavior.js'

import type {Object3D} from 'three/src/core/Object3D.js'
import type BaseMaterialBehavior from './BaseMaterialBehavior.js'
import type {Group} from 'three/src/objects/Group.js'

// TODO move this somewhere better.
declare global {
	interface Element {
		behaviors: Map<string, unknown>
	}
}

export type ObjModelBehaviorAttributes = 'obj' | 'mtl'

@reactive
export default class ObjModelBehavior extends RenderableBehavior {
	@stringAttribute('') obj = ''
	@stringAttribute('') mtl = ''

	model?: Group
	objLoader?: OBJLoader
	mtlLoader?: MTLLoader

	static _observedProperties = ['obj', 'mtl', ...(RenderableBehavior._observedProperties || [])]

	// This is incremented any time we need a pending load() to cancel (f.e. on
	// src change, or unloadGL cycle), so that the loader will ignore the
	// result when a version change has happened.
	private __version = 0

	private __stopFns: StopFunction[] = []

	loadGL() {
		if (!super.loadGL()) return false

		this.objLoader = new OBJLoader() // TODO types for loaders
		this.mtlLoader = new MTLLoader(this.objLoader.manager)
		// Allow cross-origin images to be loaded.
		this.mtlLoader.crossOrigin = ''

		this.objLoader.manager.onLoad = () => {
			this.element.needsUpdate()
		}

		let firstRun = true

		const stop = autorun(() => {
			this.mtl
			this.obj

			if (!firstRun) this.__cleanupModel()

			this.__version++
			// TODO We can update only the material or model specifically
			// instead of reloading the whole object.
			this.__loadObj()
		})

		firstRun = false

		this.__stopFns.push(stop)

		return true
	}

	unloadGL() {
		if (!super.unloadGL()) return false

		for (const stop of this.__stopFns) stop()
		this.__stopFns.length = 0

		this.__cleanupModel()

		// Increment this in case the loader is still loading, so it will ignore the result.
		this.__version++

		return true
	}

	private __materialIsFromMaterialBehavior = false

	private __cleanupModel() {
		if (this.model) {
			disposeObjectTree(this.model, {
				destroyMaterial: !this.__materialIsFromMaterialBehavior,
			})
		}

		this.__materialIsFromMaterialBehavior = false

		this.model = undefined
	}

	private __loadObj() {
		const {obj, mtl, mtlLoader, objLoader, __version} = this

		if (!obj) return

		if (mtl) {
			mtlLoader!.setResourcePath(mtl.substr(0, mtl.lastIndexOf('/') + 1))

			mtlLoader!.load(mtl, materials => {
				if (__version !== this.__version) return

				materials.preload()

				objLoader!.setMaterials(materials)
				objLoader!.load(obj, model => {
					if (__version !== this.__version) return

					this.__setModel(model)
				})
			})
		} else {
			objLoader!.load(
				obj,
				model => {
					if (__version !== this.__version) return

					// TODO Simplify this by getting based on type.
					let materialBehavior = this.element.behaviors.get('basic-material') as BaseMaterialBehavior
					if (!materialBehavior)
						materialBehavior = this.element.behaviors.get('phong-material') as BaseMaterialBehavior
					if (!materialBehavior)
						materialBehavior = this.element.behaviors.get('standard-material') as BaseMaterialBehavior
					if (!materialBehavior)
						materialBehavior = this.element.behaviors.get('lambert-material') as BaseMaterialBehavior

					if (materialBehavior) {
						this.__materialIsFromMaterialBehavior = true

						// TODO this part only works on Mesh elements at the
						// moment. We will update the geometry and material
						// behaviors to work in tandem with or without a mesh
						// behavior, and other behaviors can use the geometry or
						// material features.
						model.traverse((child: Object3D) => {
							if (isRenderItem(child)) {
								child.material = materialBehavior.getMeshComponent('material')
							}
						})
					} else {
						// if no material, make a default one with random color
						setRandomColorPhongMaterial(model)
					}

					this.__setModel(model)
				},
				progress => __version === this.__version && this.element.emit(Events.PROGRESS, progress),
				error => __version === this.__version && this.__onError(error),
			)
		}
	}

	private __onError(error: ErrorEvent) {
		const message =
			error?.message ??
			`Failed to load ${this.element.tagName.toLowerCase()} with obj value "${this.obj}" and mtl value "${
				this.mtl
			}".`

		console.warn(message)
		this.element.emit(Events.MODEL_ERROR, error.error)
	}

	private __setModel(model: Group) {
		this.model = model
		this.element.three.add(model)
		this.element.emit(Events.MODEL_LOAD, {format: 'obj', model})
		this.element.needsUpdate()
	}
}

elementBehaviors.define('obj-model', ObjModelBehavior)

export {ObjModelBehavior}
