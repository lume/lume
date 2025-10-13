import {signal} from 'classy-solid'
import {stringAttribute, element} from '@lume/element'
import {PLYLoader} from 'three/examples/jsm/loaders/PLYLoader.js'
import {BufferGeometry} from 'three/src/core/BufferGeometry.js'
import {Events} from '../../../core/Events.js'
import {GeometryBehavior} from './GeometryBehavior.js'
import {autoDefineElements} from '../../../LumeConfig.js'
import {createEffect, onCleanup} from 'solid-js'
import type {CompositionType} from '../../../core/CompositionTracker.js'

/**
 * @class PlyGeometryBehavior -
 *
 * Element: `ply-geometry`
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
 * @element ply-geometry
 */
export
@element('ply-geometry', autoDefineElements)
class PlyGeometryBehavior extends GeometryBehavior {
	/**
	 * @property {string} src
	 *
	 * `string` `attribute`
	 *
	 * Default: `''`
	 *
	 * Path to a `.ply` file to load points from.
	 */
	@stringAttribute src = ''

	loader = new PLYLoader()
	@signal model: BufferGeometry | null = null

	override _createComponent() {
		// An empty geometry to start with. It will be replaced once the PLY file is loaded.
		if (!this.model) return new BufferGeometry()
		return this.model
	}

	// This is incremented any time we need to cancel a pending load() (f.e. on
	// src change, or on disconnect), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	override connectedCallback() {
		super.connectedCallback()
		console.log('PLY GEOMETRY BEHAVIOR CONNECTED')
	}

	override composedCallback(parent: NonNullable<this['composedParent']>, compType: CompositionType) {
		super.composedCallback?.(parent, compType)

		console.log('PLY GEOM COMPOSED:', compType)
	}

	override uncomposedCallback(parent: NonNullable<this['composedParent']>, compType: CompositionType) {
		super.uncomposedCallback?.(parent, compType)

		console.log('PLY GEOM UNCOMPOSED:', compType)
	}

	protected override _parentDefinedEffect(parent: NonNullable<this['composedParent']> = this.composedParent!) {
		super._parentDefinedEffect(parent)

		createEffect(() => {
			this.src

			this.#loadModel()

			onCleanup(() => {
				this.model?.dispose()
				// Note that dispose is already called in the super.resetMeshComponent process.
				this.model = null
				// Increment this in case the loader is still loading, so it will ignore the result.
				this.#version++
			})
		})
	}

	#loadModel() {
		const {src} = this
		const version = this.#version

		console.log('PLY GEOMETRY BEHAVIOR PARENT DEFINED', src)

		if (!src) return

		// In the following fbxLoader.load() callbacks, if #version doesn't
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

	#setModel(model: BufferGeometry) {
		console.log('PLY GEOMETRY BEHAVIOR SET MODEL', model)
		model.computeVertexNormals()
		this.model = model // triggers the resetMeshComponent effect
		this.composedParent!.emit(Events.MODEL_LOAD, {format: 'ply', model})
	}
}
