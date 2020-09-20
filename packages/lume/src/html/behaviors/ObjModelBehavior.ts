import 'element-behaviors'
import {reactive, attribute, autorun, StopFunction} from '@lume/element'
import {disposeObjectTree, setRandomColorPhongMaterial, isRenderItem} from '../../utils/three'
import {OBJLoader} from '../../lib/three/OBJLoader'
import {MTLLoader} from '../../lib/three/MTLLoader'
import {Events} from '../../core/Events'
import {RenderableBehavior} from './RenderableBehavior'

import type {Object3D} from 'three/src/core/Object3D'
import type BaseMaterialBehavior from './BaseMaterialBehavior'

declare global {
	interface Element {
		behaviors: Map<string, unknown>
	}
}

@reactive
export default class ObjModelBehavior extends RenderableBehavior {
	@reactive @attribute obj = ''
	@reactive @attribute mtl = ''

	// TODO no any
	model: any = null
	objLoader: any
	mtlLoader: any

	protected static _observedProperties = ['obj', 'mtl', ...(RenderableBehavior._observedProperties || [])]

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
			firstRun = false

			// TODO We can update only the material or model specifically
			// instead of reloading the whole object.
			this.__loadObj()
		})

		this.__stopFns.push(stop)

		return true
	}

	unloadGL() {
		if (!super.unloadGL()) return false

		for (const stop of this.__stopFns) stop()

		this.__cleanupModel()

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

		this.model = null
	}

	private __loadObj() {
		const {obj, mtl, mtlLoader, objLoader} = this

		if (!obj) return

		if (mtl) {
			mtlLoader.setResourcePath(mtl.substr(0, mtl.lastIndexOf('/') + 1))

			mtlLoader.load(mtl, (materials: any) => {
				if (!this._glLoaded) return

				materials.preload()
				objLoader.setMaterials(materials)
				objLoader.load(obj, (model: any) => {
					if (!this._glLoaded) return

					this.__setModel(model)
				})
			})
		} else {
			objLoader.load(obj, (model: any) => {
				if (!this._glLoaded) return

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
			})
		}
	}

	private __setModel(model: any) {
		this.element.three.add((this.model = model))
		this.element.emit(Events.MODEL_LOAD, {format: 'obj', model: model})
		this.element.needsUpdate()
	}
}

elementBehaviors.define('obj-model', ObjModelBehavior)

export {ObjModelBehavior}
