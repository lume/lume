import 'element-behaviors'
import {reactive, autorun, stringAttribute} from '@lume/element'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js'
import {disposeObjectTree} from '../../utils/three.js'
import {Events} from '../../core/Events.js'
import {RenderableBehavior} from './RenderableBehavior.js'

import type {StopFunction} from '@lume/element'
import type {Group} from 'three/src/objects/Group.js'

export type FBXModelBehaviorAttributes = 'src'

@reactive
export class FBXModelBehavior extends RenderableBehavior {
	/** Path to a .fbx file. */
	@stringAttribute('') src = ''

	loader?: FBXLoader
	model?: Group

	static _observedProperties = ['src', ...(RenderableBehavior._observedProperties || [])]

	// This is incremented any time we need a pending load() to cancel (f.e. on
	// src change, or unloadGL cycle), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	#stopFns: StopFunction[] = []

	loadGL() {
		if (!super.loadGL()) return false

		this.loader = new FBXLoader()

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
		this.#stopFns.length = 0

		this.loader = undefined

		this.#cleanupModel()

		// Increment this in case the loader is still loading, so it will ignore the result.
		this.#version++

		return true
	}

	#cleanupModel() {
		if (this.model) disposeObjectTree(this.model)
		this.model = undefined
	}

	#loadObj() {
		const {src} = this
		const version = this.#version

		if (!src) return

		// In the following fbxLoader.load() callbacks, if __version doesn't
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

	#setModel(model: Group) {
		this.model = model
		this.element.three.add(model)
		this.element.emit(Events.MODEL_LOAD, {format: 'fbx', model})
		this.element.needsUpdate()
	}
}

elementBehaviors.define('fbx-model', FBXModelBehavior)
