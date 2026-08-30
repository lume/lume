import {element, stringAttribute, type ElementAttributes} from '@lume/element'
import {Element3D, type Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'
import {ColladaLoader, type Collada} from 'three/examples/jsm/loaders/ColladaLoader.js'
import {disposeObjectTree} from '../utils/three.js'
import {Events} from '../core/Events.js'
import {onCleanup} from 'solid-js'

export type ColladaModelAttributes = Element3DAttributes | 'src'

/**
 * @element lume-collada-model
 * @class ColladaModel -
 *
 * Defines the `<lume-collada-model>` element for loading 3D models in the
 * Collada format (`.dae` files).
 *
 * HTML Example:
 *
 * ```html
 * <lume-scene webgl>
 *   <lume-collada-model id="myModel" src="path/to/model.dae"></lume-collada-model>
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
 * const model = new ColladaModel
 * model.src = 'path/to/model.dae'
 * model.on('MODEL_LOAD', () => console.log('loaded'))
 * scene.add(model)
 * ```
 *
 * @extends Element3D
 */
export
@element('lume-collada-model', autoDefineElements)
class ColladaModel extends Element3D {
	/** Path to a .dae file. */
	@stringAttribute src = ''

	loader = new ColladaLoader()
	model?: Collada

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
				if (this.model) disposeObjectTree(this.model.scene)
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

		// In the following colladaLoader.load() callbacks, if version doesn't
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

	#setModel(model: Collada) {
		this.model = model
		this.three.add(model.scene)
		this.emit(Events.MODEL_LOAD, {format: 'collada', model})
		this.needsUpdate()
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-collada-model': ElementAttributes<ColladaModel, ColladaModelAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-collada-model': ColladaModel
	}
}
