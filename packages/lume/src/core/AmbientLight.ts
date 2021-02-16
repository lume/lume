import LightBase from './LightBase.js'
import {AmbientLight as ThreeAmbientLight} from 'three/src/lights/AmbientLight.js'

/**
 * @class AmbientLight - The AmbientLight class is the implementation behind
 * `<lume-ambient-light>` elements.
 *
 * This light globally illuminates all objects in the scene equally.  It does
 * not cast shadows as it does not have a direction.
 */
export default class AmbientLight extends LightBase {
	static defaultElementName = 'lume-ambient-light'

	makeThreeObject3d() {
		return new ThreeAmbientLight()
	}
}

export {AmbientLight}
