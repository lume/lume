import 'element-behaviors';
import { PointsMaterial } from 'three/src/materials/PointsMaterial.js';
import { MaterialBehavior, type MaterialBehaviorAttributes } from './MaterialBehavior.js';
export type PointsMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'sizeAttenuation' | 'pointSize';
/**
 * @deprecated Legacy behavior via `has=""` attribute is deprecated. Use `<lume-points-material>` child elements instead. Legacy behaviors will be removed in a future version.
 */
export declare class PointsMaterialBehavior extends MaterialBehavior {
    texture: string;
    sizeAttenuation: boolean;
    pointSize: number;
    _createComponent(): PointsMaterial;
    connectedCallback(): void;
}
//# sourceMappingURL=PointsMaterialBehavior.d.ts.map