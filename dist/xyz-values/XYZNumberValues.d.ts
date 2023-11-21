import { XYZValues } from './XYZValues.js';
/**
 * @class XYZNumberValues - Extends [`XYZValues`](./XYZValues) to enforce that
 * values are numbers. Additionally, values of `undefined` are ignored instead
 * of throwing errors, which allows us to handle values like `{y: 123}` when
 * setting element properties to set only one axis value.
 *
 * @extends XYZValues
 */
export declare class XYZNumberValues extends XYZValues<number> {
    /**
     * @property {{x: 0, y: 0, z: 0}} default -
     *
     * *override*
     *
     * Defines the default XYZ values to be the numbers 0,0,0.
     */
    get default(): {
        x: 0;
        y: 0;
        z: 0;
    };
    /**
     * @method deserializeValue -
     *
     * *override*
     *
     * Coerces a string value into a number.
     */
    deserializeValue(_prop: 'x' | 'y' | 'z', value: string): number;
    /**
     * @method checkValue -
     *
     * *override*
     *
     * Check that a value is a number.
     */
    checkValue(prop: 'x' | 'y' | 'z', value: number): boolean;
}
//# sourceMappingURL=XYZNumberValues.d.ts.map