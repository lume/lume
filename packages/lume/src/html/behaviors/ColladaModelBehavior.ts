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

	colladaLoader?: ColladaLoader
	model?: Collada

	protected static _observedProperties = ['src', ...(RenderableBehavior._observedProperties || [])]

	// This is incremented any time we need a pending load() to cancel (f.e. on
	// src change, or unloadGL cycle), so that the loader will ignore the
	// result when a version change has happened.
	private __version = 0

	private __stopFns: StopFunction[] = []

	loadGL() {
		if (!super.loadGL()) return false

		this.colladaLoader = new ColladaLoader()

		this.__stopFns.push(
			autorun(() => {
				this.src

				this.__cleanupModel()

				this.__version++
				this.__loadObj()
			}),
		)

		return true
	}

	unloadGL() {
		if (!super.unloadGL()) return false

		for (const stop of this.__stopFns) stop()

		this.colladaLoader = undefined

		this.__cleanupModel()

		// Increment this in case the loader is still loading, so it will ignore the result.
		this.__version++

		return true
	}

	private __cleanupModel() {
		if (this.model) disposeObjectTree(this.model.scene)
		this.model = undefined
	}

	private __loadObj() {
		const {src, __version} = this

		if (!src) return

		// In the following colladaLoader.load() callbacks, if __version doesn't
		// match, it means this.src or this.dracoDecoder changed while
		// a previous model was loading, in which case we ignore that
		// result and wait for the next model to load.

		this.colladaLoader!.load(
			src,
			model => __version === this.__version && this.__setModel(model),
			progress => __version === this.__version && this.element.emit(Events.PROGRESS, progress),
			error => __version === this.__version && this.__onError(error),
		)
	}

	private __onError(error: ErrorEvent) {
		const message = error?.message ?? `Failed to load ${this.element.tagName.toLowerCase()} with src "${this.src}".`
		console.warn(message)
		this.element.emit(Events.MODEL_ERROR, error.error)
	}

	private __setModel(model: Collada) {
		this.model = model
		this.element.three.add(model.scene)
		this.element.emit(Events.MODEL_LOAD, {format: 'collada', model})
		this.element.needsUpdate()
	}
}

elementBehaviors.define('collada-model', ColladaModelBehavior)
