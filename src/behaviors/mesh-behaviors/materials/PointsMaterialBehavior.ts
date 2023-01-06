import {booleanAttribute, numberAttribute, reactive, stringAttribute} from '../../attribute.js'
import 'element-behaviors'
import {PointsMaterial} from 'three/src/materials/PointsMaterial.js'
import {MaterialBehavior, MaterialBehaviorAttributes} from './MaterialBehavior.js'

export type PointsMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'sizeAttenuation' | 'pointSize'

@reactive
export class PointsMaterialBehavior extends MaterialBehavior {
	@stringAttribute('') texture = ''
	@booleanAttribute(true) sizeAttenuation = true
	@numberAttribute(1) pointSize = 1

	override _createComponent() {
		return new PointsMaterial({color: 0x00ff00})
	}

	override loadGL() {
		super.loadGL()

		this.createEffect(() => {
			const mat = this.meshComponent
			if (!mat) return

			mat.sizeAttenuation = this.sizeAttenuation
			mat.size = this.pointSize

			this.element.needsUpdate()
		})

		this._handleTexture(
			() => this.texture,
			(mat, tex) => (mat.map = tex),
			mat => !!mat.map,
		)
	}
}

if (globalThis.window?.document && !elementBehaviors.has('points-material'))
	elementBehaviors.define('points-material', PointsMaterialBehavior)
