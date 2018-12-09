import { props as skateProps } from '@trusktr/skatejs'
import { Color } from 'three'
import XYZValues from './XYZValues'
import XYZNumberValues from './XYZNumberValues'
import XYZNonNegativeValues from './XYZNonNegativeValues'
import XYZStringValues from './XYZStringValues'
import XYZSizeModeValues from './XYZSizeModeValues'

function createXYZPropType(Type, override = {}) {
    return {
        attribute: { source: true, target: false }, // get the value from an attribute (but don't mirror it back)
        coerce(val, propName) { return val === this.element[propName] ? val : this.element[propName].from(val) },
        default(propName) { return this.element[propName] },
        deserialize(val, propName) { return this.element[propName].fromString(val) },
        serialize(val, propName) { this.element[propName].toString() },
        ...override,
    }
}

function createGenericPropType(Type, override = {}) {
    return {
        attribute: { source: true, target: false }, // get the value from an attribute (but don't mirror it back)
        coerce: val => val instanceof Type ? val : new Type(val),
        default: new Type,
        deserialize: val => new Type(val),
        serialize: val => val.toString(),
        ...override,
    }
}

export const props = {
    ...skateProps,
    boolean: {
        ...skateProps.boolean,
        deserialize: val => val != null && val !== 'false'
    },
    THREE: {
        // TODO replace THREE.Color with a persistent object that can be
        // dynamically updated, like with XYZValues
        Color: createGenericPropType(Color, {
            default: () => new Color( Math.random(), Math.random(), Math.random() ),
            serialize: val => new Color( val ).getStyle(), // returns a CSS "rbg()" string
        }),
    },
    XYZValues: createXYZPropType(XYZValues),
    XYZNumberValues: createXYZPropType(XYZNumberValues),
    XYZNonNegativeValues: createXYZPropType(XYZNonNegativeValues),
    XYZStringValues: createXYZPropType(XYZStringValues),
    XYZSizeModeValues: createXYZPropType(XYZSizeModeValues),
}

// map a SkateJS prop value to a sub-object on the instance
export const mapPropTo = (prop, subObj) => ({
    ...prop,
    coerce(val, key) { return this[subObj][key] = prop.coerce(val) },
    deserialize(val, key) { return this[subObj][key] = prop.deserialize(val) },
})
