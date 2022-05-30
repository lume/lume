import 'element-behaviors'
import {reactive, stringAttribute} from '../../attribute.js'
import {PLYLoader} from 'three/examples/jsm/loaders/PLYLoader.js'
import {BufferGeometry} from 'three/src/core/BufferGeometry.js'
import {Events} from '../../../core/Events.js'
import {Points} from '../../../meshes/Points.js'
import {GeometryBehavior} from './GeometryBehavior.js'

/**
 * @class PlyGeometryBehavior -
 *
 * Behavior: `ply-geometry`
 *
 * This is useful for rendering a set of points from a `.ply` file.
 *
 * Given a `src` attribute that points to a `.ply` file, the behavior will load
 * a set of points from the file to use as geometry.
 *
 * It can be useful to use this behavior on a
 * [`<lume-points>`](../../../meshes/Points) element, which has a
 * [`points-material`](../materials/PointsMaterialBehavior) behavior for
 * configuring how points are rendered.
 *
 * @extends GeometryBehavior
 */
@reactive
export class PlyGeometryBehavior extends GeometryBehavior {
	/**
	 * @property {string} src
	 *
	 * `string` `attribute`
	 *
	 * Default: `''`
	 *
	 * Path to a `.ply` file to load points from.
	 */
	@stringAttribute('') src = ''

	loader?: PLYLoader
	model?: BufferGeometry

	override requiredElementType(): [typeof Points] {
		return [Points]
	}

	override _createComponent() {
		// An empty geometry to start with. It will be replaced once the PLY file is loaded.
		if (!this.model) return new BufferGeometry()
		return this.model
	}

	// This is incremented any time we need a pending load() to cancel (f.e. on
	// src change, or unloadGL cycle), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	override loadGL() {
		super.loadGL()

		this.loader = new PLYLoader()

		this.createEffect(() => {
			this.src

			this.#cleanupModel()

			this.#version++
			this.#loadModel()
		})
	}

	override unloadGL() {
		super.unloadGL()

		this.loader = undefined

		this.#cleanupModel()

		// Increment this in case the loader is still loading, so it will ignore the result.
		this.#version++
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
