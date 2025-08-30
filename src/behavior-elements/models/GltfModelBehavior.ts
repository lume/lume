import {createEffect, createMemo, onCleanup, untrack} from 'solid-js'
import {attribute, booleanAttribute, stringAttribute, element} from '@lume/element'
import {Scene} from 'three/src/scenes/Scene.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import {GLTFLoader, type GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {Box3} from 'three/src/math/Box3.js'
import {Vector3} from 'three/src/math/Vector3.js'
import {disposeObjectTree} from '../../utils/three.js'
import {Events} from '../../core/Events.js'
import {RenderableBehavior} from '../RenderableBehavior.js'
import {autoDefineElements} from '../../LumeConfig.js'

/**
 * The recommended CDN for retrieving Draco decoder files.
 * More info: https://github.com/google/draco#wasm-and-javascript-decoders
 */
const defaultDracoDecoder = 'https://www.gstatic.com/draco/v1/decoders/'

/** One DRACOLoader per draco decoder URL. */
let dracoLoaders = new Map<string, {count: number; dracoLoader: DRACOLoader}>()

export type GltfModelBehaviorAttributes = 'src' | 'dracoDecoder' | 'centerGeometry'

/**
 * @class GltfModelBehavior -
 *
 * Element: `gltf-model`
 *
 * @extends RenderableBehavior
 * @element gltf-model
 */
export
@element('gltf-model', autoDefineElements)
class GltfModelBehavior extends RenderableBehavior {
	/** @property {string | null} src - Path to a `.gltf` or `.glb` file. */
	@attribute src: string | null = ''

	/**
	 * @property {string | null} dracoDecoder -
	 *
	 * `attribute`
	 *
	 * Path to the draco decoder that
	 * will unpack decode compressed assets of the GLTF file. This does not need
	 * to be supplied unless you explicitly know you need it.
	 */
	@stringAttribute dracoDecoder = defaultDracoDecoder

	/**
	 * @property {boolean} centerGeometry -
	 *
	 * `attribute`
	 *
	 * When `true`, all geometry of the
	 * loaded model will be centered at the local origin.
	 *
	 * Note, changing this value at runtime is expensive because the whole model
	 * will be re-created. We improve this by tracking the initial center
	 * position to revert to when centerGeometry goes back to `false` (PRs
	 * welcome!).
	 */
	@booleanAttribute centerGeometry = false

	loader = new GLTFLoader()
	model: GLTF | null = null

	// This is incremented any time we need to cancel a pending load() (f.e. on
	// src change, or on disconnect), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			const decoderPath = createMemo(() => this.dracoDecoder)

			createEffect(() => {
				if (!decoderPath()) return

				const dracoLoader = getDracoLoader(decoderPath())
				this.loader.dracoLoader = dracoLoader

				onCleanup(() => {
					disposeDracoLoader(decoderPath())
					this.loader.dracoLoader = null
				})
			})
		})

		this.createEffect(() => {
			this.src
			this.centerGeometry

			this.#loadModel()

			onCleanup(() => {
				if (this.model) disposeObjectTree(this.model.scene)
				this.model = null
				// Increment this in case the loader is still loading, so it will ignore the result.
				this.#version++
			})
		})
	}

	#loadModel() {
		const {src} = this
		const version = this.#version

		if (!src) return

		// In the following loader.load() callbacks, if #version doesn't
		// match, it means this.src or this.dracoDecoder changed while
		// a previous model was loading, in which case we ignore that
		// result and wait for the next model to load.

		this.loader.load(
			src,
			model => version === this.#version && this.#setModel(model),
			progress => version === this.#version && this.parentElement?.emit(Events.PROGRESS, progress),
			error => version === this.#version && this.#onError(error),
		)
	}

	#onError(error: unknown) {
		const message = `Failed to load ${this.parentElement?.tagName.toLowerCase()} with src "${
			this.src
		}". See the following error.`
		console.warn(message)
		const err = error instanceof ErrorEvent && error.error ? error.error : error
		console.error(err)
		this.parentElement?.emit(Events.MODEL_ERROR, err)
	}

	#setModel(model: GLTF) {
		this.model = model

		if (this.centerGeometry) {
			const box = new Box3()
			box.setFromObject(model.scene)
			const center = new Vector3()
			box.getCenter(center)
			model.scene.position.copy(center.negate())
		}

		// @ts-expect-error three property
		this.parentElement!.three.add(model.scene)
		this.parentElement?.emit(Events.MODEL_LOAD, {format: 'gltf', model})
		this.parentElement?.needsUpdate()
	}
}

function getDracoLoader(decoderPath: string): DRACOLoader {
	let info = dracoLoaders.get(decoderPath)

	if (!info) {
		info = {count: 0, dracoLoader: new DRACOLoader()}
		info.dracoLoader.setDecoderPath(decoderPath)
		dracoLoaders.set(decoderPath, info)
	}

	info.count++
	return info.dracoLoader
}

function disposeDracoLoader(decoderPath: string): void {
	const info = dracoLoaders.get(decoderPath)

	if (!info) return

	info.count--

	if (info.count === 0) {
		info.dracoLoader.dispose()
		dracoLoaders.delete(decoderPath)
	}
}