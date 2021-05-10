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

	loadGL() {
		if (!super.loadGL()) return false

		this._stopFns.push(
			autorun(() => {
				this.sizeAttenuation
				this.updateMaterial('sizeAttenuation')
			}),
			autorun(() => {
				this.pointSize
				// FIXME non-ideal cast. See FIXME in updateMaterial.
				this.updateMaterial('size' as PointsMaterialBehaviorAttributes, 'pointSize')
			}),
		)

		return true
	}

	updateMaterial<Prop extends PointsMaterialBehaviorAttributes>(propName: Prop, thisProp?: keyof this) {
		// FIXME This type cast is not ideal, but it works fine. Update it to
		// use F-Bounded Types to use the properties of the type of material
		// specified by this subclass.
		super.updateMaterial(propName as MaterialBehaviorAttributes, thisProp as MaterialBehaviorAttributes)
	}

	_createComponent() {
		return new PointsMaterial({color: 0x00ff00})
	}
}

if (!elementBehaviors.has('points-material')) elementBehaviors.define('points-material', PointsMaterialBehavior)
