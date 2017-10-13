import XYZValues from './XYZValues'

export default
class XYZNonNegativeValues extends XYZValues {

    constructor(x = 0, y = 0, z = 0) {
        super(x, y, z)
    }

    _checkForNegative(axisName, value) {
        if(value < 0) {
            throw new Error(axisName + " value was " + value + ". Size values cannot be negative.")
        }
    }

    set x(value) {
        this._checkForNegative("X", value)
        super.x = value
    }

    set y(value) {
        this._checkForNegative("Y", value)
        super.y = value
    }

    set z(value) {
        this._checkForNegative("Z", value)
        super.z = value
    }

}
