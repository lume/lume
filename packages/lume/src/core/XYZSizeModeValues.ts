import XYZStringValues from './XYZStringValues.js'

export type SizeModeValue = 'literal' | 'proportional'

// TODO it would be cool if we can have compiletime type errors when the values
// aren't SizeModeValues. At the moment we'll get only runtime errors.
export default class XYZSizeModeValues extends XYZStringValues {
	get default() {
		return {x: 'literal', y: 'literal', z: 'literal'}
	}

	get allowedValues() {
		return ['literal', 'proportional']
	}

	checkValue(prop: string, value: SizeModeValue) {
		if (!super.checkValue(prop, value)) return false
		if (!this.allowedValues.includes(value))
			throw new TypeError(`Expected ${prop} to be one of 'literal' or 'proportional'. Received: '${value}'`)
		return true
	}
}

export {XYZSizeModeValues}
