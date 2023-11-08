import 'element-behaviors';
import { MeshPhysicalMaterial } from 'three/src/materials/MeshPhysicalMaterial.js';
import { StandardMaterialBehavior } from './StandardMaterialBehavior.js';
import type { StandardMaterialBehaviorAttributes } from './StandardMaterialBehavior.js';
export type PhysicalMaterialBehaviorAttributes = StandardMaterialBehaviorAttributes | 'clearcoat' | 'clearcoatRoughness' | 'refractiveIndex' | 'reflectivity' | 'transmission' | 'transmissionMap';
export declare class PhysicalMaterialBehavior extends StandardMaterialBehavior {
    clearcoat: number;
    clearcoatRoughness: number;
    refractiveIndex: number;
    reflectivity: number;
    transmission: number;
    transmissionMap: string;
    _createComponent(): MeshPhysicalMaterial;
    loadGL(): void;
}
//# sourceMappingURL=PhysicalMaterialBehavior.d.ts.map