import 'element-behaviors'
import {stringAttribute} from '@lume/element'
import {ColladaLoader, type Collada} from 'three/examples/jsm/loaders/ColladaLoader.js'
import {disposeObjectTree} from '../../../utils/three.js'
import {behavior} from '../../Behavior.js'
import {receiver} from '../../PropReceiver.js'
import {Events} from '../../../core/Events.js'
import {RenderableBehavior} from '../../RenderableBehavior.js'

export type ColladaModelBehaviorAttributes = 'src'

export {ColladaModelBehavior}
@behavior
class ColladaModelBehavior extends RenderableBehavior {
	/** Path to a .dae file. */
	@stringAttribute @receiver src = ''

	loader?: ColladaLoader
	model?: Collada

	// This is incremented any time we need a pending load() to cancel (f.e. on
	// src change, or unloadGL cycle), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	override loadGL() {
		this.loader = new ColladaLoader()

		this.createEffect(() => {
			this.src

			this.#cleanupModel()

			this.#version++
			this.#loadModel()
		})
	}

	override unloadGL() {
		this.loader = undefined

		this.#cleanupModel()

		// Increment this in case the loader is still loading, so it will ignore the result.
		this.#version++
	}

	#cleanupModel() {
		if (this.model) disposeObjectTree(this.model.scene)
		this.model = undefined
	}

	#loadModel() {
		const {src} = this
		const version = this.#version

		if (!src) return

		// In the following colladaLoader.load() callbacks, if version doesn't
		// match, it means this.src or this.dracoDecoder changed while
		// a previous model was loading, in which case we ignore that
		// result and wait for the next model to load.

		this.loader!.load(
			src,
			model => version === this.#version && this.#setModel(model),
			progress => version === this.#version && this.element.emit(Events.PROGRESS, progress),
			error => version === this.#version && this.#onError(error),
		)
	}

	#onError(error: unknown) {
		const message = `Failed to load ${this.element.tagName.toLowerCase()} with src "${
			this.src
		}". See the following error.`
		console.warn(message)
		const err = error instanceof ErrorEvent && error.error ? error.error : error
		console.error(err)
		this.element.emit(Events.MODEL_ERROR, err)
	}

	#setModel(model: Collada) {
		this.model = model
		this.element.three.add(model.scene)
		this.element.emit(Events.MODEL_LOAD, {format: 'collada', model})
		this.element.needsUpdate()
	}
}

if (globalThis.window?.document && !elementBehaviors.has('collada-model'))
	elementBehaviors.define('collada-model', ColladaModelBehavior)
