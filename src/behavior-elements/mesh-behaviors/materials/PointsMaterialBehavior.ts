import {booleanAttribute, numberAttribute, stringAttribute, element} from '@lume/element'
import {PointsMaterial} from 'three/src/materials/PointsMaterial.js'
import {MaterialBehavior, type MaterialBehaviorAttributes} from './MaterialBehavior.js'
import {autoDefineElements} from '../../../LumeConfig.js'

export type PointsMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'sizeAttenuation' | 'pointSize'

/**
 * @class PointsMaterialBehavior -
 *
 * Element: `points-material`
 *
 * @extends MaterialBehavior
 * @element points-material
 */
export
@element('points-material', autoDefineElements)
class PointsMaterialBehavior extends MaterialBehavior {
	@stringAttribute texture = ''
	@booleanAttribute sizeAttenuation = false
	@numberAttribute pointSize = 1

	override _createComponent() {
		return new PointsMaterial({color: 0x00ff00})
	}

	protected override _parentDefinedEffect(parent: NonNullable<this['composedParent']> = this.composedParent!) {
		super._parentDefinedEffect(parent)

		this.createEffect(() => {
			const mat = this.meshComponent
			if (!mat) return

			mat.sizeAttenuation = this.sizeAttenuation
			mat.size = this.pointSize

			parent.needsUpdate()
		})

		this._handleTexture(
			() => this.texture,
			(mat, tex) => (mat.map = tex),
			mat => !!mat.map,
			() => {},
			true,
		)
	}
}
