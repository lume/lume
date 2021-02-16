import 'element-behaviors'
import type {Constructor} from 'lowclass'
import {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial.js'
// import {multiple} from 'lowclass'
import BaseMaterialBehavior, {BaseMaterialBehaviorAttributes} from './BaseMaterialBehavior.js'
import MaterialTexture, {MaterialTextureAttributes} from './MaterialTexture.js'

export type PhongMaterialBehaviorAttributes = MaterialTextureAttributes | BaseMaterialBehaviorAttributes

// TODO find out why the below Constructor cast is needed (otherwise the types of
// MaterialTexture and BaseMaterialBehavior do not get inherited, WTF
// TypeScript).

// export default class PhongMaterialBehavior extends multiple(BaseMaterialBehavior, MaterialTexture) {
export default class PhongMaterialBehavior extends ((MaterialTexture.mixin(
	BaseMaterialBehavior,
) as unknown) as Constructor<MaterialTexture & BaseMaterialBehavior>) {
	foo: number = 123
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
