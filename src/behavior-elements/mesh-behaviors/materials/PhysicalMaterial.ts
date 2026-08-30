import {numberAttribute, stringAttribute, element, type ElementAttributes} from '@lume/element'
import {MeshPhysicalMaterial} from 'three/src/materials/MeshPhysicalMaterial.js'
import {StandardMaterial} from './StandardMaterial.js'
import {autoDefineElements} from '../../../LumeConfig.js'

import type {StandardMaterialAttributes} from './StandardMaterial.js'

export type PhysicalMaterialAttributes =
	| StandardMaterialAttributes
	| 'clearcoat'
	| 'clearcoatRoughness'
	| 'refractiveIndex'
	| 'reflectivity'
	| 'transmission'
	| 'transmissionMap'

/**
 * @class PhysicalMaterial -
 *
 * Element: `<lume-physical-material>`
 *
 * An extension of the [`StandardMaterial`](./StandardMaterial), providing more advanced physically-based rendering properties.
 *
 * Backed by Three.js [`THREE.MeshPhysicalMaterial`](https://threejs.org/docs/index.html#api/en/materials/MeshPhysicalMaterial)
 *
 * @extends StandardMaterial
 * @element lume-physical-material
 */
export
@element('lume-physical-material', autoDefineElements)
class PhysicalMaterial extends StandardMaterial {
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

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-physical-material': ElementAttributes<PhysicalMaterial, PhysicalMaterialAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-physical-material': PhysicalMaterial
	}
}
