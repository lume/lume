import 'element-behaviors'
import {reactive, stringAttribute} from '../../attribute.js'
import {FBXLoader} from '../../../lib/three/examples/jsm/loaders/FBXLoader.js'
import {disposeObjectTree} from '../../../utils/three.js'
import {Events, ModelLoadEvent} from '../../../core/Events.js'
import {RenderableBehavior} from '../../RenderableBehavior.js'

import type {Group} from 'three/src/objects/Group.js'

export type FbxModelBehaviorAttributes = 'src'

@reactive
export class FbxModelBehavior extends RenderableBehavior {
	/** Path to a .fbx file. */
	@stringAttribute('') src = ''

	loader?: FBXLoader
	model?: Group

	// This is incremented any time we need a pending load() to cancel (f.e. on
	// src change, or unloadGL cycle), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	override loadGL() {
		this.loader = new FBXLoader()

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
		if (this.model) disposeObjectTree(this.model)
		this.model = undefined
	}

	#loadModel() {
		const {src} = this
		const version = this.#version

		if (!src) return

		// In the following loader.load() callbacks, if __version doesn't
		// match, it means this.src or this.dracoDecoder changed while
		// a previous model was loading, in which case we ignore that
		// result and wait for the next model to load.

		this.loader!.load(
			src,
			model => version === this.#version && this.#setModel(model),
			progress =>
				version === this.#version &&
				(this.element.emit(Events.PROGRESS, progress), this.element.dispatchEvent(progress)),
			error => version === this.#version && this.#onError(error),
		)
	}

	#onError(error: ErrorEvent) {
		const message = `Failed to load ${this.element.tagName.toLowerCase()} with src "${
			this.src
		}". See the following error.`
		console.warn(message)
		const err = error instanceof ErrorEvent && error.error ? error.error : error
		console.error(err)
		this.element.emit(Events.MODEL_ERROR, err)
		this.element.dispatchEvent(
			error instanceof ErrorEvent
				? error
				: new ErrorEvent(
						'error',
						// @ts-expect-error WHYYYYYYYYYYYYYYYYY TypeScript
						error instanceof Error
							? {
									error,
									// @ts-expect-error WHYYYYYYYYYYYYYYYYY TypeScript
									message: error.message,
							  }
							: {},
				  ),
		)
	}

	#setModel(model: Group) {
		this.model = model
		this.element.three.add(model)
		this.element.emit(Events.MODEL_LOAD, {format: 'fbx', model})
		this.element.dispatchEvent(new ModelLoadEvent('modelload', {format: 'fbx', model}))
		this.element.needsUpdate()
	}
}

if (globalThis.window?.document && !elementBehaviors.has('fbx-model'))
	elementBehaviors.define('fbx-model', FbxModelBehavior)
