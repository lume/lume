import {booleanAttribute, numberAttribute, stringAttribute} from '@lume/element'
import 'element-behaviors'
import {PointsMaterial} from 'three/src/materials/PointsMaterial.js'
import {behavior} from '../../Behavior.js'
import {receiver} from '../../PropReceiver.js'
import {MaterialBehavior, MaterialBehaviorAttributes} from './MaterialBehavior.js'

export type PointsMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'sizeAttenuation' | 'pointSize'

export {PointsMaterialBehavior}
@behavior
class PointsMaterialBehavior extends MaterialBehavior {
	@stringAttribute @receiver texture = ''
	@booleanAttribute @receiver sizeAttenuation = true
	@numberAttribute @receiver pointSize = 1

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

if (!elementBehaviors.has('points-material')) elementBehaviors.define('points-material', PointsMaterialBehavior)
