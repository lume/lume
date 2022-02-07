import {PointLight as ThreePointLight} from 'three/src/lights/PointLight.js'
import {autorun, numberAttribute, booleanAttribute, element} from '@lume/element'
import {emits} from '@lume/eventful'
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

/**
 * @element lume-point-light
 * @class PointLight -
 * > :construction: :hammer: Under construction! :hammer: :construction:
 *
 * The PointLight class is the implementation behind
 * `<lume-point-light>` elements.
 *
 * This light illuminates objects near it, casting shadows in any direction away from the light.
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
	@numberAttribute(0) @emits('propertychange') distance = 0
	@numberAttribute(1) @emits('propertychange') decay = 1
	@booleanAttribute(true) @emits('propertychange') castShadow = true
	// TODO @numberAttribute(1) power = computed(() => this.intensity * 4 * Math.PI) // see https://threejs.org/docs/index.html?q=light#api/en/lights/PointLight.power

	// These map to THREE.PointLightShadow properties.
	// https://threejs.org/docs/index.html?q=light#api/en/lights/shadows/PointLightShadow
	@numberAttribute(512) @emits('propertychange') shadowMapWidth = 512
	@numberAttribute(512) @emits('propertychange') shadowMapHeight = 512
	@numberAttribute(3) @emits('propertychange') shadowRadius = 3
	@numberAttribute(0) @emits('propertychange') shadowBias = 0
	@numberAttribute(1) @emits('propertychange') shadowCameraNear = 1
	@numberAttribute(2000) @emits('propertychange') shadowCameraFar = 2000

	_loadGL() {
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

	makeThreeObject3d() {
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
