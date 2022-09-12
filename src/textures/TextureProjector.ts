// Useful info on THREE.Plane not covered in Three.js docs:
// https://www.columbia.edu/~njn2118/journal/2019/2/18.html

import {booleanAttribute, element, ElementAttributes, reactive, stringAttribute} from '@lume/element'
import {createEffect} from 'solid-js'
import {OrthographicCamera} from 'three/src/cameras/OrthographicCamera.js'
import {Element3D, Element3DAttributes} from '../core/Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {Fitment} from '@lume/three-projected-material/dist/ProjectedMaterial'
import type {PerspectiveCamera} from 'three/src/cameras/PerspectiveCamera.js'

type TextureProjectorAttributes = Element3DAttributes | 'src' | 'fitment'
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
 * <div id="projectedTextureExample"></div>
 *
 * <script type="application/javascript">
 *   new Vue({ el: '#projectedTextureExample', data: { code: projectedTextureExample }, template: '<live-code :template="code" mode="html>iframe" :debounce="200" />' })
 * </script>
 *
 * @extends Element3D
 */
@element('lume-texture-projector', autoDefineElements)
export class TextureProjector extends Element3D {
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
	@stringAttribute('') src = ''

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
	@stringAttribute('cover') fitment: Fitment = 'cover'

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
	@booleanAttribute(false) frontFacesOnly = false

	// textureScale?: number
	// textureOffset?: Vector2

	// TODO support also perspective projection
	@reactive _camera: PerspectiveCamera | OrthographicCamera | null = null

	override _loadGL(): boolean {
		if (!super._loadGL()) return false

		this._camera = new OrthographicCamera()
		this.three.add(this._camera)

		// setTimeout(() => {
		// 	setInterval(() => {
		// 		this.three.remove(this._camera!)
		// 		this._camera =
		// 			this._camera instanceof OrthographicCamera ? new PerspectiveCamera() : new OrthographicCamera()
		// 		this.three.add(this._camera)
		// 	}, 500)
		// }, 3000)

		// Motor.addRenderTask(() => {
		// 	this._camera!.rotation.y += 0.005
		// })

		this.createGLEffect(() => {
			// CAM HELPER
			// const sphere = new Mesh(new SphereGeometry(10), new MeshPhongMaterial({color: 'white'}))
			// this._camera!.add(sphere)
			// const helper = new CameraHelper(this._camera!)
			// this.scene?.three.add(helper)
			// createEffect(() => {
			// 	this.version
			// 	this._camera?.updateProjectionMatrix()
			// 	helper.update()
			// })

			createEffect(() => {
				const size = this.calculatedSize
				const cam = this._camera!

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

		return true
	}

	override _unloadGL(): boolean {
		if (!super._unloadGL()) return false

		this.three.remove(this._camera!)
		this._camera = null

		return true
	}
}

declare module '@lume/element' {
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
