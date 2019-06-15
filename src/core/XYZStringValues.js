import XYZValues from './XYZValues'
import Class from 'lowclass'

export default Class('XYZStringValues').extends(XYZValues, ({Super}) => ({
    default: {x: '', y: '', z: ''},

    checkValue(prop, value) {
        if (!super.checkValue(prop, value)) return false
        if (typeof value !== 'string') throw new TypeError(`Expected ${prop} to be a string. Received: ${value}`)
        return true
    },
}))
