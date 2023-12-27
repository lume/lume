import {numberAttribute, element} from '@lume/element'
import {onCleanup} from 'solid-js'
import {PointLight as ThreePointLight} from 'three/src/lights/PointLight.js'
import {PointLightHelper} from 'three/src/helpers/PointLightHelper.js'
import {Motor} from '../core/Motor.js'
import {LightWithShadow, type LightWithShadowAttributes} from './LightWithShadow.js'
import {autoDefineElements} from '../LumeConfig.js'

export type PointLightAttributes = LightWithShadowAttributes | 'distance' | 'decay'

// TODO @element jsdoc tag

/**
 * @element lume-point-light
 * @class PointLight -
 *
 * Element: `<lume-point-light>`
 *
 * An element that illuminates objects near it, casting shadows in any direction
 * away from the light by default. The light element itself is not visible; to
 * visualize it you can place a sphere as a child of the light for example.
 *
 * The light's shadow projection camera is a PerspectiveCamera with fov of 90,
 * with aspect of 1.
 *
 * All mesh elements [receive](../meshes/Mesh#receiveshadow) or
 * [cast](../meshes/Mesh#castshadow) shadows by default.
 *
 * ## Example
 *
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.content = pointLightExample()
 * </script>
 *
 * @extends LightWithShadow
 */
export
@element('lume-point-light', autoDefineElements)
class PointLight extends LightWithShadow {
	/**
	 * @property {number} intensity -
	 *
	 * `attribute`
	 *
	 * Default: `1`
	 *
	 * This light's intensity. Changing the intensity will also change the light's
	 * [`power`](#power) according to the formula `intensity * 4 * Math.PI`.
	 *
	 * When [physically correct lighting](../core/Scene#physicallycorrectlights)
	 * enabled, intensity is the luminous intensity of the light measured in
	 * candela (cd).
	 */
	@numberAttribute override intensity = 1

	// These map to THREE.PointLightShadow properties, which uses a perspective camera for shadow projection.
	// https://threejs.org/docs/index.html?q=light#api/en/lights/shadows/PointLightShadow
	@numberAttribute shadowCameraFov = 90

	/**
	 * @property {number} distance -
	 *
	 * `attribute`
	 *
	 * Default: `0`
	 *
	 * In the default lighting mode, when distance is zero, light does not
	 * attenuate (intensity stays constant as it travels away the light's
	 * position). When distance is non-zero, light will attenuate linearly from
	 * maximum intensity at the light's position down to zero at this distance
	 * from the light.
	 *
	 * When [physically correct lighting](../core/Scene#physicallycorrectlights)
	 * is enabled, when distance is zero, light will attenuate according to
	 * inverse-square law to infinite distance. When distance is non-zero, light
	 * will attenuate according to inverse-square law until near the distance
	 * cutoff, where it will then attenuate quickly and smoothly to 0.
	 * Inherently, cutoffs are not physically correct.
	 */
	@numberAttribute distance = 0

	/**
	 * @property {number} decay
	 *
	 * `attribute`
	 *
	 * Default: `1`
	 *
	 * The amount the light dims along the distance of the light.
	 *
	 * In [physically correct mode](../core/Scene#physicallycorrectlights), a
	 * decay value of `2` leads to physically realistic light falloff.
	 */
	@numberAttribute decay = 1

	/**
	 * @property {number} power -
	 *
	 * `attribute`
	 *
	 * Default: `1`
	 *
	 * This light's power. Changing the power will also change the light's
	 * [`intensity`](#intensity) according to the formula `power / (4 * Math.PI)`.
	 *
	 * When [physically correct lighting](../core/Scene#physicallycorrectlights)
	 * is enabled, power is the luminous power of the light measured in lumens
	 * (lm).
	 */
	@numberAttribute // (1 * 4 * Math.PI) // intensity 1
	get power() {
		// compute the light's luminous power (in lumens) from its intensity (in candela)
		// for an isotropic light source, luminous power (lm) = 4 π luminous intensity (cd)
		return this.intensity * 4 * Math.PI
	}
	set power(power) {
		// set the light's intensity (in candela) from the desired luminous power (in lumens)
		this.intensity = power / (4 * Math.PI)
	}

	// TODO computed properties, f.e.
	// @memo @numberAttribute power = this.intensity * 4 * Math.PI

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			const light = this.three

			light.distance = this.distance
			light.decay = this.decay

			// We don't need to set three.power here because threejs already maps that itself.

			this.needsUpdate()
		})

		this.createEffect(() => {
			if (!this.debug) return
			if (!this.scene) return

			const helper = new PointLightHelper(this.three, this.calculatedSize.x || 100)
			this.scene.three.add(helper)

			// Inifinite render loop while debugging, but oh well, its debug
			// mode, code is simpler this way.
			const task = Motor.addRenderTask(() => helper.update())

			onCleanup(() => {
				helper.dispose()
				this.scene!.three.remove(helper)
				Motor.removeRenderTask(task)
			})
		})
	}

	override makeThreeObject3d() {
		return new ThreePointLight()
	}
}

import type {ElementAttributes} from '@lume/element'

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-point-light': ElementAttributes<PointLight, PointLightAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-point-light': PointLight
	}
}
