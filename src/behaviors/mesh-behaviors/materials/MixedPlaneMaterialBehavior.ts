import 'element-behaviors'
import {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial.js'
import {Color} from 'three/src/math/Color.js'
import {NoBlending /*, DoubleSide*/} from 'three/src/constants.js'
import {MaterialBehavior} from './MaterialBehavior.js'

export class MixedPlaneMaterialBehavior extends MaterialBehavior {
	override _createComponent() {
		// TODO PERFORMANCE we can re-use a single material for
		// all the DOM planes rather than a new material per
		// plane.
		return new MeshPhongMaterial({
			opacity: 0.5,
			color: new Color(0x111111),
			blending: NoBlending,
			//side	: DoubleSide,
		})
	}
}

if (!elementBehaviors.has('mixedplane-material'))
	elementBehaviors.define('mixedplane-material', MixedPlaneMaterialBehavior)
