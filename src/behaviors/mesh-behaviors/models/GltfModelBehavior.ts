import 'element-behaviors'
import {reactive, attribute, booleanAttribute} from '../../attribute.js'
import {Scene} from 'three/src/scenes/Scene.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {Box3} from 'three/src/math/Box3.js'
import {Vector3} from 'three/src/math/Vector3.js'
import {disposeObjectTree} from '../../../utils/three.js'
import {Events} from '../../../core/Events.js'
import {RenderableBehavior} from '../../RenderableBehavior.js'

import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js'

export type GltfModelBehaviorAttributes = 'src' | 'dracoDecoder' | 'centerGeometry'

@reactive
export class GltfModelBehavior extends RenderableBehavior {
	/** @property {string | null} src - Path to a `.gltf` or `.glb` file. */
	@attribute src: string | null = ''

	/**
	 * @attribute
	 * @property {string | null} dracoDecoder - Path to the draco decoder that
	 * will unpack decode compressed assets of the GLTF file. This does not need
	 * to be supplied unless you explicitly know you need it.
	 */
	@attribute dracoDecoder: string | null = ''

	/**
	 * @attribute
	 * @property {boolean} centerGeometry - When `true`, all geometry of the
	 * loaded model will be centered at the local origin.
	 */
	@booleanAttribute(false) centerGeometry = false

	dracoLoader?: DRACOLoader
	gltfLoader?: GLTFLoader
	model: GLTF | null = null

	// This is incremented any time we need a pending load() to cancel (f.e. on
	// src change, or unloadGL cycle), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	loadGL() {
		this.dracoLoader = new DRACOLoader()
		this.gltfLoader = new GLTFLoader()
		this.gltfLoader.setDRACOLoader(this.dracoLoader)

		let firstRun = true

		this.createEffect(() => {
			if (this.dracoDecoder) {
				if (!firstRun) this.dracoLoader!.dispose()
				this.dracoLoader!.setDecoderPath(this.dracoDecoder)
			}
		})

		this.createEffect(() => {
			this.src
			this.dracoDecoder
			this.centerGeometry

			this.#cleanupModel()

			this.#version++
			this.#loadModel()
		})

		firstRun = false
	}

	unloadGL() {
		this.gltfLoader = undefined
		this.dracoLoader?.dispose()
		this.dracoLoader = undefined

		this.#cleanupModel()

		// Increment this in case the loader is still loading, so it will ignore the result.
		this.#version++
	}

	#cleanupModel() {
		if (this.model) disposeObjectTree(this.model.scene)
		this.model = null
	}

	#loadModel() {
		const {src} = this
		const version = this.#version

		if (!src) return

		// In the following gltfLoader.load() callbacks, if #version doesn't
		// match, it means this.src or this.dracoDecoder changed while
		// a previous model was loading, in which case we ignore that
		// result and wait for the next model to load.

		this.gltfLoader!.load(
			src,
			model => version == this.#version && this.#setModel(model),
			progress => version == this.#version && this.element.emit(Events.PROGRESS, progress),
			error => version == this.#version && this.#onError(error),
		)
	}

	#onError(error: ErrorEvent | Error) {
		const message = `Failed to load ${this.element.tagName.toLowerCase()} with src "${
			this.src
		}" and dracoDecoder "${this.dracoDecoder}". See the following error.`
		console.warn(message)
		const err = error instanceof ErrorEvent && error.error ? error.error : error
		console.error(err)
		this.element.emit(Events.MODEL_ERROR, err)
	}

	#setModel(model: GLTF) {
		this.model = model
		model.scene = model.scene || new Scene().add(...model.scenes)

		if (this.centerGeometry) {
			const box = new Box3()
			box.setFromObject(model.scene)
			const center = new Vector3()
			box.getCenter(center)
			model.scene.position.copy(center.negate())
		}

		this.element.three.add(model.scene)
		this.element.emit(Events.MODEL_LOAD, {format: 'gltf', model})
		this.element.needsUpdate()
	}
}

if (!elementBehaviors.has('gltf-model')) elementBehaviors.define('gltf-model', GltfModelBehavior)
