import XYZValues from './XYZValues'

export default class XYZNumberValues extends XYZValues<number> {
	protected get default() {
		return {x: 0, y: 0, z: 0}
	}

	deserializeValue(_prop: string, value: string): number {
		return Number(value)
	}

	checkValue(prop: string, value: number) {
		if (!super.checkValue(prop, value)) return false

		// this allows undefined values to be ignored. So we can for example do
		// things like v.fromObject({z: 123}) to set only z
		if (value === undefined) return false

		// but if any value is supplied, it needs to be a valid number
		if (typeof value !== 'number' || isNaN(value) || !isFinite(value))
			throw new TypeError(`Expected ${prop} to be a finite number. Received: ${value}`)

		return true
	}
}

export {XYZNumberValues}
