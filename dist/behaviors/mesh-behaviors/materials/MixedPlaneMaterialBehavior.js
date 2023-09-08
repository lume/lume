import 'element-behaviors';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial.js';
import { NoBlending } from 'three/src/constants.js';
import { MaterialBehavior } from './MaterialBehavior.js';
export class MixedPlaneMaterialBehavior extends MaterialBehavior {
    constructor(element) {
        super(element);
        this.materialOpacity = 0.3;
        this.color = '#444';
    }
    _createComponent() {
        return new MeshPhongMaterial({ blending: NoBlending });
    }
}
if (globalThis.window?.document && !elementBehaviors.has('mixedplane-material'))
    elementBehaviors.define('mixedplane-material', MixedPlaneMaterialBehavior);
//# sourceMappingURL=MixedPlaneMaterialBehavior.js.map