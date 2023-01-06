import {createEffect, createRoot, untrack} from 'solid-js'
import {numberAttribute, booleanAttribute, element} from '@lume/element'
import {PerspectiveCamera as ThreePerspectiveCamera} from 'three/src/cameras/PerspectiveCamera.js'
import {Element3D, Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {Scene} from '../core/Scene.js'

export type PerspectiveCameraAttributes = Element3DAttributes | 'fov' | 'aspect' | 'near' | 'far' | 'zoom' | 'active'
// | 'lookAt' // TODO

/**
 * @class PerspectiveCamera
 *
 * Defines a viewport into the 3D scene as will be seen on screen.
 *
 * A perspective camera is very similar to a camera in the real world: it has a
 * field of view (fov) such that more things in the world are visible further away from
 * the camera, while less can fit into view closer to the camera.
 *
 * <div id="perspectiveCamera"></div>
 * <script>
 *   new Vue({
 *     el: '#perspectiveCamera',
 *     template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
 *     data: { code: perspectiveCameraExample },
 *   })
 * </script>
 *
 * @extends Element3D
 */
@element('lume-perspective-camera', autoDefineElements)
export class PerspectiveCamera extends Element3D {
	/**
	 * @property {number} fov
	 *
	 * *attribute*
	 *
	 * Default: `50`
	 *
	 * The camera's field of view angle, in degrees, when [`zoom`](#zoom) level
	 * is `1`.
	 */
	@numberAttribute(50) fov = 50

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
	@numberAttribute(0) aspect = 0

	/**
	 * @property {number} near
	 *
	 * *attribute*
	 *
	 * Default: `0.1`
	 *
	 * Anything closer to the camera than this value will not be rendered.
	 */
	@numberAttribute(0.1) near = 0.1

	/**
	 * @property {number} far
	 *
	 * *attribute*
	 *
	 * Default: `3000`
	 *
	 * Anything further from the camera than this value will not be rendered.
	 */
	@numberAttribute(3000) far = 3000

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
	@numberAttribute(1) zoom = 1

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
	@booleanAttribute(false) active = false

	// TODO lookat property
	// @attribute lookat: string | Element3D | null = null

	override connectedCallback() {
		super.connectedCallback()

		// Run logic once the scene exists.
		createRoot(dispose => {
			createEffect(() => {
				if (!this.scene) return

				untrack(() => {
					this.#lastKnownScene = this.scene
					this.#setSceneCamera(this.active ? undefined : 'unset')
					queueMicrotask(() => dispose())
				})
			})
		})
		// TODO ^ once(condition) to make the above simpler, F.e.:
		//
		// once(() => this.scene).then(() => {
		// 	this.__lastKnownScene = this.scene
		// 	this.__setSceneCamera(this.active ? undefined : 'unset')
		// })

		this.createEffect(() => {
			this.three.fov = this.fov
			this.three.updateProjectionMatrix()
			this.needsUpdate()
		})

		this.createEffect(() => {
			// Any value other than zero means the user supplied an aspect
			// ratio manually. Stop auto-aspect in that case.
			if (this.aspect !== 0) {
				this.three.aspect = this.aspect
				this.three.updateProjectionMatrix()
				return
			}

			let aspect = 0

			if (this.scene) aspect = this.scene.calculatedSize.x / this.scene.calculatedSize.y

			// in case of a 0 or NaN (f.e. 0 / 0 == NaN)
			if (!aspect) aspect = 16 / 9

			this.three.aspect = aspect
			this.three.updateProjectionMatrix()
			this.needsUpdate()
		})

		this.createEffect(() => {
			this.three.near = this.near
			this.three.updateProjectionMatrix()
			this.needsUpdate()
		})

		this.createEffect(() => {
			this.three.far = this.far
			this.three.updateProjectionMatrix()
			this.needsUpdate()
		})

		this.createEffect(() => {
			this.three.zoom = this.zoom
			this.three.updateProjectionMatrix()
			this.needsUpdate()
		})

		this.createEffect(() => {
			const active = this.active
			untrack(() => {
				this.#setSceneCamera(active ? undefined : 'unset')
			})
			this.needsUpdate() // TODO need this? Cameras don't render as anything, maybe they don't need an update in this case.
		})
	}

	override makeThreeObject3d() {
		return new ThreePerspectiveCamera(75, 16 / 9, 1, 1000)
	}

	// TODO make sure this works. Camera should switch to scene's default on
	// removal of last camera, etc.
	override disconnectedCallback() {
		super.disconnectedCallback()

		this.#setSceneCamera('unset')
		this.#lastKnownScene = null
	}

	#lastKnownScene: Scene | null = null

	#setSceneCamera(unset?: 'unset') {
		if (unset) {
			if (this.#lastKnownScene) this.#lastKnownScene._removeCamera(this)
		} else {
			if (!this.scene || !this.isConnected) return

			this.scene._addCamera(this)
		}
	}
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-perspective-camera': ElementAttributes<PerspectiveCamera, PerspectiveCameraAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-perspective-camera': PerspectiveCamera
	}
}
