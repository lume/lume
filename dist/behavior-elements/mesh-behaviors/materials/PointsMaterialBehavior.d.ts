import { PointsMaterial } from 'three/src/materials/PointsMaterial.js';
import { MaterialBehavior, type MaterialBehaviorAttributes } from './MaterialBehavior.js';
export type PointsMaterialBehaviorAttributes = MaterialBehaviorAttributes | 'texture' | 'sizeAttenuation' | 'pointSize';
/**
 * @class PointsMaterialBehavior -
 *
 * Element: `points-material`
 *
 * @extends MaterialBehavior
 * @element points-material
 */
export declare class PointsMaterialBehavior extends MaterialBehavior {
    texture: string;
    sizeAttenuation: boolean;
    pointSize: number;
    _createComponent(): PointsMaterial;
    protected _parentDefinedEffect(parent?: NonNullable<this['composedParent']>): void;
}
//# sourceMappingURL=PointsMaterialBehavior.d.ts.map