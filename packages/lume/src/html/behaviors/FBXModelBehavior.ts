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
	/** Path to a .dae file. */
	@stringAttribute('') src = ''

	fbxLoader?: FBXLoader
	model?: Group

	protected static _observedProperties = ['src', ...(RenderableBehavior._observedProperties || [])]

	// This is incremented any time we need a pending load() to cancel (f.e. on
	// src change, or unloadGL cycle), so that the loader will ignore the
	// result when a version change has happened.
	private __version = 0

	private __stopFns: StopFunction[] = []

	loadGL() {
		if (!super.loadGL()) return false

		this.fbxLoader = new FBXLoader()

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

		this.fbxLoader = undefined

		this.__cleanupModel()

		// Increment this in case the loader is still loading, so it will ignore the result.
		this.__version++

		return true
	}

	private __cleanupModel() {
		if (this.model) disposeObjectTree(this.model)
		this.model = undefined
	}

	private __loadObj() {
		const {src, __version} = this

		if (!src) return

		// In the following fbxLoader.load() callbacks, if __version doesn't
		// match, it means this.src or this.dracoDecoder changed while
		// a previous model was loading, in which case we ignore that
		// result and wait for the next model to load.

		this.fbxLoader!.load(
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

	private __setModel(model: Group) {
		this.model = model
		this.element.three.add(model)
		this.element.emit(Events.MODEL_LOAD, {format: 'fbx', model})
		this.element.needsUpdate()
	}
}

elementBehaviors.define('fbx-model', FBXModelBehavior)
