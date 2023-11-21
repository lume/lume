import { XYZStringValues } from './XYZStringValues.js';
export type SizeModeValue = 'literal' | 'l' | 'proportional' | 'p';
/**
 * @class XYZSizeModeValues - Extends [`XYZValues`](./XYZValues) to enforce that
 * values are one of the strings `"literal"` or `"proportional"`.
 *
 * @extends XYZValues
 */
export declare class XYZSizeModeValues extends XYZStringValues {
    get default(): {
        x: string;
        y: string;
        z: string;
    };
    get allowedValues(): string[];
    checkValue(prop: 'x' | 'y' | 'z', value: SizeModeValue): boolean;
}
//# sourceMappingURL=XYZSizeModeValues.d.ts.map