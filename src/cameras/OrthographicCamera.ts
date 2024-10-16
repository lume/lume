import {numberAttribute, element, type ElementAttributes} from '@lume/element'
import {OrthographicCamera as ThreeOrthographicCamera} from 'three/src/cameras/OrthographicCamera.js'
import {Camera, type CameraAttributes} from './Camera.js'
import {autoDefineElements} from '../LumeConfig.js'

export type OrthographicCameraAttributes = CameraAttributes | 'left' | 'right' | 'top' | 'bottom'

/**
 * @class OrthographicCamera
 *
 * Defines a viewport into the 3D scene as will be seen on screen.
 *
 * Camera that uses orthographic projection.
 *
 * In this projection mode, an object's size in the rendered image stays constant regardless of
 * its distance from the camera.
 *
 * This can be useful for rendering 2D scenes and UI elements, amongst other things.
 *
 * @extends Camera
 */
export
@element('lume-orthographic-camera', autoDefineElements)
class OrthographicCamera extends Camera {
	/**
	 * @property {number} left
	 *
	 * *attribute*
	 *
	 * Default: `0`
	 *
	 * Camera frustum left plane.
	 *
	 * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
	 * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
	 */
	@numberAttribute left = 0

	/**
	 * @property {number} right
	 *
	 * *attribute*
	 *
	 * Default: `0`
	 *
	 * Camera frustum right plane.
	 *
	 * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
	 * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
	 */
	@numberAttribute right = 0

	/**
	 * @property {number} top
	 *
	 * *attribute*
	 *
	 * Default: `0`
	 *
	 * Camera frustum top plane.
	 *
	 * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
	 * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
	 */
	@numberAttribute top = 0

	/**
	 * @property {number} bottom
	 *
	 * *attribute*
	 *
	 * Default: `0`
	 *
	 * Camera frustum bottom plane.
	 *
	 * If `left`, `right`, `top`, and `bottom` are all `0`, the camera will be sized based on the
	 * current Scene's [`.calculatedSize`](../core/Scene#calculatedsize).
	 */
	@numberAttribute bottom = 0

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			this.three.left = this.left
			this.three.updateProjectionMatrix()
			this.needsUpdate()
		})

		this.createEffect(() => {
			this.three.right = this.right
			this.three.updateProjectionMatrix()
			this.needsUpdate()
		})

		this.createEffect(() => {
			this.three.top = this.top
			this.three.updateProjectionMatrix()
			this.needsUpdate()
		})

		this.createEffect(() => {
			this.three.bottom = this.bottom
			this.three.updateProjectionMatrix()
			this.needsUpdate()
		})

		this.createEffect(() => {
			if (!this.scene) {
				return
			}

			if (this.left || this.right || this.top || this.bottom) {
				this.three.updateProjectionMatrix()
				this.needsUpdate()
				return
			}

			// Auto set camera.
			this.three.left = -this.scene.calculatedSize.x / 2
			this.three.right = this.scene.calculatedSize.x / 2
			this.three.top = this.scene.calculatedSize.y / 2
			this.three.bottom = -this.scene.calculatedSize.y / 2

			this.three.updateProjectionMatrix()
			this.needsUpdate()
		})
	}

	override makeThreeObject3d() {
		return new ThreeOrthographicCamera()
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-orthographic-camera': ElementAttributes<OrthographicCamera, OrthographicCameraAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-orthographic-camera': OrthographicCamera
	}
}
