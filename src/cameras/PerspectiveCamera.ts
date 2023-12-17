import {numberAttribute, element} from '@lume/element'
import {PerspectiveCamera as ThreePerspectiveCamera} from 'three/src/cameras/PerspectiveCamera.js'
import {Camera, type CameraAttributes} from './Camera.js'
import {autoDefineElements} from '../LumeConfig.js'

export type PerspectiveCameraAttributes = CameraAttributes | 'fov'

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
	 * Default: `50`
	 *
	 * The camera's field of view angle, in degrees, when [`zoom`](#zoom) level
	 * is `1`.
	 */
	@numberAttribute fov = 50

	override connectedCallback() {
		super.connectedCallback()

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
