import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial.js';
import { MaterialBehavior, type MaterialBehaviorAttributes } from './MaterialBehavior.js';
export type BasicMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'specularMap';
/**
 * @class BasicMaterialBehavior -
 *
 * Element: `basic-material`
 *
 * @extends MaterialBehavior
 * @element basic-material
 */
export declare class BasicMaterialBehavior extends MaterialBehavior {
    texture: string;
    specularMap: string;
    _createComponent(): MeshBasicMaterial;
    connectedCallback(): void;
}
//# sourceMappingURL=BasicMaterialBehavior.d.ts.map