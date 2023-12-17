var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { reactive, signal } from 'classy-solid';
import { getInheritedDescriptor } from 'lowclass';
import { stringToArray } from './utils.js';
import { batch } from 'solid-js';
const defaultValues = { x: undefined, y: undefined, z: undefined };
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
let XYZValues = (() => {
    let _classDecorators = [reactive];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Object;
    let _instanceExtraInitializers = [];
    let _set_x_decorators;
    let _set_y_decorators;
    let _set_z_decorators;
    var XYZValues = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _set_x_decorators = [signal];
            _set_y_decorators = [signal];
            _set_z_decorators = [signal];
            __esDecorate(this, null, _set_x_decorators, { kind: "setter", name: "x", static: false, private: false, access: { has: obj => "x" in obj, set: (obj, value) => { obj.x = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_y_decorators, { kind: "setter", name: "y", static: false, private: false, access: { has: obj => "y" in obj, set: (obj, value) => { obj.y = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_z_decorators, { kind: "setter", name: "z", static: false, private: false, access: { has: obj => "z" in obj, set: (obj, value) => { obj.z = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            XYZValues = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #x = (__runInitializers(this, _instanceExtraInitializers), undefined);
        #y = undefined;
        #z = undefined;
        /**
         * @property {any} x -
         *
         * *signal*
         *
         * Default: `undefined`
         *
         * The X value.
         */
        set x(value) {
            if (typeof value === 'string')
                value = this.deserializeValue('x', value);
            if (!this.checkValue('x', value))
                return;
            this.#x = value;
        }
        get x() {
            return this.#x;
        }
        /**
         * @property {any} y -
         *
         * *signal*
         *
         * Default: `undefined`
         *
         * The Y value.
         */
        set y(value) {
            if (typeof value === 'string')
                value = this.deserializeValue('y', value);
            if (!this.checkValue('y', value))
                return;
            this.#y = value;
        }
        get y() {
            return this.#y;
        }
        /**
         * @property {any} z -
         *
         * *signal*
         *
         * Default: `undefined`
         *
         * The Z value.
         */
        set z(value) {
            if (typeof value === 'string')
                value = this.deserializeValue('z', value);
            if (!this.checkValue('z', value))
                return;
            this.#z = value;
        }
        get z() {
            return this.#z;
        }
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
        constructor(x, y, z) {
            super();
            this.#from(x, y, z);
        }
        get #default() {
            return this.default || defaultValues;
        }
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
        // TODO @return(s) jsdoc tag not working.
        fromDefault() {
            this.from(this.#default);
            return this;
        }
        #from(x, y, z) {
            if (x == null && y === undefined && z === undefined) {
                this.fromDefault();
            }
            else if (Array.isArray(x)) {
                this.fromArray(x);
            }
            else if (typeof x === 'object' && x !== null) {
                if (x === this)
                    return this;
                this.fromObject(x);
            }
            else if (typeof x === 'string' && y === undefined && z === undefined) {
                this.fromString(x);
            }
            else
                this.set(x, y, z);
            return this;
        }
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
        from(x, y, z) {
            return this.#from(x, y, z);
        }
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
        set(x, y, z) {
            batch(() => {
                this.x = x;
                this.y = y;
                this.z = z;
            });
            return this;
        }
        /**
         * @method fromArray - Sets the object's `x`, `y`, and `z` values from an array of values.
         *
         * ```js
         * values.fromArray([foo, bar, baz])
         * ```
         *
         * @returns {this} - Returns the instance for method chaining.
         */
        fromArray(array) {
            this.set(array[0], array[1], array[2]);
            return this;
        }
        /**
         * @method toArray - Returns the `x`, `y`, and `z` values in array form.
         *
         * ```js
         * values.toArray() // [foo, bar, baz]
         * ```
         *
         * @returns {[any, any, any]} - The array of values.
         */
        toArray() {
            return [this.x, this.y, this.z];
        }
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
        fromObject(object) {
            this.set(object.x, object.y, object.z);
            return this;
        }
        /**
         * @method toObject - Returns the `x`, `y`, and `z` values in object form.
         *
         * ```js
         * values.toObject() // {x: foo, y: bar, z: baz}
         * ```
         *
         * @returns {{x: any, y: any, z: any}} - The object of values.
         */
        toObject() {
            return { x: this.x, y: this.y, z: this.z };
        }
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
        fromString(string, separator = ',') {
            this.fromArray(this.#stringToArray(string, separator));
            return this;
        }
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
        toString(separator = '') {
            if (separator) {
                return `${this.x}${separator} ${this.y}${separator} ${this.z}`;
            }
            else {
                return `${this.x} ${this.y} ${this.z}`;
            }
        }
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
        deserializeValue(_prop, value) {
            return value;
        }
        #stringToArray(string, separator = ',') {
            const values = stringToArray(string, separator);
            const result = [];
            const length = values.length;
            if (length > 0)
                result[0] = this.deserializeValue('x', values[0]);
            if (length > 1)
                result[1] = this.deserializeValue('y', values[1]);
            if (length > 2)
                result[2] = this.deserializeValue('z', values[2]);
            return result;
        }
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
        checkValue(_prop, _value) {
            return true;
        }
        /**
         * A method that when called in a effect makes all three x/y/z properties a
         * dependency of the effect.
         */
        asDependency = () => {
            this.x;
            this.y;
            this.z;
            return this;
        };
    };
    return XYZValues = _classThis;
})();
export { XYZValues };
// TODO make this a decorator
function enumerable(obj, prop) {
    Object.defineProperty(obj, prop, { ...getInheritedDescriptor(obj, prop), enumerable: true });
}
enumerable(XYZValues.prototype, 'x');
enumerable(XYZValues.prototype, 'y');
enumerable(XYZValues.prototype, 'z');
//# sourceMappingURL=XYZValues.js.map