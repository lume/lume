import {PointLight as ThreePointLight} from 'three/src/lights/PointLight.js'
import {autorun, numberAttribute, booleanAttribute, element} from '@lume/element'
import {emits} from '@lume/eventful'
import LightBase from './LightBase.js'

import type {LightAttributes} from './LightBase.js'

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

@element
export default class PointLight extends LightBase {
	static defaultElementName = 'lume-point-light'

	@numberAttribute(0) @emits('propertychange') distance = 0
	@numberAttribute(1) @emits('propertychange') decay = 1
	@booleanAttribute(true) @emits('propertychange') castShadow = true
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

export {PointLight}

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
