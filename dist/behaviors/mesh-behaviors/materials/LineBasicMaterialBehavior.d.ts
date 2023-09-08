import 'element-behaviors';
import { LineBasicMaterial } from 'three/src/materials/LineBasicMaterial.js';
import { MaterialBehavior, MaterialBehaviorAttributes } from './MaterialBehavior.js';
export declare type LineBasicMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture';
export declare class LineBasicMaterialBehavior extends MaterialBehavior {
    texture: string;
    _createComponent(): LineBasicMaterial;
    loadGL(): void;
}
//# sourceMappingURL=LineBasicMaterialBehavior.d.ts.map