import { XYZStringValues } from './XYZStringValues.js';
export declare type SizeModeValue = 'literal' | 'l' | 'proportional' | 'p';
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