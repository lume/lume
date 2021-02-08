import {Color} from 'three/src/math/Color'
import {Light as ThreeLight} from 'three/src/lights/Light'
import {attribute, autorun, element, numberAttribute} from '@lume/element'
import {emits} from '@lume/eventful'
import Node from './Node'

import type {TColor} from '../utils/three'

/**
 * @abstract
 * @class LightBase - An abstract base class for light elements.
 * @extends Node
 */
@element
export default class LightBase extends Node {
	@attribute @emits('propertychange') color: TColor = 'white'
	@numberAttribute(1) @emits('propertychange') intensity: number = 1

	// This is not used in practice because this class is abstract, but this enforces
	// (in TypeScript) that subclasses that override this will return a subtype of
	// ThreeLight.
	makeThreeObject3d() {
		return new ThreeLight()
	}

	protected _loadGL() {
		if (!super._loadGL()) return false

		this._glStopFns.push(
			autorun(() => {
				if (typeof this.color === 'object') this.three.color = this.color
				this.three.color = new Color(this.color)
				this.needsUpdate()
			}),
			autorun(() => {
				this.three.intensity = this.intensity
				this.needsUpdate()
			}),
		)

		return true
	}
}

export {LightBase}
