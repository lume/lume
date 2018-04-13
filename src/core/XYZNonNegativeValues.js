import XYZValues from './XYZValues'
import Class from 'lowclass'

export default
Class( 'XYZNonNegativeValues' ).extends( XYZValues, ({ Private, Super }) => ({

    _checkForNegative(axisName, value) {
        if(value < 0) {
            throw new Error(axisName + " value was " + value + ". Size values cannot be negative.")
        }
    },

    set x(value) {
        this._checkForNegative("X", value)
        Super(this).x = value
    },
    get x() { return Super(this).x },

    set y(value) {
        this._checkForNegative("Y", value)
        Super(this).y = value
    },
    get y() { return Super(this).y },

    set z(value) {
        this._checkForNegative("Z", value)
        Super(this).z = value
    },
    get z() { return Super(this).z },

}))
