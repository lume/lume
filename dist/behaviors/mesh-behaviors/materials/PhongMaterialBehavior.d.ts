import 'element-behaviors';
import { Color } from 'three/src/math/Color.js';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial.js';
import { MaterialBehavior, MaterialBehaviorAttributes } from './MaterialBehavior.js';
export declare type PhongMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'alphaMap' | 'aoMap' | 'aoMapIntensity' | 'bumpMap' | 'bumpScale' | 'displacementMap' | 'emissiveMap' | 'emissive' | 'emissiveIntensity' | 'envMap' | 'flatShading' | 'lightMap' | 'lightMapIntensity' | 'texture' | 'normalMap' | 'normalScale' | 'reflectivity' | 'specularMap' | 'specular' | 'shininess';
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
    get emissive(): Color;
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
    get specular(): Color;
    set specular(val: string | number | Color);
    shininess: number;
    _createComponent(): MeshPhongMaterial;
    loadGL(): void;
}
//# sourceMappingURL=PhongMaterialBehavior.d.ts.map