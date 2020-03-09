import 'element-behaviors'
import {MeshPhongMaterial, Color, NoBlending /*DoubleSide*/} from 'three'
import BaseMaterialBehavior from './BaseMaterialBehavior'
import MaterialTexture from './MaterialTexture'

export default class DOMNodeMaterialBehavior extends MaterialTexture.mixin(BaseMaterialBehavior) {
	protected _createComponent() {
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

elementBehaviors.define('domnode-material', DOMNodeMaterialBehavior)

export {DOMNodeMaterialBehavior}
