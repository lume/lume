import {autorun, booleanAttribute, numberAttribute, reactive} from '@lume/element'
import 'element-behaviors'
import {PointsMaterial} from 'three/src/materials/PointsMaterial.js'
import {MaterialBehavior, MaterialBehaviorAttributes} from './MaterialBehavior.js'
import {MaterialTexture, MaterialTextureAttributes} from './MaterialTexture.js'

export type PointsMaterialBehaviorAttributes =
	| MaterialTextureAttributes
	| MaterialBehaviorAttributes
	| 'sizeAttenuation'
	| 'pointSize'

@reactive
export class PointsMaterialBehavior extends MaterialTexture(MaterialBehavior) {
	static _observedProperties = ['sizeAttenuation', 'pointSize', ...MaterialBehavior._observedProperties]

	@booleanAttribute(true) sizeAttenuation = true
	@numberAttribute(1) pointSize = 1

	get material(): PointsMaterial {
		return super.material as PointsMaterial
	}

	loadGL() {
		if (!super.loadGL()) return false

		this._stopFns.push(
			autorun(() => {
				this.sizeAttenuation
				this.updateMaterial('sizeAttenuation', this.sizeAttenuation)
			}),
			autorun(() => {
				this.pointSize
				this.updateMaterial('size', this.pointSize)
			}),
		)

		return true
	}

	_createComponent() {
		return new PointsMaterial({color: 0x00ff00})
	}
}

if (!elementBehaviors.has('points-material')) elementBehaviors.define('points-material', PointsMaterialBehavior)
