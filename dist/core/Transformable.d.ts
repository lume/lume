import { XYZNumberValues } from '../xyz-values/XYZNumberValues.js';
import { Sizeable, type XYZNumberValuesProperty, type XYZNumberValuesPropertyFunction } from './Sizeable.js';
import type { SizeableAttributes } from './Sizeable.js';
export type TransformableAttributes = SizeableAttributes | 'position' | 'rotation' | 'scale' | 'origin' | 'alignPoint' | 'mountPoint';
export declare class Transformable extends Sizeable {
    constructor();
    set position(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction);
    get position(): XYZNumberValues;
    set rotation(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction);
    get rotation(): XYZNumberValues;
    set scale(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction);
    get scale(): XYZNumberValues;
    set origin(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction);
    get origin(): XYZNumberValues;
    set alignPoint(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction);
    get alignPoint(): XYZNumberValues;
    set mountPoint(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction);
    get mountPoint(): XYZNumberValues;
}
//# sourceMappingURL=Transformable.d.ts.map