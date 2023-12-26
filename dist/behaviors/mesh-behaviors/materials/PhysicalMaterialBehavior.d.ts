import 'element-behaviors';
import { MeshPhysicalMaterial } from 'three/src/materials/MeshPhysicalMaterial.js';
import { StandardMaterialBehavior } from './StandardMaterialBehavior.js';
import type { StandardMaterialBehaviorAttributes } from './StandardMaterialBehavior.js';
export type PhysicalMaterialBehaviorAttributes = StandardMaterialBehaviorAttributes | 'clearcoat' | 'clearcoatRoughness' | 'refractiveIndex' | 'reflectivity' | 'transmission' | 'transmissionMap';
/**
 * @class PhysicalMaterialBehavior -
 *
 * An extension of the [`StandardMaterialBehavior`](./StandardMaterialBehavior), providing more advanced physically-based rendering properties.
 *
 * Backed by Three.js [`THREE.MeshPhysicalMaterial`](https://threejs.org/docs/index.html#api/en/materials/MeshPhysicalMaterial)
 *
 * @extends MaterialBehavior
 */
export declare class PhysicalMaterialBehavior extends StandardMaterialBehavior {
    clearcoat: number;
    clearcoatRoughness: number;
    refractiveIndex: number;
    reflectivity: number;
    transmission: number;
    transmissionMap: string;
    _createComponent(): MeshPhysicalMaterial;
    connectedCallback(): void;
}
//# sourceMappingURL=PhysicalMaterialBehavior.d.ts.map