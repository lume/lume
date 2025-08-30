import {booleanAttribute, numberAttribute, stringAttribute, element} from '@lume/element'
import {PointsMaterial} from 'three/src/materials/PointsMaterial.js'
import {MaterialBehavior, type MaterialBehaviorAttributes} from './MaterialBehavior.js'
import {autoDefineElements} from '../../LumeConfig.js'

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
	@booleanAttribute sizeAttenuation = true
	@numberAttribute pointSize = 1

	override _createComponent() {
		return new PointsMaterial({color: 0x00ff00})
	}

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			const mat = this.meshComponent
			if (!mat) return

			mat.sizeAttenuation = this.sizeAttenuation
			mat.size = this.pointSize

			this.parentElement?.needsUpdate()
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