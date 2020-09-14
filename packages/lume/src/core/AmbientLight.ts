import LightBase from './LightBase'
import {AmbientLight as ThreeAmbientLight} from 'three/src/lights/AmbientLight'

export default class AmbientLight extends LightBase {
	static defaultElementName = 'lume-ambient-light'

	protected _makeThreeObject3d() {
		const light = new ThreeAmbientLight()
		return light
	}
}

export {AmbientLight}
