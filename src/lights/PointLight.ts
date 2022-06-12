import {PointLight as ThreePointLight} from 'three/src/lights/PointLight.js'
import {autorun, numberAttribute, booleanAttribute, element} from '@lume/element'
import {Light} from './Light.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {LightAttributes} from './Light.js'

export type PointLightAttributes =
	| LightAttributes
	| 'distance'
	| 'decay'
	| 'castShadow'
	| 'shadowMapWidth'
	| 'shadowMapHeight'
	| 'shadowRadius'
	| 'shadowBias'
	| 'shadowCameraNear'
	| 'shadowCameraFar'

// TODO @element jsdoc tag

/**
 * @element lume-point-light
 * @class PointLight -
 *
 * Element: `<lume-point-light>`
 *
 * An element that illuminates objects near it, casting shadows in any direction
 * away from the light by default. The light element itself is not visible; to
 * visualize it you can place a sphere as a child of the light for example.
 *
 * All mesh elements [receive](../meshes/Mesh#receiveshadow) or
 * [cast](../meshes/Mesh#castshadow) shadows by default.
 *
 * ## Example
 *
 * <div id="example"></div>
 *
 * <script type="application/javascript">
 *   new Vue({
 *     el: '#example',
 *     template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
 *     data: { code: pointLightExample() },
 *   })
 * </script>
 *
 * @extends Light
 */
@element('lume-point-light', autoDefineElements)
export class PointLight extends Light {
	@numberAttribute(0) distance = 0
	@numberAttribute(1) decay = 1
	@booleanAttribute(true) castShadow = true

	@numberAttribute(1 * 4 * Math.PI) // intensity 1
	get power() {
		// compute the light's luminous power (in lumens) from its intensity (in candela)
		// for an isotropic light source, luminous power (lm) = 4 π luminous intensity (cd)
		return this.intensity * 4 * Math.PI
	}
	set power(power) {
		// set the light's intensity (in candela) from the desired luminous power (in lumens)
		this.intensity = power / (4 * Math.PI)
	}
	// TODO @numberAttribute(1) power = computed(() => this.intensity * 4 * Math.PI) // see https://threejs.org/docs/index.html?q=light#api/en/lights/PointLight.power

	// These map to THREE.PointLightShadow properties.
	// https://threejs.org/docs/index.html?q=light#api/en/lights/shadows/PointLightShadow
	@numberAttribute(512) shadowMapWidth = 512
	@numberAttribute(512) shadowMapHeight = 512
	@numberAttribute(3) shadowRadius = 3
	@numberAttribute(0) shadowBias = 0
	@numberAttribute(1) shadowCameraNear = 1
	@numberAttribute(2000) shadowCameraFar = 2000

	override _loadGL() {
		if (!super._loadGL()) return false

		this._glStopFns.push(
			autorun(() => {
				const light = this.three

				light.distance = this.distance
				light.decay = this.decay
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

				shadow.needsUpdate = true
				this.needsUpdate()
			}),
		)

		return true
	}

	override makeThreeObject3d() {
		return new ThreePointLight()
	}
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-point-light': ElementAttributes<PointLight, PointLightAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-point-light': PointLight
	}
}
