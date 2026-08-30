import {stringAttribute, element, type ElementAttributes} from '@lume/element'
import {MeshBasicMaterial} from 'three/src/materials/MeshBasicMaterial.js'
import {MaterialBehaviorEl, type MaterialBehaviorElAttributes} from './MaterialBehaviorEl.js'
import {autoDefineElements} from '../../../LumeConfig.js'

export type BasicMaterialAttributes = MaterialBehaviorElAttributes | 'texture' | 'specularMap'

/**
 * @class BasicMaterial -
 *
 * Element: `<lume-basic-material>`
 *
 * @extends MaterialBehaviorEl
 * @element lume-basic-material
 */
export
@element('lume-basic-material', autoDefineElements)
class BasicMaterial extends MaterialBehaviorEl {
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

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-basic-material': ElementAttributes<BasicMaterial, BasicMaterialAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-basic-material': BasicMaterial
	}
}
