import 'element-behaviors';
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js';
import { MaterialBehavior, type MaterialBehaviorAttributes } from './MaterialBehavior.js';
export type StandardMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'aoMap' | 'aoMapIntensity' | 'bumpMap' | 'bumpScale' | 'displacementMap' | 'displacementScale' | 'displacementBias' | 'texture' | 'normalMap' | 'normalScale' | 'metalness' | 'metalnessMap' | 'morphNormals' | 'morphTargets' | 'roughness' | 'roughnessMap' | 'vertexTangents';
/**
 * @class StandardMaterialBehavior -
 *
 * A standard physically based material, using Metallic-Roughness workflow.
 *
 * Backed by Three.js [`THREE.MeshStandardMaterial`](https://threejs.org/docs/index.html#api/en/materials/MeshStandardMaterial)
 *
 * @extends MaterialBehavior
 */
export declare class StandardMaterialBehavior extends MaterialBehavior {
    aoMap: string;
    aoMapIntensity: number;
    bumpMap: string;
    bumpScale: number;
    displacementMap: string;
    displacementScale: number;
    displacementBias: number;
    texture: string;
    normalMap: string;
    normalScale: number;
    metalness: number;
    metalnessMap: string;
    roughness: number;
    roughnessMap: string;
    vertexTangents: boolean;
    morphTargets: boolean;
    morphNormals: boolean;
    _createComponent(): MeshStandardMaterial;
    loadGL(): void;
}
export type MixinBaseClass<T> = T extends new (..._: any) => infer I ? {
    [K in keyof T]: T[K];
} & (new (...args: any[]) => I) : new (...args: any[]) => T;
//# sourceMappingURL=StandardMaterialBehavior.d.ts.map