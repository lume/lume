import {Eventful} from '@lume/eventful'
import {reactive} from '@lume/element'
import {getInheritedDescriptor} from 'lowclass'
import {stringToArray} from './utils.js'

export type XYZValuesArray<T> = [T, T, T]
export type XYZPartialValuesArray<T> = [T] | [T, T] | [T, T, T] // Is there a better way to make a tuplet from 1 to 3 items?
export type XYZValuesObject<T> = {x: T; y: T; z: T}
export type XYZPartialValuesObject<T> = Partial<XYZValuesObject<T>>
export type XYZValuesParameters<T> = /*XYZValues | */ XYZPartialValuesArray<T> | XYZPartialValuesObject<T> | string | T

const defaultValues: XYZValuesObject<any> = {x: undefined, y: undefined, z: undefined}

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
@reactive
export abstract class XYZValues<T = any> extends Eventful() {
	// TODO remove Eventful and use only reactivity.

	#x: T = undefined!
	#y: T = undefined!
	#z: T = undefined!

	/**
	 * @property {any} x -
	 *
	 * *reactive*
	 *
	 * Default: `undefined`
	 *
	 * The X value.
	 */
	@reactive
	set x(value: T) {
		if (typeof value === 'string') value = this.deserializeValue('x', value)
		if (!this.checkValue('x', value)) return
		this.#x = value
		this.emit('valuechanged', 'x')
	}
	get x(): T {
		return this.#x
	}

	/**
	 * @property {any} y -
	 *
	 * *reactive*
	 *
	 * Default: `undefined`
	 *
	 * The Y value.
	 */
	@reactive
	set y(value: T) {
		if (typeof value === 'string') value = this.deserializeValue('y', value)
		if (!this.checkValue('y', value)) return
		this.#y = value
		this.emit('valuechanged', 'y')
	}
	get y(): T {
		return this.#y
	}

	/**
	 * @property {any} z -
	 *
	 * *reactive*
	 *
	 * Default: `undefined`
	 *
	 * The Z value.
	 */
	@reactive
	set z(value: T) {
		if (typeof value === 'string') value = this.deserializeValue('z', value)
		if (!this.checkValue('z', value)) return
		this.#z = value
		this.emit('valuechanged', 'z')
	}
	get z(): T {
		return this.#z
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
	constructor(x?: XYZValuesParameters<T>, y?: T, z?: T) {
		super()
		this.#from(x, y, z)
	}

	/**
	 * @param {string | [x?: any, y?: any, z?: any] | {x?: any, y?: any, z?: any} | XYZValues | any} default -
	 *
	 * *readonly, *abstract*
	 *
	 * Subclasses can define a `default` getter to define what default values
	 * should be for any new instance without constructor arguments.
	 */
	abstract get default(): XYZValuesParameters<T>

	get #default(): XYZValuesParameters<T> {
		return this.default || defaultValues
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
	fromDefault(): this {
		this.from(this.#default)
		return this
	}

	#from(x?: XYZValuesParameters<T> | null, y?: T, z?: T): this {
		if (x == null && y === undefined && z === undefined) {
			this.fromDefault()
		} else if (Array.isArray(x)) {
			this.fromArray(x)
		} else if (typeof x === 'object' && x !== null) {
			if (x === this) return this
			this.fromObject(x as XYZValuesObject<T>)
		} else if (typeof x === 'string' && y === undefined && z === undefined) {
			this.fromString(x)
		} else this.set(x as any, y as any, z as any)

		return this
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
	from(x: XYZValuesParameters<T>, y?: T, z?: T): this {
		return this.#from(x, y, z)
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
	set(x: T, y: T, z: T): this {
		this.x = x
		this.y = y
		this.z = z

		return this
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
	fromArray(array: XYZPartialValuesArray<T>): this {
		this.set(array[0] as any, array[1] as any, array[2] as any)
		return this
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
	toArray(): XYZValuesArray<T> {
		return [this.x, this.y, this.z]
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
	fromObject(object: XYZPartialValuesObject<T>): this {
		this.set(object.x as any, object.y as any, object.z as any)
		return this
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
	toObject(): XYZValuesObject<T> {
		return {x: this.x, y: this.y, z: this.z}
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
	fromString(string: string, separator: string = ','): this {
		this.fromArray(this.#stringToArray(string, separator))
		return this
	}

	/**
	 * @method toString - Returns the `x`, `y`, and `z` values in string of values form, with an optional separator.
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
	override toString(separator: string = ''): string {
		if (separator) {
			return `${this.x}${separator} ${this.y}${separator} ${this.z}`
		} else {
			return `${this.x} ${this.y} ${this.z}`
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
	deserializeValue(_prop: 'x' | 'y' | 'z', value: string): T {
		return value as unknown as T
	}

	#stringToArray(string: string, separator: string = ','): XYZPartialValuesArray<T> {
		const values = stringToArray(string, separator)
		const result = [] as unknown as XYZPartialValuesArray<T>
		const length = values.length
		if (length > 0) result[0] = this.deserializeValue('x', values[0])
		if (length > 1) result[1] = this.deserializeValue('y', values[1])
		if (length > 2) result[2] = this.deserializeValue('z', values[2])
		return result
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
	checkValue(_prop: 'x' | 'y' | 'z', _value: T): boolean {
		return true
	}

	/**
	 * A method that when called in a effect makes all three x/y/z properties a
	 * dependency of the effect.
	 */
	asDependency = () => {
		this.x
		this.y
		this.z
	}
}

// TODO make this a decorator
function enumerable<T extends object>(obj: T, prop: keyof T) {
	Object.defineProperty(obj, prop, {...getInheritedDescriptor(obj, prop), enumerable: true})
}

enumerable(XYZValues.prototype, 'x')
enumerable(XYZValues.prototype, 'y')
enumerable(XYZValues.prototype, 'z')
