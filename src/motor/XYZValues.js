import { makeAccessorsEnumerable } from './Utility'
import Observable from './Observable'

/**
 * Represents a set of values for the X, Y, and Z axes. For example, the
 * position of an object can be described using a set of 3 numbers, one for each
 * axis in 3D space: {x:10, y:10, z:10}.
 *
 * The value don't have to be numerical. For example,
 * {x:'foo', y:'bar', z:'baz'}
 */
class XYZValues extends Observable {
    constructor(x = 0, y = 0, z = 0) {
        super()
        this._x = x
        this._y = y
        this._z = z
    }

    set x(value) {
        this._x = value
        this.triggerEvent('valuechanged', {x: value})
    }
    get x() { return this._x }

    set y(value) {
        this._y = value
        this.triggerEvent('valuechanged', {y: value})
    }
    get y() { return this._y }

    set z(value) {
        this._z = value
        this.triggerEvent('valuechanged', {z: value})
    }
    get z() { return this._z }
}

// So Tween.js can animate x, y, z
makeAccessorsEnumerable(XYZValues.prototype)

export {XYZValues as default}
