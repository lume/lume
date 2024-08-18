import 'element-behaviors'
import {stringAttribute} from '@lume/element'
import {onCleanup} from 'solid-js'
import {ColladaLoader, type Collada} from 'three/examples/jsm/loaders/ColladaLoader.js'
import {disposeObjectTree} from '../../../utils/three.js'
import {behavior} from '../../Behavior.js'
import {receiver} from '../../PropReceiver.js'
import {Events} from '../../../core/Events.js'
import {ModelBehavior} from './ModelBehavior.js'
import {LoadEvent} from '../../../models/LoadEvent.js'
import {ColladaModel} from '../../../models/ColladaModel.js'

export type ColladaModelBehaviorAttributes = 'src'

/**
 * A behavior containing the logic that loads Collada models for `<lume-collada-model>`
 * elements.
 * @deprecated Don't use this behavior directly, instead use a `<lume-collada-model>` element.
 * @extends ModelBehavior
 */
export
@behavior
class ColladaModelBehavior extends ModelBehavior {
	/** Path to a .dae file. */
	@stringAttribute @receiver src = ''

	loader = new ColladaLoader()

	/** @deprecated access `.threeModel` on the lume-collada-model element instead. */
	declare model?: Collada

	declare element: ColladaModel

	override requiredElementType() {
		return [ColladaModel]
	}

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
				if (this.element.threeModel) disposeObjectTree(this.element.threeModel.scene)
				this.model = undefined
				this.element.threeModel = null
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
		this.element.three.add(model.scene)
		this.model = model
		this.element.threeModel = model

		this.element.emit(Events.MODEL_LOAD, {format: 'collada', model})
		this.element.dispatchEvent(new LoadEvent())
		this.element.needsUpdate()
	}
}

if (globalThis.window?.document && !elementBehaviors.has('collada-model'))
	elementBehaviors.define('collada-model', ColladaModelBehavior)
