import 'element-behaviors';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial.js';
import { MaterialBehavior, type MaterialBehaviorAttributes } from './MaterialBehavior.js';
export type ShaderMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'uniforms' | 'vertexShader' | 'fragmentShader';
/**
 * @deprecated Legacy behavior via `has=""` attribute is deprecated. Use `<lume-shader-material>` child elements instead. Legacy behaviors will be removed in a future version.
 */
export declare class ShaderMaterialBehavior extends MaterialBehavior {
    #private;
    get uniforms(): Record<string, any>;
    set uniforms(u: string | Record<string, any> | null);
    vertexShader: any;
    fragmentShader: any;
    _createComponent(): ShaderMaterial;
    connectedCallback(): void;
}
//# sourceMappingURL=ShaderMaterialBehavior.d.ts.map