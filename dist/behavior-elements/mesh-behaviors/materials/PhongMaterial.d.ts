import { Color } from 'three/src/math/Color.js';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial.js';
import { type ElementAttributes } from '@lume/element';
import { MaterialBehaviorEl, type MaterialBehaviorElAttributes } from './MaterialBehaviorEl.js';
export type PhongMaterialAttributes = MaterialBehaviorElAttributes | 'alphaMap' | 'aoMap' | 'aoMapIntensity' | 'bumpMap' | 'bumpScale' | 'displacementMap' | 'emissiveMap' | 'emissive' | 'emissiveIntensity' | 'envMap' | 'flatShading' | 'lightMap' | 'lightMapIntensity' | 'texture' | 'normalMap' | 'normalScale' | 'reflectivity' | 'specularMap' | 'specular' | 'shininess';
/**
 * @class PhongMaterial -
 *
 * Element: `<lume-phong-material>`
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
 * @extends MaterialBehaviorEl
 * @element lume-phong-material
 */
export declare class PhongMaterial extends MaterialBehaviorEl {
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
    protected _parentDefinedEffect(parent?: NonNullable<this['composedParent']>): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-phong-material': ElementAttributes<PhongMaterial, PhongMaterialAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-phong-material': PhongMaterial;
    }
}
//# sourceMappingURL=PhongMaterial.d.ts.map