import {LightBase} from './LightBase.js'
import {AmbientLight as ThreeAmbientLight} from 'three/src/lights/AmbientLight.js'

import type {LightAttributes} from './LightBase.js'

export type AmbientLightAttributes = LightAttributes

/**
 * @class AmbientLight - The AmbientLight class is the implementation behind
 * `<lume-ambient-light>` elements.
 *
 * This light globally illuminates all objects in the scene equally.  It does
 * not cast shadows as it does not have a direction.
 */
export class AmbientLight extends LightBase {
	static defaultElementName = 'lume-ambient-light'

	makeThreeObject3d() {
		return new ThreeAmbientLight()
	}
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
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
