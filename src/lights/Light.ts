import {Color} from 'three/src/math/Color.js'
import {Light as ThreeLight} from 'three/src/lights/Light.js'
import {attribute, element} from '@lume/element'
import {Element3D} from '../core/Element3D.js'

import type {TColor} from '../utils/three.js'
import type {Element3DAttributes} from '../core/Element3D.js'

export type LightAttributes = Element3DAttributes | 'color' | 'intensity'

/**
 * @abstract
 * @class Light -
 *
 * An abstract base class for light elements.
 *
 * @extends Element3D
 */
// @ts-expect-error decorator type doesn't work on abstract class
@element
export abstract class Light extends Element3D {
	/**
	 * @property {string | number | THREE.Color} color -
	 *
	 * `attribute`
	 *
	 * Default: `"white"`
	 *
	 * The color of light that is emitted.
	 *
	 * A string value can be any valid CSS color string, f.e. `"#ff6600"` or
	 * `"rgb(10,20,30)"`.
	 *
	 * A number value represents a hex color value, f.e.
	 * `0xff6600`.
	 *
	 * A `THREE.Color` instance can be assigned, and it will be copied to the
	 * element's internal color value upon assignment. Mutating the assigned
	 * `THREE.Color` after assignment will have no effect; instead you can
	 * assign it again each time you wish to update the color.
	 */
	@attribute color: TColor = 'white'

	/**
	 * @property {number} intensity -
	 *
	 * `abstract`
	 *
	 * The intensity of the light.
	 *
	 * When [physically correct lighting](../core/Scene#physicallycorrectlights)
	 * is enabled, the units of intensity depend on the type of light (f.e.
	 * [`PointLight`](./PointLight) <!-- or [`SpotLight`]() -->).
	 */
	abstract intensity: number

	// This is not used in practice because this class is abstract, but this enforces
	// (in TypeScript) that subclasses that override this will return a subtype of
	// ThreeLight.
	override makeThreeObject3d() {
		return new ThreeLight()
	}

	override _loadGL() {
		if (!super._loadGL()) return false

		this.createGLEffect(() => {
			if (typeof this.color === 'object') this.three.color = this.color
			this.three.color = new Color(this.color)
			this.needsUpdate()
		})

		this.createGLEffect(() => {
			this.three.intensity = this.intensity
			this.needsUpdate()
		})

		return true
	}
}
