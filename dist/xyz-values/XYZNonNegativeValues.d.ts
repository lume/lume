import { XYZNumberValues } from './XYZNumberValues.js';
/**
 * @class XYZNonNegativeValues - Extends [`XYZNumberValues`](./XYZNumberValues)
 * to enforce that values are positive numbers.
 *
 * @extends XYZNumberValues
 */
export declare class XYZNonNegativeValues extends XYZNumberValues {
    checkValue(prop: 'x' | 'y' | 'z', value: number): boolean;
}
//# sourceMappingURL=XYZNonNegativeValues.d.ts.map