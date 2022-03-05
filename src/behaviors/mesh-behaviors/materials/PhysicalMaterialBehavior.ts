import {numberAttribute, reactive} from '../../attribute.js'
import 'element-behaviors'
import {MeshPhysicalMaterial} from 'three/src/materials/MeshPhysicalMaterial.js'
import {StandardMaterialBehavior} from './StandardMaterialBehavior.js'

import type {StandardMaterialBehaviorAttributes} from './StandardMaterialBehavior.js'

export type PhysicalMaterialBehaviorAttributes =
	| StandardMaterialBehaviorAttributes
	| 'clearcoat'
	| 'clearcoatRoughness'
	| 'refractiveIndex'
	| 'reflectivity'
	| 'transmission'

@reactive
export class PhysicalMaterialBehavior extends StandardMaterialBehavior {
	// WIP
	@numberAttribute(0) clearcoat = 0
	// clearcoatMap
	// clearcoatNormalMap
	// clearcoatNormalScale
	@numberAttribute(0) clearcoatRoughness = 0
	// clearcoatRoughnessMap
	// defines
	@numberAttribute(1.5) refractiveIndex = 1.5
	@numberAttribute(0.5) reflectivity = 0.5
	// @numberAttribute(0) sheen = 0 // TODO update to latest three to enable this
	// @numberAttribute(0) sheenRoughness = 0
	// sheenRoughnessMap
	// sheenColor
	// sheenColorMap
	// @numberAttribute(0) specularIntensity = 0
	// specularIntensityMap
	// specularColor
	// specularColorMap
	@numberAttribute(0) transmission = 0
	// transmissionMap

	_createComponent() {
		return new MeshPhysicalMaterial({})
	}

	loadGL() {
		super.loadGL()

		const mat = this.meshComponent!

		this.createEffect(() => {
			mat.clearcoat = this.clearcoat
			mat.clearcoatRoughness = this.clearcoatRoughness
			mat.ior = this.refractiveIndex
			mat.reflectivity = this.reflectivity
			mat.transmission = this.transmission

			// TODO Needed?
			// mat.needsUpdate = true

			this.element.needsUpdate()
		})
	}
}

if (!elementBehaviors.has('physical-material')) elementBehaviors.define('physical-material', PhysicalMaterialBehavior)
