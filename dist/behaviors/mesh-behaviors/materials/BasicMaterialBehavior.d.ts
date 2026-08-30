import 'element-behaviors';
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial.js';
import { MaterialBehavior, type MaterialBehaviorAttributes } from './MaterialBehavior.js';
export type BasicMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'specularMap';
/**
 * @deprecated Legacy behavior via `has=""` attribute is deprecated. Use `<lume-basic-material>` child elements instead. Legacy behaviors will be removed in a future version.
 */
export declare class BasicMaterialBehavior extends MaterialBehavior {
    texture: string;
    specularMap: string;
    _createComponent(): MeshBasicMaterial;
    connectedCallback(): void;
}
//# sourceMappingURL=BasicMaterialBehavior.d.ts.map