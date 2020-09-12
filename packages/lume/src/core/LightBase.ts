import {Color} from 'three/src/math/Color'
import {attribute, autorun, reactive, numberAttribute} from '@lume/element'
import {emits} from '@lume/eventful'
import {TColor} from '../utils/three'
import Node from './Node'

import type {Light} from 'three/src/lights/Light'

// base class for light elements.
@reactive
export default class LightBase extends Node {
	three!: Light

	@reactive @attribute @emits('propertychange') color: TColor = 'white'
	@reactive @numberAttribute(1) @emits('propertychange') intensity: number = 1

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
