import {stringAttribute, element, type ElementAttributes} from '@lume/element'
import {onCleanup} from 'solid-js'
import {TDSLoader} from 'three/examples/jsm/loaders/TDSLoader.js'
import type {Group} from 'three/src/objects/Group.js'
import {Element3D, type Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'
import {disposeObjectTree} from '../utils/three.js'
import {Events} from '../core/Events.js'

export type TdsModelAttributes = Element3DAttributes | 'src'

/**
 * @element lume-3ds-model
 * @class TdsModel -
 *
 * Defines the `<lume-3ds-model>` element for loading 3D models in the
 * 3DS format (`.3ds` files).
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene webgl>
 *   <lume-3ds-model id="myModel" src="path/to/model.3ds"></lume-3ds-model>
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
 * const model = new TdsModel
 * model.src = 'path/to/model.3ds'
 * model.on('MODEL_LOAD', () => console.log('loaded'))
 * scene.add(model)
 * ```
 */
export
@element('lume-3ds-model', autoDefineElements)
class TdsModel extends Element3D {
	/** Path to a .3ds file. */
	@stringAttribute src = ''

	loader = new TDSLoader()
	model?: Group

	// This is incremented any time we need to cancel a pending load() (f.e. on
	// src change, or on disconnect), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			this.src

			this.#loadModel()

			onCleanup(() => {
				if (this.model) disposeObjectTree(this.model)
				this.model = undefined
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

		this.loader!.load(
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
		this.three.add(model)
		this.emit(Events.MODEL_LOAD, {format: '3ds', model})
		this.needsUpdate()
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-3ds-model': ElementAttributes<TdsModel, TdsModelAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-3ds-model': TdsModel
	}
}
