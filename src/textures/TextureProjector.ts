// Useful info on THREE.Plane not covered in Three.js docs:
// https://www.columbia.edu/~njn2118/journal/2019/2/18.html

import {signal} from 'classy-solid'
import {booleanAttribute, element, type ElementAttributes, stringAttribute} from '@lume/element'
import {createEffect} from 'solid-js'
import {OrthographicCamera} from 'three/src/cameras/OrthographicCamera.js'
import {Element3D, type Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {Fitment} from '@lume/three-projected-material/dist/ProjectedMaterial.js'
import type {PerspectiveCamera} from 'three/src/cameras/PerspectiveCamera.js'

export type TextureProjectorAttributes = Element3DAttributes | 'src' | 'fitment'
// | 'frontFacesOnly'

/**
 * @class TextureProjector
 *
 * Element: `<lume-texture-projector>`
 *
 * An non-rendered plane that can be placed anywhere in 3D space to project a
 * texture onto mesh elements that have `projected-material` behaviors.
 *
 * For now only one `<lume-texture-projector>` can be associated to a mesh, and
 * only with an orthographic projection (perpendicular to the plane, i.e. along
 * the direction the plane is facing). Later on we'll support perspective
 * projection and multiple projections.
 *
 * To project a texture onto a mesh element, add a
 * [`projected-material`](../behaviors/mesh-behaviors/ProjectedMaterialBehavior)
 * behavior to the element using the `has=""` attribute, then assign an array of
 * `<lume-texture-projector>` elements, or a string of comma-separated CSS
 * selectors, to the element's `projectedTextures` property. The equivalent
 * dash-case attribute accepts only the string of selectors. Only the first
 * texture is used, for now.
 *
 * <live-code id="example"></live-code>
 * <script>
 *   example.content = projectedTextureExample
 * </script>
 *
 * @extends Element3D
 */
export
@element('lume-texture-projector', autoDefineElements)
class TextureProjector extends Element3D {
	// This element is only a data and camera container, and
	// ProjectedMaterialBehavior reacts to the properties.

	// TODO selector or ref to <video>, <img>, and other elements. If a animated
	// (f.e. <video>) the texture should reflect that accordingly.
	/**
	 * @property {string} src
	 *
	 * `attribute`
	 *
	 * Default: `''`
	 *
	 * The path to an image to be used as a projected
	 * texture.
	 */
	@stringAttribute src = ''

	/**
	 * @property {'cover' | 'contain'} fitment
	 *
	 * `attribute`
	 *
	 * Default: `'cover'`
	 *
	 * Fitment of the image within the size area on X and Y. Similar to the CSS
	 * object-fit property, but supporting only "cover" and "contain" fitments.
	 */
	@stringAttribute fitment: Fitment = 'cover'

	/* FIXME - documentation not exposed yet, experimental, does not work yet due to this issue:
	 * https://github.com/marcofugaro/three-projected-material/issues/46
	 *
	 * @property {boolean} frontFacesOnly
	 *
	 * `attribute`
	 *
	 * Default: `false`
	 *
	 * If `true`, the texture is projected only onto faces facing the projector
	 * (this element), similar to a real life projector. Otherwise, the
	 * projection hits all surfaces, even those facing away from the projector
	 * (this element).
	 */
	@booleanAttribute frontFacesOnly = false

	// textureScale?: number
	// textureOffset?: Vector2

	// TODO support also perspective projection
	@signal threeCamera: PerspectiveCamera | OrthographicCamera | null = null

	override connectedCallback() {
		super.connectedCallback()

		this.threeCamera = new OrthographicCamera()
		this.three.add(this.threeCamera)

		// setTimeout(() => {
		// 	setInterval(() => {
		// 		this.three.remove(this.threeCamera!)
		// 		this.threeCamera =
		// 			this.threeCamera instanceof OrthographicCamera ? new PerspectiveCamera() : new OrthographicCamera()
		// 		this.three.add(this.threeCamera)
		// 	}, 500)
		// }, 3000)

		// Motor.addRenderTask(() => {
		// 	this.threeCamera!.rotation.y += 0.005
		// })

		this.createEffect(() => {
			// CAM HELPER
			// const sphere = new Mesh(new SphereGeometry(10), new MeshPhongMaterial({color: 'white'}))
			// this.threeCamera!.add(sphere)
			// const helper = new CameraHelper(this.threeCamera!)
			// this.scene?.three.add(helper)
			// createEffect(() => {
			// 	this.version
			// 	this.threeCamera?.updateProjectionMatrix()
			// 	helper.update()
			// })

			createEffect(() => {
				const size = this.calculatedSize
				const cam = this.threeCamera!

				if (cam instanceof OrthographicCamera) {
					cam.left = -size.x / 2
					cam.right = size.x / 2
					cam.top = size.y / 2 // positive Y is up in Three
					cam.bottom = -size.y / 2
					// cam.near and cam.far don't matter for projection when using OrthographicCamera
				} else {
					cam.near = 1
					cam.far = 10000
					cam.aspect = 1
					cam.fov = 45
				}

				cam.updateProjectionMatrix()

				// CAM HELPER
				// helperCamera.copy(cam)
				// helperCamera.updateProjectionMatrix()
				// helper.update()

				this.needsUpdate()
			})
		})
	}

	override disconnectedCallback() {
		super.disconnectedCallback()

		this.three.remove(this.threeCamera!)
		this.threeCamera = null
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-texture-projector': ElementAttributes<TextureProjector, TextureProjectorAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-texture-projector': TextureProjector
	}
}
