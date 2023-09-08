import 'element-behaviors';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial.js';
import { MaterialBehavior, MaterialBehaviorAttributes } from './MaterialBehavior.js';
export declare type ShaderMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'uniforms' | 'vertexShader' | 'fragmentShader';
export declare class ShaderMaterialBehavior extends MaterialBehavior {
    #private;
    get uniforms(): Record<string, any>;
    set uniforms(u: string | Record<string, any> | null);
    vertexShader: any;
    fragmentShader: any;
    _createComponent(): ShaderMaterial;
    loadGL(): void;
}
//# sourceMappingURL=ShaderMaterialBehavior.d.ts.map