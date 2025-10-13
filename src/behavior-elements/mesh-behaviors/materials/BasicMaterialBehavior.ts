import {stringAttribute, element} from '@lume/element'
import {MeshBasicMaterial} from 'three/src/materials/MeshBasicMaterial.js'
import {MaterialBehavior, type MaterialBehaviorAttributes} from './MaterialBehavior.js'
import {autoDefineElements} from '../../../LumeConfig.js'

export type BasicMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'specularMap'

/**
 * @class BasicMaterialBehavior -
 *
 * Element: `basic-material`
 *
 * @extends MaterialBehavior
 * @element basic-material
 */
export
@element('basic-material', autoDefineElements)
class BasicMaterialBehavior extends MaterialBehavior {
	@stringAttribute texture = ''
	@stringAttribute specularMap = ''

	override _createComponent() {
		return new MeshBasicMaterial()
	}

	protected override _parentDefinedEffect(parent: NonNullable<this['composedParent']> = this.composedParent!) {
		super._parentDefinedEffect(parent)

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
