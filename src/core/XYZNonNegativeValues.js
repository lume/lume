import XYZNumberValues from './XYZNumberValues'
import Class from 'lowclass'

export default Class('XYZNonNegativeValues').extends(XYZNumberValues, ({Super}) => ({
    checkValue(prop, value) {
        if (!super.checkValue(prop, value)) return false
        if (value < 0) throw new Error(`Expected ${prop} not to be negative. Received: ${value}`)
        return true
    },
}))
