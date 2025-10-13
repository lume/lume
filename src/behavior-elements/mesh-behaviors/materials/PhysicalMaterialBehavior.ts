import {numberAttribute, stringAttribute, element} from '@lume/element'
import {MeshPhysicalMaterial} from 'three/src/materials/MeshPhysicalMaterial.js'
import {StandardMaterialBehavior} from './StandardMaterialBehavior.js'
import {autoDefineElements} from '../../../LumeConfig.js'

import type {StandardMaterialBehaviorAttributes} from './StandardMaterialBehavior.js'

export type PhysicalMaterialBehaviorAttributes =
	| StandardMaterialBehaviorAttributes
	| 'clearcoat'
	| 'clearcoatRoughness'
	| 'refractiveIndex'
	| 'reflectivity'
	| 'transmission'
	| 'transmissionMap'

/**
 * @class PhysicalMaterialBehavior -
 *
 * Element: `physical-material`
 *
 * An extension of the [`StandardMaterialBehavior`](./StandardMaterialBehavior), providing more advanced physically-based rendering properties.
 *
 * Backed by Three.js [`THREE.MeshPhysicalMaterial`](https://threejs.org/docs/index.html#api/en/materials/MeshPhysicalMaterial)
 *
 * @extends StandardMaterialBehavior
 * @element physical-material
 */
export
@element('physical-material', autoDefineElements)
class PhysicalMaterialBehavior extends StandardMaterialBehavior {
	// WIP
	@numberAttribute clearcoat = 0
	// clearcoatMap
	// clearcoatNormalMap
	// clearcoatNormalScale
	@numberAttribute clearcoatRoughness = 0
	// clearcoatRoughnessMap
	// defines
	@numberAttribute refractiveIndex = 1.5
	@numberAttribute reflectivity = 0.5
	// @numberAttribute @receiver sheen = 0 // TODO update to latest three to enable this
	// @numberAttribute @receiver sheenRoughness = 0
	// sheenRoughnessMap
	// sheenColor
	// sheenColorMap
	// @numberAttribute @receiver specularIntensity = 0
	// specularIntensityMap
	// specularColor
	// specularColorMap
	@numberAttribute transmission = 0
	@stringAttribute transmissionMap = ''

	override _createComponent() {
		return new MeshPhysicalMaterial({})
	}

	protected override _parentDefinedEffect(parent: NonNullable<this['composedParent']> = this.composedParent!) {
		super._parentDefinedEffect(parent)

		this.createEffect(() => {
			const mat = this.meshComponent
			if (!mat) return

			mat.clearcoat = this.clearcoat
			mat.clearcoatRoughness = this.clearcoatRoughness
			mat.ior = this.refractiveIndex
			mat.reflectivity = this.reflectivity
			mat.transmission = this.transmission

			// TODO Needed?
			// mat.needsUpdate = true

			parent.needsUpdate()
		})

		this._handleTexture(
			() => this.transmissionMap,
			(mat, tex) => (mat.transmissionMap = tex),
			mat => !!mat.transmissionMap,
		)
	}
}
