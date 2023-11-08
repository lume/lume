import { XYZValues } from './XYZValues.js';
export declare class XYZNumberValues extends XYZValues<number> {
    get default(): {
        x: 0;
        y: 0;
        z: 0;
    };
    deserializeValue(_prop: 'x' | 'y' | 'z', value: string): number;
    checkValue(prop: 'x' | 'y' | 'z', value: number): boolean;
}
//# sourceMappingURL=XYZNumberValues.d.ts.map