import Observable from './Observable'
import Class from 'lowclass'
import { native } from 'lowclass/native'

/**
 * Represents a set of values for the X, Y, and Z axes. For example, the
 * position of an object can be described using a set of 3 numbers, one for each
 * axis in 3D space: {x:10, y:10, z:10}.
 *
 * The value don't have to be numerical. For example,
 * {x:'foo', y:'bar', z:'baz'}
 */
export default
Class( 'XYZValues' ).extends( native(Observable), ({ Private, Super }) => ({
    constructor(x = 0, y = 0, z = 0) {
        Super(this).constructor()

        const self = Private(this)
        self._x = x
        self._y = y
        self._z = z
    },

    set x(value) {
        Private(this)._x = value
        this.trigger('valuechanged', {x: value})
    },
    get x() { return Private(this)._x },

    set y(value) {
        Private(this)._y = value
        this.trigger('valuechanged', {y: value})
    },
    get y() { return Private(this)._y },

    set z(value) {
        Private(this)._z = value
        this.trigger('valuechanged', {z: value})
    },
    get z() { return Private(this)._z },
}))
