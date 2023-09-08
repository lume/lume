import { XYZValues } from './XYZValues.js';
export declare class XYZStringValues extends XYZValues<string> {
    get default(): {
        x: string;
        y: string;
        z: string;
    };
    checkValue(prop: 'x' | 'y' | 'z', value: string): boolean;
}
//# sourceMappingURL=XYZStringValues.d.ts.map