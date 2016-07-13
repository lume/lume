/**
 * Represents a set of values for the X, Y, and Z axes. For example, the
 * position of an object can be described using a set of 3 numbers, one for each
 * axis in 3D space: {x:10, y:10, z:10}.
 *
 * The value don't have to be numerical. For example,
 * {x:'foo', y:'bar', z:'baz'}
 */
class XYZValues {
    constructor(x = 0, y = 0, z = 0) {
        this._x = x
        this._y = y
        this._z = z
    }

    // override this on the instance to run logic on a property change.
    onChanged() {}

    set x(value) {
        this._x = value
        this.onChanged()
    }
    get x() { return this._x }

    set y(value) {
        this._y = value
        this.onChanged()
    }
    get y() { return this._y }

    set z(value) {
        this._z = value
        this.onChanged()
    }
    get z() { return this._z }
}

export {XYZValues as default}
