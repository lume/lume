import type { Constructor } from 'lowclass/dist/Constructor.js';
import { type RenderTask } from './Motor.js';
import { XYZSizeModeValues, type SizeModeValue } from '../xyz-values/XYZSizeModeValues.js';
import { XYZNonNegativeValues } from '../xyz-values/XYZNonNegativeValues.js';
import type { XYZValues, XYZPartialValuesArray, XYZPartialValuesObject } from '../xyz-values/XYZValues.js';
import type { XYZNumberValues } from '../xyz-values/XYZNumberValues.js';
import type { PossiblyCustomElement } from './PossibleCustomElement.js';
/**
 * @mixin - TODO make this @mixin tag do something in the docs.
 * @class PropertyAnimator - This is a utility mixin class to make some Lume
 * element properties animatable when provided a function. This allows animation
 * of some properties like so:
 *
 * ```js
 * const box = document.querySelector('lume-box')
 * box.rotation = (x, y, z, t, dt) => [x, ++y, z]
 * box.opacity = (opacity, t, dt) => opacity - 0.01
 * ```
 *
 * Currently it is only for any XYZValues properties (for example `position`, `rotation`, etc), or `opacity`.
 *
 * For an `XYZValues` property, the function accepts the current x, y, z, time,
 * and deltaTime values for the current frame, and should return the new desired
 * values.
 *
 * For `opacity` it is similar, but the function accepts a opacity, time, and
 * deltaTime, and should return the new desired opacity.
 */
export declare function PropertyAnimator<T extends Constructor<PossiblyCustomElement>>(Base?: T): {
    new (...a: any[]): {
        _setPropertyXYZ<K extends keyof any, V>(name: K, xyz: XYZValues, newValue: V): void;
        _setPropertySingle<K extends keyof any, V>(name: K, setter: (newValue: any[K]) => void, newValue: V): void;
        "__#14@#propertyFunctions": Map<string, RenderTask> | null;
        "__#14@#settingValueFromPropFunction": boolean;
        "__#14@#handleXYZPropertyFunction"(fn: XYZNumberValuesPropertyFunction, name: keyof any, xyz: XYZValues): void;
        "__#14@#handleSinglePropertyFunction"(fn: SinglePropertyFunction, name: keyof any): void;
        "__#14@#removePropertyFunction"(name: keyof any): void;
        removeAllPropertyFunctions(): void;
        disconnectedCallback(): void;
        connectedCallback?(): void;
        adoptedCallback?(): void;
        attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void;
    };
} & T;
export type XYZValuesProperty<XYZValuesType extends XYZValues, DataType> = XYZValuesType | XYZPartialValuesArray<DataType> | XYZPartialValuesObject<DataType> | string;
export type XYZNumberValuesProperty = XYZValuesProperty<XYZNumberValues, number>;
export type XYZNonNegativeNumberValuesProperty = XYZValuesProperty<XYZNonNegativeValues, number>;
export type XYZSizeModeValuesProperty = XYZValuesProperty<XYZSizeModeValues, SizeModeValue>;
export type XYZValuesPropertyFunction<XYZValuesPropertyType, DataType> = (x: DataType, y: DataType, z: DataType, time: number, deltaTime: number) => XYZValuesPropertyType | false;
export type XYZNumberValuesPropertyFunction = XYZValuesPropertyFunction<XYZNumberValuesProperty, number>;
export type XYZNonNegativeNumberValuesPropertyFunction = XYZValuesPropertyFunction<XYZNonNegativeNumberValuesProperty, number>;
export type SinglePropertyFunction = (value: number, time: number) => number | false;
//# sourceMappingURL=PropertyAnimator.d.ts.map