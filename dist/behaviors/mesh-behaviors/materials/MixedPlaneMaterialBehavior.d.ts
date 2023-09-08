import 'element-behaviors';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial.js';
import { MaterialBehavior } from './MaterialBehavior.js';
import type { ElementWithBehaviors } from 'element-behaviors';
export declare class MixedPlaneMaterialBehavior extends MaterialBehavior {
    constructor(element: ElementWithBehaviors);
    _createComponent(): MeshPhongMaterial;
}
//# sourceMappingURL=MixedPlaneMaterialBehavior.d.ts.map