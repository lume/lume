import {stringAttribute, element} from '@lume/element'
import {onCleanup} from 'solid-js'
import {TDSLoader} from 'three/examples/jsm/loaders/TDSLoader.js'
import {disposeObjectTree} from '../../../utils/three.js'
import {Events} from '../../../core/Events.js'
import {RenderableBehavior} from '../../RenderableBehavior.js'
import {autoDefineElements} from '../../../LumeConfig.js'

import type {Group} from 'three/src/objects/Group.js'

export type TdsModelBehaviorAttributes = 'src'

export
@element('tds-model', autoDefineElements)
class TdsModelBehavior extends RenderableBehavior {
	/** Path to a .3ds file. */
	@stringAttribute src = ''

	loader = new TDSLoader()
	model?: Group

	// This is incremented any time we need to cancel a pending load() (f.e. on
	// src change, or on disconnect), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	protected override _parentDefinedEffect(parent: NonNullable<this['composedParent']> = this.composedParent!) {
		super._parentDefinedEffect(parent)

		this.src

		this.#loadModel()

		onCleanup(() => {
			if (this.model) disposeObjectTree(this.model)
			this.model = undefined
			// Increment this in case the loader is still loading, so it will ignore the result.
			this.#version++
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
			progress => version === this.#version && this.composedParent!.emit(Events.PROGRESS, progress),
			error => version === this.#version && this.#onError(error),
		)
	}

	#onError(error: unknown) {
		const message = `Failed to load ${this.composedParent!.tagName.toLowerCase()} with src "${
			this.src
		}". See the following error.`
		console.warn(message)
		const err = error instanceof ErrorEvent && error.error ? error.error : error
		console.error(err)
		this.composedParent!.emit(Events.MODEL_ERROR, err)
	}

	#setModel(model: Group) {
		this.model = model
		this.composedParent!.three.add(model)
		this.composedParent!.emit(Events.MODEL_LOAD, {format: '3ds', model})
		this.composedParent!.needsUpdate()
	}
}
