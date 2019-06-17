import Observable from './Observable'
import r from 'regexr'

type XYZValuesArray = [any, any, any]
type XYZValuesObject = {x: any; y: any; z: any}
type XYZValuesParameters = /*XYZValues | */ XYZValuesArray | XYZValuesObject | string

/**
 * Represents a set of values for the X, Y, and Z axes. For example, the
 * position of an object can be described using a set of 3 numbers, one for each
 * axis in 3D space: {x:10, y:10, z:10}.
 *
 * The values don't have to be numerical. For example,
 * {x:'foo', y:'bar', z:'baz'}
 */
export default class XYZValues extends Observable {
    private _x: any
    private _y: any
    private _z: any

    constructor(x?: XYZValuesParameters | any, y?: any, z?: any) {
        super()
        this.from(x, y, z)
    }

    protected default = {x: undefined, y: undefined, z: undefined}

    from(x?: XYZValuesParameters, y?: any, z?: any): this {
        if (x !== undefined && y !== undefined && z !== undefined) {
            this.set(x, y, z)
        } else if (Array.isArray(x)) {
            this.fromArray(x)
        } else if (typeof x === 'object' && x !== null && x !== this) {
            this.fromObject(x)
        } else if (typeof x === 'string') {
            this.fromString(x)
        } else {
            this.fromDefault()
        }

        return this
    }

    set(x: any, y: any, z: any): this {
        this.x = x
        this.y = y
        this.z = z

        return this
    }

    fromArray(array: XYZValuesArray): this {
        this.set(array[0], array[1], array[2])
        return this
    }

    toArray(): XYZValuesArray {
        return [this.x, this.y, this.z]
    }

    fromObject(object: XYZValuesObject): this {
        this.set(object.x, object.y, object.z)
        return this
    }

    toObject(): XYZValuesObject {
        return {x: this._x, y: this._y, z: this._z}
    }

    fromString(string: string, separator: string = ''): this {
        this.fromArray(this.stringToArray(string, separator))
        return this
    }

    toString(separator: string = ''): string {
        if (separator) {
            return `${this.x}${separator} ${this.y}${separator} ${this.z}`
        } else {
            return `${this.x} ${this.y} ${this.z}`
        }
    }

    /**
     * Defines how to deserialize an incoming string being set onto one of the
     * x, y, or z properties. Subclasses should override this.
     * @param _prop The property name (x, y, or z)
     * @param value The value to be deserialized
     */
    deserializeValue(_prop: string, value: string): any {
        return value
    }

    stringToArray(string: string, separator: string = ''): XYZValuesArray {
        const values = string.trim().split(r`/(?:\s*${r.escape(separator) || ','}\s*)|(?:\s+)/g`)
        const length = values.length
        if (length > 0) values[0] = this.deserializeValue('x', values[0])
        if (length > 1) values[1] = this.deserializeValue('y', values[1])
        if (length > 2) values[2] = this.deserializeValue('z', values[2])
        return values as XYZValuesArray
    }

    fromDefault(): this {
        this.set(this.default.x, this.default.y, this.default.z)
        return this
    }

    /**
     * Subclasses extend this to implement type checks. Return true if the
     * value should be assigned, false otherwise. A subclass could also throw
     * an error when receiving an unexpected values.
     * @param prop
     * @param value
     */
    checkValue(_prop: string, value: any): boolean {
        // TODO XYZValues types are any, it should accept undefined
        if (value === undefined) return false
        return true
    }

    set x(value: any) {
        if (!this.checkValue('x', value)) return
        this._x = value
        this.trigger('valuechanged', 'x')
    }

    get x(): any {
        return this._x
    }

    set y(value: any) {
        if (!this.checkValue('y', value)) return
        this._y = value
        this.trigger('valuechanged', 'y')
    }

    get y(): any {
        return this._y
    }

    set z(value: any) {
        if (!this.checkValue('z', value)) return
        this._z = value
        this.trigger('valuechanged', 'z')
    }

    get z(): any {
        return this._z
    }
}
