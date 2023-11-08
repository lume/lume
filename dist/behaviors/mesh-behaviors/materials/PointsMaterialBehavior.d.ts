import 'element-behaviors';
import { PointsMaterial } from 'three/src/materials/PointsMaterial.js';
import { MaterialBehavior, type MaterialBehaviorAttributes } from './MaterialBehavior.js';
export type PointsMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'sizeAttenuation' | 'pointSize';
export declare class PointsMaterialBehavior extends MaterialBehavior {
    texture: string;
    sizeAttenuation: boolean;
    pointSize: number;
    _createComponent(): PointsMaterial;
    loadGL(): void;
}
//# sourceMappingURL=PointsMaterialBehavior.d.ts.map