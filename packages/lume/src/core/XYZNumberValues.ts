import {XYZValues} from './XYZValues.js'

export class XYZNumberValues extends XYZValues<number> {
	get default() {
		return {x: 0, y: 0, z: 0}
	}

	deserializeValue(_prop: string, value: string): number {
		return Number(value)
	}

	// XYZValues also accepts numbers in the form of strings.
	checkValue(prop: string, value: number) {
		if (!super.checkValue(prop, value)) return false

		// Skip setting undefined values...
		if (value === undefined) return false

		// ...but if a value is supplied, it needs to be a valid number (string number is ok).
		if (!(typeof value === 'number' || typeof value === 'string') || isNaN(value) || !isFinite(value))
			throw new TypeError(`Expected ${prop} to be a finite number. Received: ${value}`)

		return true
	}
}
