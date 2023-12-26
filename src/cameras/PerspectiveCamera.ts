import {numberAttribute, element} from '@lume/element'
import {PerspectiveCamera as ThreePerspectiveCamera} from 'three/src/cameras/PerspectiveCamera.js'
import {Camera, type CameraAttributes} from './Camera.js'
import {autoDefineElements} from '../LumeConfig.js'
import {defaultScenePerspective} from '../constants.js'

export type PerspectiveCameraAttributes = CameraAttributes | 'fov'

// TODO auto-adjust position of three camera based on scene.perspective relative to element's origin. See Scene.perspective.

/**
 * @class PerspectiveCamera
 *
 * Defines a viewport into the 3D scene as will be seen on screen.
 *
 * A perspective camera is very similar to a camera in the real world: it has a
 * field of view (fov) such that more things in the world are visible further away from
 * the camera, while less can fit into view closer to the camera.
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = perspectiveCameraExample
 * </script>
 *
 * @extends Camera
 */
export
@element('lume-perspective-camera', autoDefineElements)
class PerspectiveCamera extends Camera {
	/**
	 * @property {number} fov
	 *
	 * *attribute*
	 *
	 * Default: `0`
	 *
	 * The camera's field of view angle, in degrees, when the [`zoom`](#zoom)
	 * level is `1`.
	 *
	 * A value of `0` means automatic fov based on the current Scene's
	 * [`.perspective`](../core/Scene#perspective), matching the behavior of [CSS
	 * `perspective`](https://developer.mozilla.org/en-US/docs/Web/CSS/perspective).
	 */
	@numberAttribute fov = 0

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			if (this.fov !== 0) {
				this.three.fov = this.fov
				this.three.updateProjectionMatrix()
				this.needsUpdate()
				return
			}

			// AUTO FOV //////////////////////////
			// Uses the scene `perspective` to match behavior of CSS `perspective`

			const perspective = this.scene?.perspective ?? defaultScenePerspective
			const sceneSize = this.scene?.calculatedSize ?? {x: 1, y: 1, z: 0}

			// This math is what sets the FOV of the default camera so that a
			// viewport-sized plane will fit exactly within the view when it is
			// positioned at the world origin 0,0,0, as described in the
			// `perspective` property's description.
			// For more details: https://discourse.threejs.org/t/269/28
			this.three.fov = (180 * (2 * Math.atan(sceneSize.y / 2 / perspective))) / Math.PI

			////////////////////////////

			this.three.updateProjectionMatrix()
			this.needsUpdate()
		})

		this.createEffect(() => {
			// Any value other than zero means the user supplied an aspect
			// ratio manually. Stop auto-aspect in that case.
			if (this.aspect !== 0) {
				this.three.aspect = this.aspect
				this.three.updateProjectionMatrix()
				this.needsUpdate()
				return
			}

			// AUTO ASPECT /////////////////////////////

			const sceneSize = this.scene?.calculatedSize || {x: 1, y: 1}

			// '|| 1' in case of a 0 or NaN (f.e. 0 / 0 == NaN)
			this.three.aspect = sceneSize.x / sceneSize.y || 1

			////////////////////////////

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
	}

	override makeThreeObject3d() {
		return new ThreePerspectiveCamera(75, 16 / 9, 1, 1000)
	}
}

import type {ElementAttributes} from '@lume/element'

declare module 'solid-js' {
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
