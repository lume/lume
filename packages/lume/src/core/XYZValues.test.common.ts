import type XYZValues from './XYZValues'
import type {XYZValuesArray} from './XYZValues'

export function testWithSeparator<T>(a: XYZValues, separator: string, ...values: XYZValuesArray<T>) {
	let string = `${values[0]}${separator} ${values[1]}${separator} ${values[2]}`
	expect(() => a.fromString(string, separator)).not.toThrow()
	// a.fromString(string, separator)
	checkValues(a, ...values)

	string = `${values[0]}${separator}      ${values[1]}${separator}${values[2]}    `
	expect(() => a.fromString(string, separator)).not.toThrow()
	checkValues(a, ...values)

	string = `  ${values[0]}  ${values[1]}${separator}     ${values[2]}  `
	expect(() => a.fromString(string, separator)).not.toThrow()
	checkValues(a, ...values)
}

export function checkValues(v: XYZValues, x: any, y: any, z: any) {
	expect(v.x).toBe(x)
	expect(v.y).toBe(y)
	expect(v.z).toBe(z)
}
