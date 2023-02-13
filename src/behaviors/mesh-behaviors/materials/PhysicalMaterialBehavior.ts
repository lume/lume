import {numberAttribute, reactive, stringAttribute} from '../../attribute.js'
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
	| 'transmissionMap'

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
	@stringAttribute('') transmissionMap = ''
	@numberAttribute(0) thickness = 0
	@stringAttribute('') thicknessMap = ''

	override _createComponent() {
		return new MeshPhysicalMaterial({})
	}

	override loadGL() {
		super.loadGL()

		this.createEffect(() => {
			const mat = this.meshComponent
			if (!mat) return

			mat.clearcoat = this.clearcoat
			mat.clearcoatRoughness = this.clearcoatRoughness
			mat.ior = this.refractiveIndex
			mat.reflectivity = this.reflectivity
			mat.transmission = this.transmission
			mat.thickness = this.thickness

			// TODO Needed?
			// mat.needsUpdate = true

			this.element.needsUpdate()
		})

		this._handleTexture(
			() => this.transmissionMap,
			(mat, tex) => (mat.transmissionMap = tex),
			mat => !!mat.transmissionMap,
		)

		this._handleTexture(
			() => this.thicknessMap,
			(mat, tex) => (mat.thicknessMap = tex),
			mat => !!mat.thicknessMap,
		)
	}
}

if (globalThis.window?.document && !elementBehaviors.has('physical-material'))
	elementBehaviors.define('physical-material', PhysicalMaterialBehavior)
