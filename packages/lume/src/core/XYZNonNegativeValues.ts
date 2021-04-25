import {XYZNumberValues} from './XYZNumberValues.js'

export class XYZNonNegativeValues extends XYZNumberValues {
	checkValue(prop: string, value: number) {
		if (!super.checkValue(prop, value)) return false
		if (value < 0) throw new TypeError(`Expected ${prop} not to be negative. Received: ${value}`)
		return true
	}
}
