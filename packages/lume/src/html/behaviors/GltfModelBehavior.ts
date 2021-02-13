import 'element-behaviors'
import {reactive, attribute, autorun} from '@lume/element'
import {Scene} from 'three/src/scenes/Scene'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {disposeObjectTree} from '../../utils/three'
import {Events} from '../../core/Events'
import {RenderableBehavior} from './RenderableBehavior'

import type {StopFunction} from '@lume/element'
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader'

@reactive
export default class GltfModelBehavior extends RenderableBehavior {
	@attribute src = ''
	@attribute dracoDecoderPath = ''
	dracoLoader?: DRACOLoader
	gltfLoader?: GLTFLoader
	model: GLTF | null = null

	protected static _observedProperties = ['src', 'dracoPath', ...(RenderableBehavior._observedProperties || [])]

	private __version = 0

	private __stopFns: StopFunction[] = []

	loadGL() {
		if (!super.loadGL()) return false

		this.dracoLoader = new DRACOLoader()
		this.gltfLoader = new GLTFLoader()
		this.gltfLoader.setDRACOLoader(this.dracoLoader)

		let firstRun = true

		this.__stopFns.push(
			autorun(() => {
				this.src
				if (this.dracoDecoderPath) {
					if (!firstRun) this.dracoLoader?.dispose()
					this.dracoLoader!.setDecoderPath(this.dracoDecoderPath)
				}
			}),
			autorun(() => {
				this.src
				this.dracoDecoderPath

				if (!firstRun) this.__cleanupModel()

				// TODO We can update only the material or model specifically
				// instead of reloading the whole object.
				this.__version++
				this.__loadObj()
			}),
		)

		firstRun = false

		return true
	}

	unloadGL() {
		if (!super.unloadGL()) return false

		for (const stop of this.__stopFns) stop()

		this.gltfLoader = undefined
		this.dracoLoader?.dispose()
		this.dracoLoader = undefined

		this.__cleanupModel()

		return true
	}

	private __cleanupModel() {
		if (this.model) disposeObjectTree(this.model.scene)
		this.model = null
	}

	private __loadObj() {
		const {src, dracoDecoderPath, __version} = this

		if (!src) return

		// In the followinggltfLoader.load() callbacks, if __version doesn't
		// match, it means this.src or this.dracoDecoderPath changed while
		// a previous model was loading, in which case we ignore that
		// result and wait for the next model to load.

		this.gltfLoader!.load(
			src,
			model => __version == this.__version && this.__setModel(model),
			progress => __version == this.__version && this.element.emit(Events.PROGRESS, progress),
			error => __version == this.__version && this.__onError(src, dracoDecoderPath, error),
		)
	}

	private __onError(src: string, dracoDecoderPath: string, error: ErrorEvent) {
		const message =
			error?.message ?? `Failed to load <gltf-model> with src "${src}" and dracoDecoderPath "${dracoDecoderPath}"`
		console.warn(message)
		this.element.emit(Events.GLTF_ERROR, {src, dracoDecoderPath})
	}

	private __setModel(model: GLTF) {
		this.model = model
		model.scene = model.scene || new Scene().add(...model.scenes)
		this.element.three.add(model.scene)
		this.element.emit(Events.GLTF_LOAD, {model})
		this.element.needsUpdate()
	}
}

elementBehaviors.define('gltf-model', GltfModelBehavior)

export {GltfModelBehavior}
