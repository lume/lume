import { type ElementAttributes } from '@lume/element';
import { ShaderMaterial as ThreeShaderMaterial } from 'three/src/materials/ShaderMaterial.js';
import { MaterialBehaviorEl, type MaterialBehaviorElAttributes } from './MaterialBehaviorEl.js';
export type ShaderMaterialAttributes = MaterialBehaviorElAttributes | 'uniforms' | 'vertexShader' | 'fragmentShader';
/**
 * @class ShaderMaterial
 *
 * Element: `<lume-shader-material>`
 *
 * This behavior allows you to define custom vertex and fragment shaders for a mesh,
 * using Three.js's `ShaderMaterial` under the hood. You can also pass in custom uniforms
 * as a JSON object or string.
 *
 * @extends MaterialBehaviorEl
 * @element lume-shader-material
 */
export declare class ShaderMaterial extends MaterialBehaviorEl {
    #private;
    get uniforms(): Record<string, any>;
    set uniforms(u: string | Record<string, any> | null);
    vertexShader: any;
    fragmentShader: any;
    _createComponent(): ThreeShaderMaterial;
    protected _parentDefinedEffect(parent?: NonNullable<this['composedParent']>): void;
}
declare module 'solid-js' {
    namespace JSX {
        interface IntrinsicElements {
            'lume-shader-material': ElementAttributes<ShaderMaterial, ShaderMaterialAttributes>;
        }
    }
}
declare global {
    interface HTMLElementTagNameMap {
        'lume-shader-material': ShaderMaterial;
    }
}
//# sourceMappingURL=ShaderMaterial.d.ts.map