import 'element-behaviors'
import {stringAttribute, reactive} from '../../attribute.js'
import {MeshBasicMaterial} from 'three/src/materials/MeshBasicMaterial.js'
import {MaterialBehavior, MaterialBehaviorAttributes} from './MaterialBehavior.js'

export type BasicMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'specularMap'

@reactive
export class BasicMaterialBehavior extends MaterialBehavior {
	@stringAttribute('') texture = ''
	@stringAttribute('') specularMap = ''

	override _createComponent() {
		return new MeshBasicMaterial()
	}

	override loadGL() {
		super.loadGL()

		this._handleTexture(
			() => this.texture,
			tex => (this.meshComponent!.map = tex),
			() => !!this.meshComponent!.map,
		)
		this._handleTexture(
			() => this.specularMap,
			tex => (this.meshComponent!.specularMap = tex),
			() => !!this.meshComponent!.specularMap,
		)
	}
}

if (!elementBehaviors.has('basic-material')) elementBehaviors.define('basic-material', BasicMaterialBehavior)
