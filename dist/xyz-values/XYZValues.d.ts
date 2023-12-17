export type XYZValuesArray<T> = [T, T, T];
export type XYZPartialValuesArray<T> = [T] | [T, T] | [T, T, T];
export type XYZValuesObject<T> = {
    x: T;
    y: T;
    z: T;
};
export type XYZPartialValuesObject<T> = Partial<XYZValuesObject<T>>;
export type XYZValuesParameters<T> = /*XYZValues | */ XYZPartialValuesArray<T> | XYZPartialValuesObject<T> | string | T;
/**
 * @class XYZValues
 *
 * Represents a set of values for the X, Y, and Z axes. For example, the
 * position of an object can be described using a set of 3 numbers, one for each
 * axis in 3D space: {x:10, y:10, z:10}.
 *
 * The values don't have to be numerical. For example,
 * {x:'foo', y:'bar', z:'baz'}
 */
export declare abstract class XYZValues<T = any> extends Object {
    #private;
    /**
     * @property {any} x -
     *
     * *signal*
     *
     * Default: `undefined`
     *
     * The X value.
     */
    set x(value: T);
    get x(): T;
    /**
     * @property {any} y -
     *
     * *signal*
     *
     * Default: `undefined`
     *
     * The Y value.
     */
    set y(value: T);
    get y(): T;
    /**
     * @property {any} z -
     *
     * *signal*
     *
     * Default: `undefined`
     *
     * The Z value.
     */
    set z(value: T);
    get z(): T;
    /**
     * @constructor - The constructor accepts the initial x, y, and z values for
     * the respective properties, as well as a string list of values, an array
     * of values, an object of values with matching x, y, and z properties, or
     * another XYZValues object. This class allows for any type of values, so if
     * anything other than the string, array, or objects are passed for the
     * first arg, then whatever that value is becomes the value of `x`.
     *
     * Examples:
     *
     * ```js
     * // default values for all axes
     * new XYZValues()
     *
     * // individual args
     * new XYZValues(foo)
     * new XYZValues(foo, bar)
     * new XYZValues(foo, bar, baz)
     *
     * // string of values
     * new XYZValues('')
     * new XYZValues('foo')
     * new XYZValues('foo, bar')
     * new XYZValues('foo, bar, baz')
     * // commas are optional, these are the same as the last two:
     * new XYZValues('foo bar')
     * new XYZValues('foo bar baz')
     *
     * // array of values
     * new XYZValues([])
     * new XYZValues([foo])
     * new XYZValues([foo, bar])
     * new XYZValues([foo, bar, baz])
     *
     * // array of values
     * new XYZValues({})
     * new XYZValues({x: foo})
     * new XYZValues({y: bar})
     * new XYZValues({z: baz})
     * new XYZValues({y: bar, z: baz})
     * new XYZValues({x: foo, z: baz})
     * new XYZValues({x: foo, y: bar})
     * new XYZValues({x: foo, y: bar, z: baz})
     *
     * // other XYZValues
     * let other = new XYZValues(...)
     * new XYZValues(other)
     * ```
     *
     * @param {string | [x?: any, y?: any, z?: any] | {x?: any, y?: any, z?: any} | XYZValues | any} x -The X value, or a string of values, an array of values, or object of values.
     * @param {any} y - The Y value.
     * @param {any} z - The Z value.
     */
    constructor(x?: XYZValuesParameters<T>, y?: T, z?: T);
    /**
     * @param {string | [x?: any, y?: any, z?: any] | {x?: any, y?: any, z?: any} | XYZValues | any} default -
     *
     * *readonly, *abstract*
     *
     * Subclasses can define a `default` getter to define what default values
     * should be for any new instance without constructor arguments.
     */
    abstract get default(): XYZValuesParameters<T>;
    /**
     * @method fromDefault - Resets the `x`, `y`, and `z` values of the instance back
     * to their defaults, as defined by the `default` getter. If no `default`
     * getter is assigned, the default is ultimately `undefined` for `x`, `y`, and
     * `z`.
     *
     * ```js
     * values.fromDefault()
     * ```
     *
     * @returns {this} - Returns the instance for method chaining.
     */
    fromDefault(): this;
    /**
     * @method from - Accepts multiple types of values to set the object's `x`, `y`, and `z` properties from. The args are the same as for the [`constructor()`](#constructor).
     *
     * ```js
     * // similar to the constructor:
     * values.from(foo, bar, baz)
     * values.from('foo, bar, baz')
     * values.from('foo bar baz')
     * values.from([foo, bar, baz])
     * values.from({x: foo, y: bar, z: baz})
     * ```
     *
     * @param {string | [x?: any, y?: any, z?: any] | {x?: any, y?: any, z?: any} | XYZValues | any} x -The X value, or a string of values, an array of values, or object of values.
     * @param {any} y - The Y value.
     * @param {any} z - The Z value.
     *
     * @returns {this} - Returns the instance for method chaining.
     */
    from(x: XYZValuesParameters<T>, y?: T, z?: T): this;
    /**
     * @method set - Sets specific values for `x`, `y`, and `z`. Unlike
     * [`.from()`](#from), this does not accept different sorts of values, but
     * only specific values for each axis.
     *
     * ```js
     * values.set(foo, bar, baz)
     * ```
     *
     * @returns {this} - Returns the instance for method chaining.
     */
    set(x: T, y: T, z: T): this;
    /**
     * @method fromArray - Sets the object's `x`, `y`, and `z` values from an array of values.
     *
     * ```js
     * values.fromArray([foo, bar, baz])
     * ```
     *
     * @returns {this} - Returns the instance for method chaining.
     */
    fromArray(array: XYZPartialValuesArray<T>): this;
    /**
     * @method toArray - Returns the `x`, `y`, and `z` values in array form.
     *
     * ```js
     * values.toArray() // [foo, bar, baz]
     * ```
     *
     * @returns {[any, any, any]} - The array of values.
     */
    toArray(): XYZValuesArray<T>;
    /**
     * @method fromObject - Sets the object's `x`, `y`, and `z` values from an
     * object with `x`, `y`, and `z` properties.
     *
     * ```js
     * values.fromObject({x: foo, y: bar, z: baz})
     * ```
     *
     * @returns {this} - Returns the instance for method chaining.
     */
    fromObject(object: XYZPartialValuesObject<T>): this;
    /**
     * @method toObject - Returns the `x`, `y`, and `z` values in object form.
     *
     * ```js
     * values.toObject() // {x: foo, y: bar, z: baz}
     * ```
     *
     * @returns {{x: any, y: any, z: any}} - The object of values.
     */
    toObject(): XYZValuesObject<T>;
    /**
     * @method fromString - Sets the object's `x`, `y`, and `z` values from a
     * string containing a list of values.
     *
     * ```js
     * values.fromString('foo, bar, baz')
     * values.fromString('foo bar baz')
     * ```
     *
     * @returns {this} - Returns the instance for method chaining.
     */
    fromString(string: string, separator?: string): this;
    /**
     * @method toString - Returns the `x`, `y`, and `z` values in string of values form, with an optional separator.
     *
     * `override`
     *
     * ```js
     * values.toString() // 'foo bar baz'
     * values.toString(',') // 'foo, bar, baz'
     * ```
     *
     * @param {string} separator - The separator to use, otherwise only spaces are used.
     *
     * @returns {string} - The string of values.
     */
    toString(separator?: string): string;
    /**
     * @method deserializeValue - Defines how to deserialize an incoming string
     * being set onto one of the x, y, or z properties. Subclasses should
     * override this. This class does not perform any transformation of the
     * string values.
     *
     * @param {'x' | 'y' | 'z'} _prop The property name of the axis a value is being deserialized for, one of 'x', 'y', or 'z'.
     * @param {any} value The value to be deserialized.
     *
     * @returns {any} - The deserialized value.
     */
    deserializeValue(_prop: 'x' | 'y' | 'z', value: string): T;
    /**
     * @method checkValue - Subclasses extend this to implement type checks.
     * Return `true` if the value should be assigned, or `false` to ignore the
     * value and not set anything. A subclass could also throw an error when
     * receiving an unexpected value.
     *
     * Returning `false`, for example, can allow 'undefined' values to be
     * ignored, which allows us to do things like `values.fromObject({z: 123})`
     * to set only `z` and ignore `x` and `y`.
     *
     * @param {'x' | 'y' | 'z'} _prop The property name of the axis a value is being assigned to, one of 'x', 'y', or 'z'.
     * @param {any} _value The value being assigned.
     */
    checkValue(_prop: 'x' | 'y' | 'z', _value: T): boolean;
    /**
     * A method that when called in a effect makes all three x/y/z properties a
     * dependency of the effect.
     */
    asDependency: () => this;
}
//# sourceMappingURL=XYZValues.d.ts.map