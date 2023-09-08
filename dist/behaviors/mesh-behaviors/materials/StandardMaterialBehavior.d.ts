import 'element-behaviors';
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js';
import { MaterialBehavior, MaterialBehaviorAttributes } from './MaterialBehavior.js';
export declare type StandardMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'aoMap' | 'aoMapIntensity' | 'bumpMap' | 'bumpScale' | 'displacementMap' | 'displacementScale' | 'displacementBias' | 'texture' | 'normalMap' | 'normalScale' | 'metalness' | 'metalnessMap' | 'morphNormals' | 'morphTargets' | 'roughness' | 'roughnessMap' | 'vertexTangents';
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
export declare type MixinBaseClass<T> = T extends new (..._: any) => infer I ? {
    [K in keyof T]: T[K];
} & (new (...args: any[]) => I) : new (...args: any[]) => T;
//# sourceMappingURL=StandardMaterialBehavior.d.ts.map