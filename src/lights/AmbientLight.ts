import {element, numberAttribute, type ElementAttributes} from '@lume/element'
import {Light} from './Light.js'
import {AmbientLight as ThreeAmbientLight} from 'three/src/lights/AmbientLight.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {LightAttributes} from './Light.js'

export type AmbientLightAttributes = LightAttributes

/**
 * @class AmbientLight - The AmbientLight class is the implementation behind
 * `<lume-ambient-light>` elements.
 *
 * This light globally illuminates all objects in the scene equally.  It does
 * not cast shadows as it does not have a direction.
 *
 * @extends Light
 */
export
@element('lume-ambient-light', autoDefineElements)
class AmbientLight extends Light {
	/**
	 * @property {number} intensity -
	 *
	 * `override` `attribute`
	 *
	 * Default: `1`
	 *
	 * The intensity of the light.
	 *
	 * The intensity of this element does not change behavior when [physically
	 * correct lighting](../core/Scene#physicallycorrectlights) is enabled.
	 */
	@numberAttribute override intensity = 1

	override makeThreeObject3d() {
		return new ThreeAmbientLight()
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-ambient-light': ElementAttributes<AmbientLight, AmbientLightAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-ambient-light': AmbientLight
	}
}
