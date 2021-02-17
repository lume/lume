import type {Constructor} from 'lowclass'
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js'
import type {Collada} from 'three/examples/jsm/loaders/ColladaLoader.js'
import type {Group} from 'three/src/objects/Group.js'

export class EventTypes {
	constructor(
		// Listen to this event on an element to run custom logic after the
		// element's GL objects have been initialized.
		// GL_LOAD fires after BEHAVIOR_GL_LOAD, so GL_LOAD guarantees that both the
		// element and the element's behaviors are done loading GL objects.
		public GL_LOAD: undefined,
		// Listen to this event on an element to clean up after the element's GL
		// objects have been cleaned up and released.
		// GL_UNLOAD fires after BEHAVIOR_GL_UNLOAD, so GL_UNLOAD guarantees that
		// both the element and the element's behaviors are done unloading GL
		// objects.
		public GL_UNLOAD: undefined,
		// Listen to this event on an element to run custom logic after the
		// element's CSS objects have been initialized.
		public CSS_LOAD: undefined,
		// Listen to this event on an element to clean up after the element's CSS
		// objects have been cleaned up and released.
		public CSS_UNLOAD: undefined,
		// Listen to this event on an element to run custom logic after the
		// element's GL objects have been initialized. This is for use by element
		// behaviors. Code that is outside of a given element and outside of the
		// given element's behaviors should listen to GL_LOADED instead.
		public BEHAVIOR_GL_LOAD: undefined,
		// Listen to this event on an element to clean up after the element's GL
		// objects have been initialized. This is for use by element behaviors. Code
		// that is outside of a given element and outside of the given element's
		// behaviors should listen to GL_LOADED instead.
		public BEHAVIOR_GL_UNLOAD: undefined,
		// This event is fired when an obj-model element, or a node element with an
		// obj-model behavior, has loaded it's model.
		public MODEL_LOAD: {format: string; model: Group},
		// Fired by elements that load resources. See
		// https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
		public PROGRESS: ProgressEvent,
		// XXX Maybe we should combine loader events into one, instead of a new set of events per loader?
		// Fired when a gltf-model element has loaded the GLTF model.
		public GLTF_LOAD: {model: GLTF},
		public GLTF_ERROR: {src: string; dracoDecoderPath: string},
		// Fired when a collada-model element has loaded the Collada model.
		public COLLADA_LOAD: {model: Collada},
		public COLLADA_ERROR: {src: string},
	) {}
}

export const Events = makeEnumFromClassProperties(EventTypes)

// loop on the keys of a dummy class instance in order to create an enum-like
// object.
export function makeEnumFromClassProperties<T>(Class: Constructor<T>) {
	const Enum = {} as any

	for (const key in new (Class as any)()) {
		Enum[key] = key
	}

	return Object.freeze(Enum as {[k in keyof T]: k})
}
