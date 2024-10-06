import type {Constructor} from 'lowclass/dist/Constructor.js'
import type {BufferGeometry, Group} from 'three/src/Three.js'
import type {Collada} from 'three/examples/jsm/loaders/ColladaLoader.js'
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js'

/** @deprecated Elements dispatch native DOM `Event`s now. Use `element.addEventListener()`, `element.removeEventListener()`, and `element.dispatchEvent()`. */
export class EventTypes {
	constructor(
		/**
		 * This event is fired when a *-model element, or a node element with a
		 * *-model behavior, has loaded it's model.
		 * @deprecated Use DOM `load` event instead, f.e. `element.addEventListener('load', instead)`
		 */
		public MODEL_LOAD: {
			format: 'obj' | 'gltf' | 'collada' | 'fbx' | 'ply' | '3ds'
			model: Group | GLTF | Collada | BufferGeometry
		},
		/**
		 * @deprecated
		 * Fired if a *-model element, or node element with *-model behavior,
		 * has an error during load.
		 */
		// CONTINUE: ErrorEvents
		public MODEL_ERROR: Error,
		/**
		 * @deprecated
		 * Fired by elements that load resources. See
		 * https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
		 */
		public PROGRESS: ProgressEvent,
	) {}
}

/** @deprecated Elements dispatch native DOM `Event`s now. Use `element.addEventListener()`, `element.removeEventListener()`, and `element.dispatchEvent()`. */
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
