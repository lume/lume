import 'element-behaviors'
import {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial.js'
import {NoBlending /*, DoubleSide*/} from 'three/src/constants.js'
import {MaterialBehavior} from './MaterialBehavior.js'
import type {ElementWithBehaviors} from 'element-behaviors'

/**
 * @class MixedPlaneMaterialBehavior -
 *
 * Used as the material for [`<lume-mixed-plane>`](../../../meshes/MixedPlane) elements.
 *
 * <div id="mixedPlaneExample"></div>
 *
 * <script type="application/javascript">
 *   new Vue({ el: '#mixedPlaneExample', data: { code: buttonsWithShadowExample }, template: '<live-code :template="code" mode="html>iframe" :debounce="200" />' })
 * </script>
 *
 * @extends MaterialBehavior
 */
export class MixedPlaneMaterialBehavior extends MaterialBehavior {
	constructor(element: ElementWithBehaviors) {
		super(element)

		/**
		 * @property {number} materialOpacity -
		 *
		 * `override` `attribute`
		 *
		 * Default: `0.3`
		 *
		 * Overrides
		 * [`MaterialBehavior.materialOpacity`](./MaterialBehavior#materialOpacity)
		 * to give mixed planes a nice default for viewing DOM content behind
		 * the WebGL canvas, while allowing some light to be caught on the
		 * partially opaque surface for effect. This may require tweaking
		 * depending on lighting and colors.
		 */
		this.materialOpacity = 0.3

		/**
		 * @property {number} materialOpacity -
		 *
		 * `override` `attribute`
		 *
		 * Default: `0.3`
		 *
		 * Overrides [`MaterialBehavior.color`](./MaterialBehavior#color) to
		 * give mixed planes a default tinted transparent surface over regular
		 * DOM content, on which light effects can be drawn.
		 */
		this.color = '#444'
	}

	override _createComponent() {
		// TODO PERFORMANCE we can re-use a single material for
		// all the mixed planes rather than a new material per
		// plane.
		return new MeshPhongMaterial({blending: NoBlending})
	}
}

if (globalThis.window?.document && !elementBehaviors.has('mixedplane-material'))
	elementBehaviors.define('mixedplane-material', MixedPlaneMaterialBehavior)
