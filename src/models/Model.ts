import {reactive, signal} from 'classy-solid'
import {Element3D, type Element3DAttributes} from '../core/Element3D.js'
import type {LoadEvent} from './LoadEvent.js'
import {skeletonHelper} from '../utils/three/skeletonHelper.js'

export type ModelAttributes =
	| Element3DAttributes
	//
	// | 'onload'
	| 'onprogress'

/**
 * @class Model - Base class for model elements that load 3D models from
 * various types of asset files (f.e. gltf, fbx, obj, etc).
 *
 * @extends Element3D
 */
@reactive
export class Model extends Element3D {
	/**
	 * @property {object | null} threeModel - The loaded model, or null if not loaded or while loading.
	 *
	 * `signal`
	 */
	@signal threeModel: object | null = null

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			if (!this.scene) return
			if (this.debug) skeletonHelper(this)
		})
	}

	declare addEventListener: <Key extends keyof ModelEvents>(
		type: Key,
		listener: (this: this, event: ModelEvents[Key]) => void,
		options?: boolean | AddEventListenerOptions,
	) => void
	declare removeEventListener: <Key extends keyof ModelEvents>(
		type: Key,
		listener: (this: this, event: ModelEvents[Key]) => void,
		options?: boolean | AddEventListenerOptions,
	) => void

	/** Needed for JSX types */
	// declare onload: ((event: Event) => void) | null

	// CONTINUE: not needed for Solid JSX, but needed for React JSX? If so, we
	// need to specifically add these types for specific variants of JSX.
	// declare onprogress: ((event: ProgressEvent) => void) | null

	// override dispatchEvent(event: Event) {
	// 	console.log('DISPATCH EVENT')
	// 	if (typeof (this as any)['on' + event.type] === 'function') {
	// 		try {
	// 			;(this as any)['on' + event.type](event)
	// 		} catch (e) {
	// 			console.error(e)
	// 		}
	// 	}

	// 	return super.dispatchEvent(event)
	// }
}

export interface ModelEvents extends HTMLElementEventMap {
	load: LoadEvent
}
