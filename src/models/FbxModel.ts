import {stringAttribute, booleanAttribute, element, type ElementAttributes} from '@lume/element'
import {createEffect, createMemo, onCleanup, untrack} from 'solid-js'
import type {Group} from 'three/src/objects/Group.js'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js'
import {Box3} from 'three/src/math/Box3.js'
import {Vector3} from 'three/src/math/Vector3.js'
import {Element3D, type Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'
import {disposeObjectTree} from '../utils/three.js'
import {Events} from '../core/Events.js'

export type FbxModelAttributes = Element3DAttributes | 'src' | 'centerGeometry'

/**
 * @element lume-fbx-model
 * @class FbxModel -
 *
 * Defines the `<lume-fbx-model>` element for loading 3D models in the
 * FBX format (`.fbx` files).
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene webgl>
 *   <lume-fbx-model id="myModel" src="path/to/model.fbx"></lume-fbx-model>
 * </lume-scene>
 * <script>
 *   myModel.on('MODEL_LOAD', () => console.log('loaded'))
 * </script>
 * ```
 *
 * JavaScript Example:
 *
 * ```js
 * const scene = new Scene
 * scene.webgl = true
 * document.body.append(scene)
 * const model = new FbxModel
 * model.src = 'path/to/model.fbx'
 * model.on('MODEL_LOAD', () => console.log('loaded'))
 * scene.add(model)
 * ```
 */
export
@element('lume-fbx-model', autoDefineElements)
class FbxModel extends Element3D {
	/** Path to a .fbx file. */
	@stringAttribute src = ''

	/**
	 * @attribute
	 * @property {boolean} centerGeometry - When `true`, all geometry of the
	 * loaded model will be centered at the local origin.
	 *
	 * Note, changing this value at runtime is expensive because the whole model
	 * will be re-created. We improve this by tracking the initial center
	 * position to revert to when centerGeometry goes back to `false` (PRs
	 * welcome!).
	 */
	@booleanAttribute centerGeometry = false

	loader = new FBXLoader()
	model?: Group

	// This is incremented any time we need to cancel a pending load() (f.e. on
	// src change, or on disconnect), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			// Using memos here because re-creating models on same-value updates
			// would cost a lot.
			// TODO memoize in other model classes like we do here.
			const src = createMemo(() => this.src) // TODO use @memo from classy-solid
			const center = createMemo(() => this.centerGeometry)

			createEffect(() => {
				src()
				center()

				untrack(() => this.#loadModel())

				onCleanup(() => {
					if (this.model) disposeObjectTree(this.model)
					this.model = undefined
					// Increment this in case the loader is still loading, so it will ignore the result.
					this.#version++
				})
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
			progress => version === this.#version && this.emit(Events.PROGRESS, progress),
			error => version === this.#version && this.#onError(error),
		)
	}

	#onError(error: unknown) {
		const message = `Failed to load ${this.tagName.toLowerCase()} with src "${this.src}". See the following error.`
		console.warn(message)
		const err = error instanceof ErrorEvent && error.error ? error.error : error
		console.error(err)
		this.emit(Events.MODEL_ERROR, err)
	}

	#setModel(model: Group) {
		this.model = model

		if (this.centerGeometry) {
			const box = new Box3()
			box.setFromObject(model)
			const center = new Vector3()
			box.getCenter(center)
			model.position.copy(center.negate())
		}

		this.three.add(model)
		this.emit(Events.MODEL_LOAD, {format: 'fbx', model})
		this.needsUpdate()
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-fbx-model': ElementAttributes<FbxModel, FbxModelAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-fbx-model': FbxModel
	}
}
