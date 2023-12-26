import {numberAttribute, stringAttribute} from '@lume/element'
import 'element-behaviors'
import {MeshPhysicalMaterial} from 'three/src/materials/MeshPhysicalMaterial.js'
import {behavior} from '../../Behavior.js'
import {receiver} from '../../PropReceiver.js'
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

/**
 * @class PhysicalMaterialBehavior -
 *
 * An extension of the [`StandardMaterialBehavior`](./StandardMaterialBehavior), providing more advanced physically-based rendering properties.
 *
 * Backed by Three.js [`THREE.MeshPhysicalMaterial`](https://threejs.org/docs/index.html#api/en/materials/MeshPhysicalMaterial)
 *
 * @extends MaterialBehavior
 */
export
@behavior
class PhysicalMaterialBehavior extends StandardMaterialBehavior {
	// WIP
	@numberAttribute @receiver clearcoat = 0
	// clearcoatMap
	// clearcoatNormalMap
	// clearcoatNormalScale
	@numberAttribute @receiver clearcoatRoughness = 0
	// clearcoatRoughnessMap
	// defines
	@numberAttribute @receiver refractiveIndex = 1.5
	@numberAttribute @receiver reflectivity = 0.5
	// @numberAttribute @receiver sheen = 0 // TODO update to latest three to enable this
	// @numberAttribute @receiver sheenRoughness = 0
	// sheenRoughnessMap
	// sheenColor
	// sheenColorMap
	// @numberAttribute @receiver specularIntensity = 0
	// specularIntensityMap
	// specularColor
	// specularColorMap
	@numberAttribute @receiver transmission = 0
	@stringAttribute @receiver transmissionMap = ''

	override _createComponent() {
		return new MeshPhysicalMaterial({})
	}

	override connectedCallback() {
		super.connectedCallback()

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

			this.element.needsUpdate()
		})

		this._handleTexture(
			() => this.transmissionMap,
			(mat, tex) => (mat.transmissionMap = tex),
			mat => !!mat.transmissionMap,
		)
	}
}

if (globalThis.window?.document && !elementBehaviors.has('physical-material'))
	elementBehaviors.define('physical-material', PhysicalMaterialBehavior)
