import {DirectionalLight as ThreeDirectionalLight} from 'three/src/lights/DirectionalLight.js'
import {numberAttribute, element} from '@lume/element'
import {LightWithShadow, type LightWithShadowAttributes} from './LightWithShadow.js'
import {autoDefineElements} from '../LumeConfig.js'

export type DirectionalLightAttributes =
	| LightWithShadowAttributes
	| 'shadowCameraTop'
	| 'shadowCameraRight'
	| 'shadowCameraBottom'
	| 'shadowCameraLeft'

// TODO @element jsdoc tag
/**
 * @element lume-directional-light
 * @class DirectionalLight -
 *
 * Element: `<lume-directional-light>`
 *
 * This creates light with a particular direction all over the world. Think of
 * it like a point light infinitely (or very) far away, and the emitted light
 * rays are effectively all parallel. An example use case could be emulating
 * the sun, which is far enough away that on earth all the rays seem to be
 * parallel.
 *
 * The direction of the light is the direction from the light's
 * `position` to the world origin (the center of a scene's viewport).
 *
 * When casting shadows, an orthographic camera is used, and shadows are limited
 * to be within the ortho box specified by the `shadowCamera*` properties. While
 * light color affects all objects in a scene, only objects within the shadow
 * camera limits will be affects by shadows.
 *
 * ## Example
 *
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.code = directionalLightExample()
 * </script>
 *
 * @extends LightWithShadow
 */
export
@element('lume-directional-light', autoDefineElements)
class DirectionalLight extends LightWithShadow {
	/**
	 * @property {number} intensity -
	 *
	 * `override` `attribute`
	 *
	 * Default: `1`
	 *
	 * The intensity of the light.
	 *
	 * The intensity of this element does not change behavior when [physically
	 * correct lighting](../core/Scene#physicallycorrectlights) is enabled.
	 */
	@numberAttribute override intensity = 1

	// These map to THREE.DirectionalLightShadow properties, which uses an orthographic camera for shadow projection.
	// https://threejs.org/docs/index.html?q=light#api/en/lights/shadows/DirectionalLightShadow
	@numberAttribute shadowCameraTop = 1000
	@numberAttribute shadowCameraRight = 1000
	@numberAttribute shadowCameraBottom = -1000
	@numberAttribute shadowCameraLeft = -1000

	override _loadGL() {
		if (!super._loadGL()) return false

		this.createGLEffect(() => {
			const light = this.three
			const shadow = light.shadow

			shadow.camera.top = this.shadowCameraTop
			shadow.camera.right = this.shadowCameraRight
			shadow.camera.bottom = this.shadowCameraBottom
			shadow.camera.left = this.shadowCameraLeft

			shadow.needsUpdate = true
			this.needsUpdate()
		})

		return true
	}

	override makeThreeObject3d() {
		return new ThreeDirectionalLight()
	}
}

import type {ElementAttributes} from '@lume/element'

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-directional-light': ElementAttributes<DirectionalLight, DirectionalLightAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-directional-light': DirectionalLight
	}
}
