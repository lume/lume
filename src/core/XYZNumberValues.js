import XYZValues from './XYZValues'
import Class from 'lowclass'

export default
Class('XYZNumberValues').extends(XYZValues, ({ Super }) => ({
    default: { x: 0, y: 0, z: 0 },

    deserializeValue(prop, string) {
        return Number(string)
    },

    checkValue(prop, value) {
        if (!Super(this).checkValue(prop, value)) return false
        if ( typeof value !== 'number' || isNaN(value) || !isFinite(value) )
            throw new TypeError(`Expected ${prop} to be a finite number. Received: ${value}`)
        return true
    },
}))
