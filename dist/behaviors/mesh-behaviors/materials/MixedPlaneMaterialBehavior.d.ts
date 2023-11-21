import 'element-behaviors';
import { MeshPhysicalMaterial } from 'three/src/materials/MeshPhysicalMaterial.js';
import { PhysicalMaterialBehavior } from './PhysicalMaterialBehavior.js';
import type { ElementWithBehaviors } from 'element-behaviors';
/**
 * @class MixedPlaneMaterialBehavior -
 *
 * Used as the material for [`<lume-mixed-plane>`](../../../meshes/MixedPlane) elements.
 *
 * <live-code src="../../../../../examples/buttons-with-shadow.html"></live-code>
 *
 * @extends PhysicalMaterialBehavior
 */
export declare class MixedPlaneMaterialBehavior extends PhysicalMaterialBehavior {
    constructor(element: ElementWithBehaviors);
    _createComponent(): MeshPhysicalMaterial;
}
//# sourceMappingURL=MixedPlaneMaterialBehavior.d.ts.map