import XYZStringValues from './XYZStringValues'
import Class from 'lowclass'

export default Class('XYZSizeModeValues').extends(XYZStringValues, ({Super}) => ({
    default: {x: 'literal', y: 'literal', z: 'literal'},
    allowedValues: ['literal', 'proportional'],

    checkValue(prop, value) {
        if (!super.checkValue(prop, value)) return false
        if (!this.allowedValues.includes(value))
            throw new TypeError(`Expected ${prop} to be one of 'literal' or 'proportional'. Received: '${value}'`)
        return true
    },
}))
