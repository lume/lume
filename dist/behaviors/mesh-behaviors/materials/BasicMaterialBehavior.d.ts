import 'element-behaviors';
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial.js';
import { MaterialBehavior, type MaterialBehaviorAttributes } from './MaterialBehavior.js';
export type BasicMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'specularMap';
export declare class BasicMaterialBehavior extends MaterialBehavior {
    texture: string;
    specularMap: string;
    _createComponent(): MeshBasicMaterial;
    loadGL(): void;
}
//# sourceMappingURL=BasicMaterialBehavior.d.ts.map