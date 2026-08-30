import { MeshPhysicalMaterial } from 'three/src/materials/MeshPhysicalMaterial.js';
import { PhysicalMaterial, type PhysicalMaterialAttributes } from './PhysicalMaterial.js';
import { type ElementAttributes } from '@lume/element';
export type MixedplaneMaterialAttributes = PhysicalMaterialAttributes;
/**
 * @class MixedplaneMaterial -
 *
 * Element: `<lume-mixedplane-material>`
 *
 * Used as the material for [`<lume-mixed-plane>`](../../../meshes/MixedPlane) elements.
 *
 * <live-code src="../../../../../examples/buttons-with-shadow/example.html"></live-code>
 *
 * @extends PhysicalMaterial
 * @element lume-mixedplane-material
 */
export declare class MixedplaneMaterial extends PhysicalMaterial {
    constructor();
    _createComponent(): MeshPhysicalMaterial;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-mixedplane-material': ElementAttributes<MixedplaneMaterial, MixedplaneMaterialAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-mixedplane-material': MixedplaneMaterial;
    }
}
//# sourceMappingURL=MixedplaneMaterial.d.ts.map