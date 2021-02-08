import {Color} from 'three/src/math/Color'
import {attribute, autorun, element, numberAttribute} from '@lume/element'
import {emits} from '@lume/eventful'
import Node from './Node'

import type {TColor} from '../utils/three'
import type {Light} from 'three/src/lights/Light'

/**
 * @abstract
 * @class LightBase - An abstract base class for light elements.
 * @extends Node
 */
@element
export default class LightBase extends Node {
	three!: Light

	@attribute @emits('propertychange') color: TColor = 'white'
	@numberAttribute(1) @emits('propertychange') intensity: number = 1

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
