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
}

// We set accessors manually because Buble doesn't make them configurable
// as per spec. Additionally we're maing these ones enumerable.
Object.defineProperties(XYZValues.prototype, {
    x: {
        set(value) {
            this._x = value
            this.triggerEvent('valuechanged', {x: value})
        },
        get() { return this._x },
        configurable: true,
        enumerable: true,
    },

    y: {
        set(value) {
            this._y = value
            this.triggerEvent('valuechanged', {y: value})
        },
        get() { return this._y },
        configurable: true,
        enumerable: true,
    },

    z: {
        set(value) {
            this._z = value
            this.triggerEvent('valuechanged', {z: value})
        },
        get() { return this._z },
        configurable: true,
        enumerable: true,
    },
})

export {XYZValues as default}
