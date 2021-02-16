import 'element-behaviors'
import {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial.js'
// import {multiple} from 'lowclass'
import BaseMaterialBehavior from './BaseMaterialBehavior.js'
import MaterialTexture from './MaterialTexture.js'

// export default class PhongMaterialBehavior extends multiple(BaseMaterialBehavior, MaterialTexture) {
export default class PhongMaterialBehavior extends MaterialTexture.mixin(BaseMaterialBehavior) {
	// constructor(el: Element) {
	//     super(el)
	//     // CONTINUE: The multiple() helper runs, but there's a runtime error "Cannot read property 'nodeName' of undefined"
	// }
	protected _createComponent() {
		return new MeshPhongMaterial({color: 0x00ff00})
	}
}

elementBehaviors.define('phong-material', PhongMaterialBehavior)

export {PhongMaterialBehavior}
