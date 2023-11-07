import 'element-behaviors'
import {stringAttribute, reactive} from '../../attribute.js'
import {MeshBasicMaterial} from 'three/src/materials/MeshBasicMaterial.js'
import {MaterialBehavior, type MaterialBehaviorAttributes} from './MaterialBehavior.js'

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
			() => this.texture, // map
			(mat, tex) => (mat.map = tex),
			mat => !!mat.map,
			() => {},
			true,
		)
		this._handleTexture(
			() => this.specularMap,
			(mat, tex) => (mat.specularMap = tex),
			mat => !!mat.specularMap,
			() => {},
			true,
		)
	}
}

if (globalThis.window?.document && !elementBehaviors.has('basic-material'))
	elementBehaviors.define('basic-material', BasicMaterialBehavior)
