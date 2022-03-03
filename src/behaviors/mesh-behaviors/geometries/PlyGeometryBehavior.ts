import 'element-behaviors'
import {autorun, reactive, stringAttribute} from '@lume/element'
import {PLYLoader} from 'three/examples/jsm/loaders/PLYLoader.js'
import {BufferGeometry} from 'three/src/core/BufferGeometry.js'
import {Events} from '../../../core/Events.js'
import {Points} from '../../../meshes/Points.js'
import {GeometryBehavior} from './GeometryBehavior.js'

@reactive
export class PlyGeometryBehavior extends GeometryBehavior {
	/** Path to a .ply file. */
	@stringAttribute('') src = ''

	loader?: PLYLoader
	model?: BufferGeometry

	requiredElementType(): [typeof Points] {
		return [Points]
	}

	static _observedProperties = ['src', ...(GeometryBehavior._observedProperties || [])]

	_createComponent() {
		// An empty geometry to start with. It will be replaced once the PLY file is loaded.
		if (!this.model) return new BufferGeometry()
		return this.model
	}

	// This is incremented any time we need a pending load() to cancel (f.e. on
	// src change, or unloadGL cycle), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	loadGL() {
		if (!super.loadGL()) return false

		this.loader = new PLYLoader()

		this._stopFns.push(
			autorun(() => {
				this.src

				this.#cleanupModel()

				this.#version++
				this.#loadModel()
			}),
		)

		return true
	}

	unloadGL() {
		if (!super.unloadGL()) return false

		this.loader = undefined

		this.#cleanupModel()

		// Increment this in case the loader is still loading, so it will ignore the result.
		this.#version++

		return true
	}

	#cleanupModel() {
		// if (this.model) disposeObjectTree(this.model)
		this.model = undefined
	}

	#loadModel() {
		const {src} = this
		const version = this.#version

		if (!src) return

		// In the following fbxLoader.load() callbacks, if #version doesn't
		// match, it means this.src or this.dracoDecoder changed while
		// a previous model was loading, in which case we ignore that
		// result and wait for the next model to load.

		console.log('load the model!')

		this.loader!.load(
			src,
			model => version === this.#version && this.#setModel(model),
			progress => version === this.#version && this.element.emit(Events.PROGRESS, progress),
			error => version === this.#version && this.#onError(error),
		)
	}

	#onError(error: ErrorEvent | Error) {
		const message = `Failed to load ${this.element.tagName.toLowerCase()} with src "${
			this.src
		}". See the following error.`
		console.warn(message)
		const err = error instanceof ErrorEvent && error.error ? error.error : error
		console.error(err)
		this.element.emit(Events.MODEL_ERROR, err)
	}

	#setModel(model: BufferGeometry) {
		this.model = model
		this.model.computeVertexNormals()
		this.resetMeshComponent()
		this.element.emit(Events.MODEL_LOAD, {format: 'ply', model})
	}
}

if (!elementBehaviors.has('ply-geometry')) elementBehaviors.define('ply-geometry', PlyGeometryBehavior)
