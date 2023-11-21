import 'element-behaviors';
import { MeshPhysicalMaterial } from 'three/src/materials/MeshPhysicalMaterial.js';
import { NoBlending /*, DoubleSide*/ } from 'three/src/constants.js';
import { PhysicalMaterialBehavior } from './PhysicalMaterialBehavior.js';
/**
 * @class MixedPlaneMaterialBehavior -
 *
 * Used as the material for [`<lume-mixed-plane>`](../../../meshes/MixedPlane) elements.
 *
 * <live-code src="../../../../../examples/buttons-with-shadow.html"></live-code>
 *
 * @extends PhysicalMaterialBehavior
 */
export class MixedPlaneMaterialBehavior extends PhysicalMaterialBehavior {
    constructor(element) {
        super(element);
        // TODO, these should be class field overrides instead of constructor
        // properties, so that they include new defaults for attribute removal
        // from the decorators. At the moment, it isn't easy to override color
        // because it is a getter/setter and we have to copy over the logic,
        // which fails because the getter is accessed in the super class before
        // this subclass has a chance to define its private fields.
        /**
         * @property {number} materialOpacity -
         *
         * `override` `attribute`
         *
         * Default: `0.3`
         *
         * Overrides
         * [`PhysicalMaterialBehavior.materialOpacity`](./PhysicalMaterialBehavior#materialOpacity)
         * to give mixed planes a nice default for viewing DOM content behind
         * the WebGL canvas, while allowing some light to be caught on the
         * partially opaque surface for effect. This may require tweaking
         * depending on lighting and colors.
         */
        this.materialOpacity = 0.3;
        /**
         * @property {number} materialOpacity -
         *
         * `override` `attribute`
         *
         * Default: `0.3`
         *
         * Overrides [`PhysicalMaterialBehavior.color`](./PhysicalMaterialBehavior#color) to
         * give mixed planes a default tinted transparent surface over regular
         * DOM content, on which light effects can be drawn.
         */
        this.color = '#444';
    }
    _createComponent() {
        return new MeshPhysicalMaterial({ blending: NoBlending });
    }
}
if (globalThis.window?.document && !elementBehaviors.has('mixedplane-material'))
    elementBehaviors.define('mixedplane-material', MixedPlaneMaterialBehavior);
//# sourceMappingURL=MixedPlaneMaterialBehavior.js.map