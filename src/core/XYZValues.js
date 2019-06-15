import Observable from './Observable'
import Class from 'lowclass'
import {native} from 'lowclass/native'

/**
 * Represents a set of values for the X, Y, and Z axes. For example, the
 * position of an object can be described using a set of 3 numbers, one for each
 * axis in 3D space: {x:10, y:10, z:10}.
 *
 * The values don't have to be numerical. For example,
 * {x:'foo', y:'bar', z:'baz'}
 */
/*TODO remove native*/
export default Class('XYZValues').extends(native(Observable), ({Private, Super}) => ({
    constructor(x, y, z) {
        Super(this).constructor()
        this.from(x, y, z)
    },

    default: {x: undefined, y: undefined, z: undefined},

    from(x, y, z) {
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
    },

    set(x, y, z) {
        this.x = x
        this.y = y
        this.z = z

        return this
    },

    fromArray(array) {
        this.set(array[0], array[1], array[2])
        return this
    },

    toArray() {
        return [this.x, this.y, this.z]
    },

    fromObject(object) {
        this.set(object.x, object.y, object.z)
        return this
    },

    fromString(string) {
        this.fromArray(this.stringToArray(string))
        return this
    },

    toString() {
        return `${this.x} ${this.y} ${this.z}`
    },

    deserializeValue(prop, string) {
        return string
        // subclasses override
    },

    stringToArray(string) {
        const values = string.trim().split(/(?:\s*,\s*)|(?:\s+)/g)
        const length = values.length
        if (length > 0) values[0] = this.deserializeValue('x', values[0])
        if (length > 1) values[1] = this.deserializeValue('y', values[1])
        if (length > 2) values[2] = this.deserializeValue('z', values[2])
        return values
    },

    fromDefault() {
        this.set(this.default.x, this.default.y, this.default.z)
        return this
    },

    checkValue(prop, value) {
        if (value === undefined) return false
        return true

        // Subclasses extend this to implement type checks.
        // Return true if the value should be assigned, false otherwise.
    },

    set x(value) {
        if (!this.checkValue('x', value)) return
        Private(this)._x = value
        this.trigger('valuechanged', 'x')
    },

    get x() {
        return Private(this)._x
    },

    set y(value) {
        if (!this.checkValue('y', value)) return
        Private(this)._y = value
        this.trigger('valuechanged', 'y')
    },

    get y() {
        return Private(this)._y
    },

    set z(value) {
        if (!this.checkValue('z', value)) return
        Private(this)._z = value
        this.trigger('valuechanged', 'z')
    },

    get z() {
        return Private(this)._z
    },
}))
