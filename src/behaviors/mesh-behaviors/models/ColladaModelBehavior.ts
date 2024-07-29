import 'element-behaviors'
import {stringAttribute} from '@lume/element'
import {ColladaLoader, type Collada} from 'three/examples/jsm/loaders/ColladaLoader.js'
import {disposeObjectTree} from '../../../utils/three.js'
import {behavior} from '../../Behavior.js'
import {receiver} from '../../PropReceiver.js'
import {Events} from '../../../core/Events.js'
import {RenderableBehavior} from '../../RenderableBehavior.js'
import {onCleanup} from 'solid-js'
import {ModelLoadEvent, type Model} from '../../../models/Model.js'

export type ColladaModelBehaviorAttributes = 'src'

export
@behavior
class ColladaModelBehavior extends RenderableBehavior {
	/** Path to a .dae file. */
	@stringAttribute @receiver src = ''

	loader = new ColladaLoader()
	model?: Collada

	// This is incremented any time we need to cancel a pending load() (f.e. on
	// src change, or on disconnect), so that the loader will ignore the
	// result when a version change has happened.
	#version = 0

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			this.src

			this.#loadModel()

			onCleanup(() => {
				if (this.model) disposeObjectTree(this.model.scene)
				this.model = undefined
				// Increment this in case the loader is still loading, so it will ignore the result.
				this.#version++
			})
		})
	}

	#loadModel() {
		const {src} = this
		const version = this.#version

		if (!src) return

		// In the following colladaLoader.load() callbacks, if version doesn't
		// match, it means this.src or this.dracoDecoder changed while
		// a previous model was loading, in which case we ignore that
		// result and wait for the next model to load.

		this.loader.load(
			src,
			model => version === this.#version && this.#setModel(model),
			progress => version === this.#version && this.element.emit(Events.PROGRESS, progress),
			error => version === this.#version && this.#onError(error),
		)
	}

	#onError(error: unknown) {
		const message = `Failed to load ${this.element.tagName.toLowerCase()} with src "${
			this.src
		}". See the following error.`
		console.warn(message)
		const err = error instanceof ErrorEvent && error.error ? error.error : error
		console.error(err)
		this.element.emit(Events.MODEL_ERROR, err)
	}

	#setModel(model: Collada) {
		this.model = model
		this.element.three.add(model.scene)
		this.element.emit(Events.MODEL_LOAD, {format: 'collada', model})

		// Cast so the type check passes. Non-TypeScript users can listen to
		// this event on any non-Model element anyway, while TS users will be
		// using Model elements for type safety.
		;(this.element as Model).dispatchEvent(new ModelLoadEvent('collada', model))
		// Note how the "collada" string could be any of the possible string
		// values, such as "gltf", which would be incorrect, but there would be
		// no type error. Easy to get it wrong.
		// Perhaps we could eliminate model behaviors, because we can just use
		// the model elements directly, and each model element can subclass
		// ModelLoadEvent. Plus that starts to move us towards better type
		// safety based on element definitions.
		// F.e. we can do this currently:
		//
		//   <lume-element3d has="gltf-model" src="./foo.gltf">
		//   </lume-element3d>
		//
		// But the Element3D type does not include a `src` attribute, so there's
		// no type safety for `src={}` in JSX, or `.src` on the JS reference. So
		// that's why this is better:
		//
		//   <lume-gltf-model src="./foo.gltf">
		//   </lume-gltf-model>
		//
		// And if we wanted to have multiple models like this,
		//
		//   <lume-element3d has="gltf-model collada-model fbx-model" src="./foo.gltf" position="...move them all at once...">
		//   </lume-element3d>
		//
		// it wouldn't even work because there'd be a single src attribute and
		// all of the behaviors would try to use it, but it would only have the
		// correct file for one of the behaviors. With elements we can just do
		// this:
		//
		//   <lume-element3d position="...move them all at once...">
		//     <lume-gltf-model src="./foo.gltf" position="...plus now can control them indivdually too..."></lume-gltf-model>
		//     <lume-fbx-model src="./foo.fbx"></lume-fbx-model>
		//     <lume-collada-model src="./foo.dae"></lume-collada-model>
		//   </lume-element3d>
		//
		// So, I think it time to start to deprecate behaviors that can easily
		// be represented as HTML elements.
		//
		// As for geometry and material behaviors, perhaps those can be elements
		// too: "behavior elements" that give an intrinsic feature to their
		// <lume-mesh> parent elements. But we need to ideate how this will work
		// with CSS support (for example apply a material via CSS, or via
		// behavior element, and re-use as much of the logic as we can either
		// way). It is uncharted territory, and we'll be making something novel!

		this.element.needsUpdate()
	}
}

if (globalThis.window?.document && !elementBehaviors.has('collada-model'))
	elementBehaviors.define('collada-model', ColladaModelBehavior)
