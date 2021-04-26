import 'element-behaviors'
import {MeshBasicMaterial} from 'three/src/materials/MeshBasicMaterial.js'
// import {multiple} from 'lowclass'
import {MaterialBehavior} from './MaterialBehavior.js'
import {MaterialTexture} from './MaterialTexture.js'

// export class BasicMaterialBehavior extends multiple(BaseMaterialBehavior, MaterialTexture) {
export class BasicMaterialBehavior extends MaterialTexture(MaterialBehavior) {
	// constructor(el: Element) {
	//     super(el)
	// }
	_createComponent() {
		return new MeshBasicMaterial({color: 0x00ff00})
	}
}

if (!elementBehaviors.has('basic-material')) elementBehaviors.define('basic-material', BasicMaterialBehavior)
