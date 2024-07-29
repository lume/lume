import type {Constructor} from 'lowclass'
import type {ModelType, ThreeModel} from '../models/Model.js'

export class EventTypes {
	constructor(
		/**
		 * This event is fired when a *-model element, or a node element with a
		 * *-model behavior, has loaded it's model.
		 * @deprecated Use DOM `load` event instead, f.e. `element.addEventListener('load', instead)`
		 */
		public MODEL_LOAD: {format: ModelType; model: ThreeModel},
		/**
		 * @deprecated
		 * Fired if a *-model element, or node element with *-model behavior,
		 * has an error during load.
		 */
		public MODEL_ERROR: Error,
		/**
		 * @deprecated
		 * Fired by elements that load resources. See
		 * https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
		 */
		public PROGRESS: ProgressEvent,
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
