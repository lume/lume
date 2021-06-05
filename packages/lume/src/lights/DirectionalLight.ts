import {DirectionalLight as ThreeDirectionalLight} from 'three/src/lights/DirectionalLight'
import {autorun, numberAttribute, booleanAttribute, element} from '@lume/element'
import {Light} from './Light.js'

import type {LightAttributes} from './Light.js'

export type DirectionalLightAttributes =
	| LightAttributes
	| 'castShadow'
	| 'shadowMapWidth'
	| 'shadowMapHeight'
	| 'shadowRadius'
	| 'shadowBias'
	| 'shadowCameraNear'
	| 'shadowCameraFar'

/**
 * @element lume-directional-light
 * @class DirectionalLight -
 * > :construction: :hammer: Under construction! :hammer: :construction:
 *
 * The DirectionalLight class is the implementation behind
 * `<lume-directional-light>` elements.
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
 * ## Example
 *
 * <div id="example"></div>
 *
 * <script type="application/javascript">
 *   new Vue({
 *     el: '#example',
 *     template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
 *     data: { code: directionalLightExample() },
 *   })
 * </script>
 *
 * @extends Light
 */
@element
export class DirectionalLight extends Light {
	static defaultElementName = 'lume-directional-light'

	@booleanAttribute(true) castShadow = true

	// These map to THREE.DirectionalLightShadow properties.
	// https://threejs.org/docs/index.html?q=light#api/en/lights/shadows/DirectionalLightShadow
	@numberAttribute(512) shadowMapWidth = 512
	@numberAttribute(512) shadowMapHeight = 512
	@numberAttribute(3) shadowRadius = 3
	@numberAttribute(0) shadowBias = 0
	@numberAttribute(1) shadowCameraNear = 1
	@numberAttribute(2000) shadowCameraFar = 2000
	@numberAttribute(1) shadowCameraTop = 1000
	@numberAttribute(1) shadowCameraRight = 1000
	@numberAttribute(1) shadowCameraBottom = -1000
	@numberAttribute(1) shadowCameraLeft = -1000

	_loadGL() {
		if (!super._loadGL()) return false

		this._glStopFns.push(
			autorun(() => {
				const light = this.three

				light.castShadow = this.castShadow

				const shadow = this.three.shadow

				shadow.mapSize.width = this.shadowMapWidth
				shadow.mapSize.height = this.shadowMapHeight
				shadow.radius = this.shadowRadius
				shadow.bias = this.shadowBias
				// TODO: auto-adjust near and far planes like we will with Camera,
				// unless the user supplies a manual value.
				shadow.camera.near = this.shadowCameraNear
				shadow.camera.far = this.shadowCameraFar
				shadow.camera.top = this.shadowCameraTop
				shadow.camera.right = this.shadowCameraRight
				shadow.camera.bottom = this.shadowCameraBottom
				shadow.camera.left = this.shadowCameraLeft
				// TODO what about top, bottom, right, left values for the OrthoGraphicCamera of DirectionalLightShadow?

				shadow.needsUpdate = true
				this.needsUpdate()
			}),
		)

		return true
	}

	makeThreeObject3d() {
		return new ThreeDirectionalLight()
	}
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
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
