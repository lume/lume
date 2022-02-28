import {XYZValues} from './XYZValues.js'

/**
 * @class XYZNumberValues - Extends [`XYZValues`](./XYZValues) to enforce that
 * values are numbers. Additionally, values of `undefined` are ignored instead
 * of throwing errors, which allows us to handle values like `{y: 123}` when
 * setting element properties to set only one axis value.
 *
 * @extends XYZValues
 */
export class XYZNumberValues extends XYZValues<number> {
	/**
	 * @property {{x: 0, y: 0, z: 0}} default -
	 *
	 * *override*
	 *
	 * Defines the default XYZ values to be the numbers 0,0,0.
	 */
	override get default(): {x: 0; y: 0; z: 0} {
		return {x: 0, y: 0, z: 0}
	}

	/**
	 * @method deserializeValue -
	 *
	 * *override*
	 *
	 * Coerces a string value into a number.
	 */
	override deserializeValue(_prop: 'x' | 'y' | 'z', value: string): number {
		return Number(value)
	}

	/**
	 * @method checkValue -
	 *
	 * *override*
	 *
	 * Check that a value is a number.
	 */
	// TODO XYZNumberValues also accepts numbers in the form of strings, but let's
	// remove this ability. All strings should be coerced and checked for type
	// safety.
	override checkValue(prop: 'x' | 'y' | 'z', value: number) {
		if (!super.checkValue(prop, value)) return false

		// Skip setting undefined values...
		if (value === undefined) return false

		// ...but if a value is supplied, it needs to be a valid number (string number is ok).
		if (!(typeof value === 'number') || isNaN(value) || !isFinite(value))
			throw new TypeError(`Expected ${prop} to be a finite number. Received: ${value}`)

		return true
	}
}
