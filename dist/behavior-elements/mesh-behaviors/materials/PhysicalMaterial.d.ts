import { type ElementAttributes } from '@lume/element';
import { MeshPhysicalMaterial } from 'three/src/materials/MeshPhysicalMaterial.js';
import { StandardMaterial } from './StandardMaterial.js';
import type { StandardMaterialAttributes } from './StandardMaterial.js';
export type PhysicalMaterialAttributes = StandardMaterialAttributes | 'clearcoat' | 'clearcoatRoughness' | 'refractiveIndex' | 'reflectivity' | 'transmission' | 'transmissionMap';
/**
 * @class PhysicalMaterial -
 *
 * Element: `<lume-physical-material>`
 *
 * An extension of the [`StandardMaterial`](./StandardMaterial), providing more advanced physically-based rendering properties.
 *
 * Backed by Three.js [`THREE.MeshPhysicalMaterial`](https://threejs.org/docs/index.html#api/en/materials/MeshPhysicalMaterial)
 *
 * @extends StandardMaterial
 * @element lume-physical-material
 */
export declare class PhysicalMaterial extends StandardMaterial {
    clearcoat: number;
    clearcoatRoughness: number;
    refractiveIndex: number;
    reflectivity: number;
    transmission: number;
    transmissionMap: string;
    _createComponent(): MeshPhysicalMaterial;
    protected _parentDefinedEffect(parent?: NonNullable<this['composedParent']>): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-physical-material': ElementAttributes<PhysicalMaterial, PhysicalMaterialAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-physical-material': PhysicalMaterial;
    }
}
//# sourceMappingURL=PhysicalMaterial.d.ts.map