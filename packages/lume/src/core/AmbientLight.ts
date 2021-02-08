import LightBase from './LightBase'
import {AmbientLight as ThreeAmbientLight} from 'three/src/lights/AmbientLight'

export default class AmbientLight extends LightBase {
	static defaultElementName = 'lume-ambient-light'

	makeThreeObject3d() {
		return new ThreeAmbientLight()
	}
}

export {AmbientLight}
