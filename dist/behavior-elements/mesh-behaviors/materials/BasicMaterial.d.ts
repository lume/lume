import { type ElementAttributes } from '@lume/element';
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial.js';
import { MaterialBehaviorEl, type MaterialBehaviorElAttributes } from './MaterialBehaviorEl.js';
export type BasicMaterialAttributes = MaterialBehaviorElAttributes | 'texture' | 'specularMap';
/**
 * @class BasicMaterial -
 *
 * Element: `<lume-basic-material>`
 *
 * @extends MaterialBehaviorEl
 * @element lume-basic-material
 */
export declare class BasicMaterial extends MaterialBehaviorEl {
    texture: string;
    specularMap: string;
    _createComponent(): MeshBasicMaterial;
    protected _parentDefinedEffect(parent?: NonNullable<this['composedParent']>): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-basic-material': ElementAttributes<BasicMaterial, BasicMaterialAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-basic-material': BasicMaterial;
    }
}
//# sourceMappingURL=BasicMaterial.d.ts.map