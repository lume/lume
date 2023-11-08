import 'element-behaviors';
import { MeshPhysicalMaterial } from 'three/src/materials/MeshPhysicalMaterial.js';
import { NoBlending } from 'three/src/constants.js';
import { PhysicalMaterialBehavior } from './PhysicalMaterialBehavior.js';
export class MixedPlaneMaterialBehavior extends PhysicalMaterialBehavior {
    constructor(element) {
        super(element);
        this.materialOpacity = 0.3;
        this.color = '#444';
    }
    _createComponent() {
        return new MeshPhysicalMaterial({ blending: NoBlending });
    }
}
if (globalThis.window?.document && !elementBehaviors.has('mixedplane-material'))
    elementBehaviors.define('mixedplane-material', MixedPlaneMaterialBehavior);
//# sourceMappingURL=MixedPlaneMaterialBehavior.js.map