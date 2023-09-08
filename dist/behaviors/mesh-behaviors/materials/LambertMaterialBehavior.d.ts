import 'element-behaviors';
import { MeshLambertMaterial } from 'three/src/materials/MeshLambertMaterial.js';
import { MaterialBehavior, MaterialBehaviorAttributes } from './MaterialBehavior.js';
export declare type LambertMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'specularMap';
export declare class LambertMaterialBehavior extends MaterialBehavior {
    texture: string;
    specularMap: string;
    _createComponent(): MeshLambertMaterial;
    loadGL(): void;
}
//# sourceMappingURL=LambertMaterialBehavior.d.ts.map