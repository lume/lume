import {effect, signal} from 'classy-solid'
import {Light as ThreeLight} from 'three/src/lights/Light.js'
import {element, numberAttribute} from '@lume/element'
import {Element3D} from '../core/Element3D.js'
import type {TColor} from '../utils/three.js'
import type {Element3DAttributes} from '../core/Element3D.js'
import {Colorful} from '../core/Colorful.js'

export type LightAttributes = Element3DAttributes | 'color' | 'intensity'

/**
 * @abstract
 * @class Light -
 *
 * `abstract`
 *
 * An abstract base class for light elements. This class has properties common
 * to all types of light.
 *
 * @extends Element3D
 */
export
@element({autoDefine: false})
abstract class Light extends Colorful(Element3D) {
	/**
	 * @property {string | number | THREE.Color | [number, number, number]} color -
	 *
	 * `attribute`
	 *
	 * Default: `"white"`
	 *
	 * The color of light that is emitted.
	 *
	 * See `Colorful.color` for detail on supported color values.
	 */
	declare color: TColor

	/**
	 * @property {number} intensity -
	 *
	 * `abstract`
	 *
	 * Default: `1`
	 *
	 * The intensity of the light.
	 *
	 * When [physically correct lighting](../core/Scene#physicallycorrectlights)
	 * is enabled, the units of intensity depend on the type of light (f.e.
	 * [`PointLight`](./PointLight) or [`SpotLight`](./SpotLight)).
	 */
	@numberAttribute intensity: number = 1

	// This is not used in practice because this class is abstract, but this enforces
	// (in TypeScript) that subclasses that override this will return a subtype of
	// ThreeLight.
	override makeThreeObject3d() {
		// @ts-expect-error Threelight is abstract
		return new ThreeLight()
	}

	@effect intensityEffect() {
		this.three.intensity = this.intensity
		this.needsUpdate()
	}

	// @ts-expect-error Dummy signal field finalizes effects after private fields to prevent TDZ
	@signal private __init_effects_ignore = 0
}
