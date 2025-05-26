import {onCleanup, untrack} from 'solid-js'
import {booleanAttribute, element, numberAttribute} from '@lume/element'
import {Camera as ThreeCamera} from 'three/src/cameras/Camera.js'
import {Element3D, type Element3DAttributes} from '../core/Element3D.js'

export type CameraAttributes = Element3DAttributes | 'aspect' | 'near' | 'far' | 'active' | 'zoom'
// | 'lookAt' // TODO

/**
 * @class Camera
 *
 * Base class for all camera elements, f.e. [`<lume-perspective-camera>`](./PerspectiveCamera).
 *
 * @extends Element3D
 */
export
@element({autoDefine: false})
class Camera extends Element3D {
	/**
	 * @property {number} aspect
	 *
	 * *attribute*
	 *
	 * Default: `0`
	 *
	 * A value of `0` sets the aspect ratio to automatic, based on the
	 * dimensions of a scene.  You normally don't want to modify this, but in
	 * case of stretched or squished display, this can be adjusted appropriately
	 * to unstretch or unsquish the view of the 3d world.
	 */
	@numberAttribute aspect = 0

	/**
	 * @property {number} near
	 *
	 * *attribute*
	 *
	 * Default: `1`
	 *
	 * Anything closer to the camera than this value will not be rendered.
	 */
	@numberAttribute near = 1

	/**
	 * @property {number} far
	 *
	 * *attribute*
	 *
	 * Default: `3000`
	 *
	 * Anything further from the camera than this value will not be rendered.
	 */
	@numberAttribute far = 3000

	/**
	 * @property {boolean} active
	 *
	 * *attribute*
	 *
	 * Default: `false`
	 *
	 * When `true`, the camera will be used as the viewport into the 3D scene,
	 * instead of the scene's default camera. When set back to `false`, the last
	 * camera that was set (and is still) active will be used, or if no other
	 * cameras are active the scene's default camera will be used.
	 */
	@booleanAttribute active = false

	/**
	 * @property {number} zoom
	 *
	 * *attribute*
	 *
	 * Default: `1`
	 *
	 * The zoom level of the camera modifies the effective field of view.
	 * Increasing the zoom will decrease the effective field of view, and vice
	 * versa. At zoom level `1`, the effective field of view is equivalent to
	 * [`fov`](#fov).
	 */
	@numberAttribute zoom = 1

	// TODO lookat property
	// @attribute lookAt: string | Element3D | null = null

	override connectedCallback() {
		super.connectedCallback()

		let lastScene = this.scene

		// Run logic once the scene exists.
		this.createEffect(() => {
			// If we have a scene, we're composed, otherwise we're not (could be connected, but not slotted)
			if (!this.scene || !this.active) return

			lastScene = this.scene

			untrack(() => this.scene!._addCamera(this))

			onCleanup(() => {
				lastScene!._removeCamera(this)
				lastScene = null
			})
		})
	}

	// This is not called because this class is abstract and should be extended
	// by concrete camera elements, but it provides types for locations that use
	// `Camera` as a type place holder f.e. in the `Scene` class.
	override makeThreeObject3d() {
		return new ThreeCamera()
	}
}
