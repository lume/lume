import 'element-behaviors'
import {reactive, autorun, stringAttribute} from '@lume/element'
import {ColladaLoader} from 'three/examples/jsm/loaders/ColladaLoader.js'
import {disposeObjectTree} from '../../utils/three.js'
import {Events} from '../../core/Events.js'
import {RenderableBehavior} from './RenderableBehavior.js'

import type {StopFunction} from '@lume/element'
import type {Collada} from 'three/examples/jsm/loaders/ColladaLoader.js'

export type ColladaModelBehaviorAttributes = 'src'

@reactive
export class ColladaModelBehavior extends RenderableBehavior {
	/** Path to a .dae file. */
	@stringAttribute('') src = ''

	loader?: ColladaLoader
	model?: Collada

	static _observedProperties = ['src', ...(RenderableBehavior._observedProperties || [])]

	// This is incremented any time we need a pending load() to cancel (f.e. on
	// src change, or unloadGL cycle), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	#stopFns: StopFunction[] = []

	loadGL() {
		if (!super.loadGL()) return false

		this.loader = new ColladaLoader()

		this.#stopFns.push(
			autorun(() => {
				this.src

				this.#cleanupModel()

				this.#version++
				this.#loadObj()
			}),
		)

		return true
	}

	unloadGL() {
		if (!super.unloadGL()) return false

		for (const stop of this.#stopFns) stop()

		this.loader = undefined

		this.#cleanupModel()

		// Increment this in case the loader is still loading, so it will ignore the result.
		this.#version++

		return true
	}

	#cleanupModel() {
		if (this.model) disposeObjectTree(this.model.scene)
		this.model = undefined
	}

	#loadObj() {
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

	#onError(error: ErrorEvent) {
		const message = error?.message ?? `Failed to load ${this.element.tagName.toLowerCase()} with src "${this.src}".`
		console.warn(message)
		if (error.error) console.error(error.error)
		this.element.emit(Events.MODEL_ERROR, error.error)
	}

	#setModel(model: Collada) {
		this.model = model
		this.element.three.add(model.scene)
		this.element.emit(Events.MODEL_LOAD, {format: 'collada', model})
		this.element.needsUpdate()
	}
}

elementBehaviors.define('collada-model', ColladaModelBehavior)
