import 'element-behaviors'
import {autorun, reactive, StopFunction, stringAttribute} from '@lume/element'
import {PLYLoader} from 'three/examples/jsm/loaders/PLYLoader.js'
import {BufferGeometry} from 'three/src/core/BufferGeometry.js'
import BaseGeometryBehavior from './BaseGeometryBehavior.js'
import {Events} from '../../core/Events.js'
import {Points} from '../../core/Points.js'

@reactive
export class PLYGeometryBehavior extends BaseGeometryBehavior {
	/** Path to a .ply file. */
	@stringAttribute('') src = ''

	loader?: PLYLoader
	model?: BufferGeometry

	requiredElementType() {
		return [Points]
	}

	protected static _observedProperties = ['src', ...(BaseGeometryBehavior._observedProperties || [])]

	protected _createComponent() {
		// An empty geometry to start with. It will be replaced once the PLY file is loaded.
		if (!this.model) return new BufferGeometry()
		return this.model
	}

	// This is incremented any time we need a pending load() to cancel (f.e. on
	// src change, or unloadGL cycle), so that the loader will ignore the
	// result when a version change has happened.
	private __version = 0

	private __stopFns: StopFunction[] = []

	loadGL() {
		if (!super.loadGL()) return false

		this.loader = new PLYLoader()

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

		this.loader = undefined

		this.__cleanupModel()

		// Increment this in case the loader is still loading, so it will ignore the result.
		this.__version++

		return true
	}

	private __cleanupModel() {
		// if (this.model) disposeObjectTree(this.model)
		this.model = undefined
	}

	private __loadObj() {
		const {src, __version} = this

		if (!src) return

		// In the following fbxLoader.load() callbacks, if __version doesn't
		// match, it means this.src or this.dracoDecoder changed while
		// a previous model was loading, in which case we ignore that
		// result and wait for the next model to load.

		console.log('load the model!')

		this.loader!.load(
			src,
			model => __version === this.__version && this.__setModel(model),
			progress => __version === this.__version && this.element.emit(Events.PROGRESS, progress),
			error => __version === this.__version && this.__onError(error),
		)
	}

	private __onError(error: ErrorEvent) {
		const message = error?.message ?? `Failed to load ${this.element.tagName.toLowerCase()} with src "${this.src}".`
		console.warn(message)
		if (error.error) console.error(error.error)
		this.element.emit(Events.MODEL_ERROR, error.error)
	}

	private __setModel(model: BufferGeometry) {
		this.model = model
		this.model.computeVertexNormals()
		this.resetMeshComponent()
		console.log('emit model load')
		this.element.emit(Events.MODEL_LOAD, {format: 'ply', model})
	}
}

elementBehaviors.define('ply-geometry', PLYGeometryBehavior)
