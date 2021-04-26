import 'element-behaviors'
import {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial.js'
// import {multiple} from 'lowclass'
import {MaterialBehavior, BaseMaterialBehaviorAttributes} from './MaterialBehavior.js'
import {MaterialTexture, MaterialTextureAttributes} from './MaterialTexture.js'

export type PhongMaterialBehaviorAttributes = MaterialTextureAttributes | BaseMaterialBehaviorAttributes

// export class PhongMaterialBehavior extends multiple(BaseMaterialBehavior, MaterialTexture) {
export class PhongMaterialBehavior extends MaterialTexture(MaterialBehavior) {
	// constructor(el: Element) {
	//     super(el)
	//     // CONTINUE: The multiple() helper runs, but there's a runtime error "Cannot read property 'nodeName' of undefined"
	// }
	_createComponent() {
		return new MeshPhongMaterial({color: 0x00ff00})
	}
}

if (!elementBehaviors.has('phong-material')) elementBehaviors.define('phong-material', PhongMaterialBehavior)
