import 'element-behaviors';
import { MeshPhysicalMaterial } from 'three/src/materials/MeshPhysicalMaterial.js';
import { PhysicalMaterialBehavior } from './PhysicalMaterialBehavior.js';
import type { ElementWithBehaviors } from 'element-behaviors';
export declare class MixedPlaneMaterialBehavior extends PhysicalMaterialBehavior {
    constructor(element: ElementWithBehaviors);
    _createComponent(): MeshPhysicalMaterial;
}
//# sourceMappingURL=MixedPlaneMaterialBehavior.d.ts.map