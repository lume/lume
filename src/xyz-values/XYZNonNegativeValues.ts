import {XYZNumberValues} from './XYZNumberValues.js'

/**
 * @class XYZNonNegativeValues - Extends [`XYZNumberValues`](./XYZNumberValues)
 * to enforce that values are positive numbers.
 *
 * @extends XYZNumberValues
 */
export class XYZNonNegativeValues extends XYZNumberValues {
	checkValue(prop: 'x' | 'y' | 'z', value: number) {
		if (!super.checkValue(prop, value)) return false
		if (value < 0) throw new TypeError(`Expected ${prop} not to be negative. Received: ${value}`)
		return true
	}
}
