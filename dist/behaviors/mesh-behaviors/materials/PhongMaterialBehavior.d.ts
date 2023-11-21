import 'element-behaviors';
import { Color } from 'three/src/math/Color.js';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial.js';
import { MaterialBehavior, type MaterialBehaviorAttributes } from './MaterialBehavior.js';
export type PhongMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'alphaMap' | 'aoMap' | 'aoMapIntensity' | 'bumpMap' | 'bumpScale' | 'displacementMap' | 'emissiveMap' | 'emissive' | 'emissiveIntensity' | 'envMap' | 'flatShading' | 'lightMap' | 'lightMapIntensity' | 'texture' | 'normalMap' | 'normalScale' | 'reflectivity' | 'specularMap' | 'specular' | 'shininess';
/**
 * @class PhongMaterialBehavior -
 *
 * A cheaper type of material with less realism, based on older principles,
 * [named after computer graphics pioneer Bui Tuong
 * Phong](https://en.wikipedia.org/wiki/Phong_shading), not as realistic as
 * [`StandardMaterialBehavior`](./StandardMaterialBehavior) or
 * [`PhysicalMaterialBehavior`](./PhysicalMaterialBehavior) can be with their
 * "physically-based rendering (PBR)" algorithms.
 *
 * Backed by Three.js [`THREE.MeshPhongMaterial`](https://threejs.org/docs/index.html#api/en/materials/MeshPhongMaterial).
 *
 * @extends MaterialBehavior
 */
export declare class PhongMaterialBehavior extends MaterialBehavior {
    #private;
    alphaMap: string;
    aoMap: string;
    aoMapIntensity: number;
    bumpMap: string;
    bumpScale: number;
    displacementMap: string;
    displacementScale: number;
    displacementBias: number;
    emissiveMap: string;
    get emissive(): string | number;
    set emissive(val: string | number | Color);
    emissiveIntensity: number;
    envMap: string;
    flatShading: boolean;
    lightMap: string;
    lightMapIntensity: number;
    texture: string;
    normalMap: string;
    normalScale: number;
    reflectivity: number;
    specularMap: string;
    get specular(): string | number;
    set specular(val: string | number | Color);
    shininess: number;
    _createComponent(): MeshPhongMaterial;
    loadGL(): void;
}
//# sourceMappingURL=PhongMaterialBehavior.d.ts.map