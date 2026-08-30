import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js';
import { type ElementAttributes } from '@lume/element';
import { MaterialBehaviorEl, type MaterialBehaviorElAttributes } from './MaterialBehaviorEl.js';
export type StandardMaterialAttributes = MaterialBehaviorElAttributes | 'alphaMap' | 'aoMap' | 'aoMapIntensity' | 'bumpMap' | 'bumpScale' | 'displacementMap' | 'displacementScale' | 'displacementBias' | 'texture' | 'normalMap' | 'normalScale' | 'metalness' | 'metalnessMap' | 'morphNormals' | 'morphTargets' | 'roughness' | 'roughnessMap' | 'vertexTangents';
/**
 * @class StandardMaterial
 *
 * Element: `<lume-standard-material>`
 *
 * A standard physically based material, using Metallic-Roughness workflow.
 *
 * Backed by Three.js [`THREE.MeshStandardMaterial`](https://threejs.org/docs/index.html#api/en/materials/MeshStandardMaterial)
 *
 * @extends MaterialBehaviorEl
 * @element lume-standard-material
 */
export declare class StandardMaterial extends MaterialBehaviorEl {
    alphaMap: string;
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
    protected _parentDefinedEffect(parent?: NonNullable<this['composedParent']>): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-standard-material': ElementAttributes<StandardMaterial, StandardMaterialAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-standard-material': StandardMaterial;
    }
}
//# sourceMappingURL=StandardMaterial.d.ts.map