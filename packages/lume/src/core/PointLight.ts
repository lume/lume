import {PointLight as ThreePointLight} from 'three'
import {autorun, reactive, numberAttribute, booleanAttribute} from '@lume/element'
import {emits} from '@lume/eventful'
import LightBase from './LightBase'

@reactive
export default class PointLight extends LightBase {
	static defaultElementName = 'i-point-light'

	three!: ThreePointLight

	@reactive @numberAttribute(0) @emits('propertychange') distance = 0
	@reactive @numberAttribute(1) @emits('propertychange') decay = 1
	@reactive @booleanAttribute(true) @emits('propertychange') castShadow = true
	@reactive @numberAttribute(512) @emits('propertychange') shadowMapWidth = 512
	@reactive @numberAttribute(512) @emits('propertychange') shadowMapHeight = 512
	@reactive @numberAttribute(3) @emits('propertychange') shadowRadius = 3
	@reactive @numberAttribute(0) @emits('propertychange') shadowBias = 0
	@reactive @numberAttribute(1) @emits('propertychange') shadowCameraNear = 1
	@reactive @numberAttribute(2000) @emits('propertychange') shadowCameraFar = 2000

	protected _loadGL() {
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

				this.needsUpdate()
			}),
		)

		return true
	}

	protected _makeThreeObject3d() {
		return new ThreePointLight()
	}
}

export {PointLight}
