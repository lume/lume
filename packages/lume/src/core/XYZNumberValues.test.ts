import XYZNumberValues from './XYZNumberValues'
import {checkValues, testWithSeparator} from './XYZValues.test.common'

import type {XYZValuesArray, XYZValuesObject} from './XYZValues'

describe('XYZNumberValues', () => {
	describe('.constructor', () => {
		it('is a function', () => {
			expect(typeof XYZNumberValues).toBe('function')
		})

		it('has default args', () => {
			const a = new XYZNumberValues()
			checkValues(a, 0, 0, 0)
		})

		it('can take individual values', () => {
			const a = new XYZNumberValues(1, 2.3, 3.4)
			checkValues(a, 1, 2.3, 3.4)
		})

		it('can take an array of values', () => {
			const values: XYZValuesArray<number> = [1.2, 3.6, 4.2]
			const a = new XYZNumberValues(values)
			checkValues(a, 1.2, 3.6, 4.2)
		})

		it('can take an object with x, y, z properties.', () => {
			const values: XYZValuesObject<number> = {x: 4.5, y: 2.3, z: 1.2}
			const a = new XYZNumberValues(values)
			checkValues(a, 4.5, 2.3, 1.2)
		})
	})

	describe('.set', () => {
		it('can take individual values', () => {
			const a = new XYZNumberValues()
			a.set(1, 2, 3)
			checkValues(a, 1, 2, 3)
		})
	})

	describe('.fromArray', () => {
		it('can take an array of values', () => {
			const a = new XYZNumberValues()
			const array: XYZValuesArray<number> = [3, 1, 2]
			a.fromArray(array)
			checkValues(a, 3, 1, 2)
		})
	})

	describe('.toArray', () => {
		it('returns an array representation', () => {
			const a = new XYZNumberValues()
			const array: XYZValuesArray<number> = [12, 23, 34]
			a.fromArray(array)
			expect(a.toArray()).toEqual(array)
		})
	})

	describe('.fromObject', () => {
		it('can take an object with x, y, z properties.', () => {
			const a = new XYZNumberValues()
			const obj: XYZValuesObject<number> = {x: 1, y: 4, z: 3}
			a.fromObject(obj)
			checkValues(a, 1, 4, 3)
		})
	})

	describe('.toObject', () => {
		it('returns an object with x, y, z properties.', () => {
			const a = new XYZNumberValues()
			const obj: XYZValuesObject<number> = {x: 1, y: 2, z: 4}
			a.fromObject(obj)
			expect(a.toObject()).toEqual(obj)
		})
	})

	describe('.fromString', () => {
		it('can take a string of delimited values, defaulting to space separated', () => {
			const a = new XYZNumberValues()

			let string = '1 foo false'

			// Should throw a runtime error because "foo" is not a number
			expect(() => a.fromString(string)).toThrowError(
				TypeError,
				'Expected y to be a finite number. Received: NaN',
			)

			string = '1 2 false'

			// Should throw a runtime error because "false" is not a number
			expect(() => a.fromString(string)).toThrowError(
				TypeError,
				'Expected z to be a finite number. Received: NaN',
			)

			string = '1 2 3.456'
			expect(() => a.fromString(string)).not.toThrowError(TypeError)
			checkValues(a, 1, 2, 3.456)

			string = '  1.2 2   3.456'
			expect(() => a.fromString(string)).not.toThrowError(TypeError)
			checkValues(a, 1.2, 2, 3.456)

			testWithSeparator<number>(a, ',', 1.2, 3, 4.56)
			testWithSeparator<number>(a, ';', 3.14, 5, 4)
			testWithSeparator<number>(a, '' + Math.random(), 0.123, 23.456, 34)
		})
	})

	describe('.toString', () => {
		it('returns a string of the values, separated by space or custom delimiter (with spacing)', () => {
			const a = new XYZNumberValues()
			let string = '1.2 2.3 3.4'
			a.fromString(string)
			expect(a.toString()).toEqual(string)

			string = '1.2, 2.3, 3.4'
			a.fromString(string)
			expect(a.toString()).not.toEqual(string)
			expect(a.toString(',')).toEqual(string)

			string = '1.2, 2.3, 3.4'
			a.fromString(string)
			const sep = '' + Math.random()
			expect(a.toString(sep)).toEqual(`1.2${sep} 2.3${sep} 3.4`)
		})
	})

	// TODO, this doesn't work because .set currently doesn't accept undefined values.
	describe('.fromDefault', () => {
		it('sets the values to default', () => {
			const a = new XYZNumberValues(1, 2, 3)
			a.fromDefault()
			checkValues(a, 0, 0, 0)
		})
	})

	describe('setters', () => {
		it('sets values', () => {
			const a = new XYZNumberValues()

			a.x = 1
			a.y = 2
			a.z = 3

			checkValues(a, 1, 2, 3)
			expect(a.toArray()).toEqual([1, 2, 3])
		})

		it('triggers valuechange events', () => {
			const a = new XYZNumberValues()
			const changedProps: string[] = []

			a.on('valuechanged', (prop: string) => {
				changedProps.push(prop)
			})

			a.y = 2
			a.z = 3
			a.x = 1

			expect(changedProps).toEqual(['y', 'z', 'x'])
		})
	})

	it("doesn't work with values that aren't numbers", () => {
		expect(() => new XYZNumberValues(1, 2, 3)).not.toThrow()

		// It tries to coerce strings to numbers.
		expect(() => new XYZNumberValues('1', '2' as any, '3' as any)).not.toThrow()
		expect(() => new XYZNumberValues(1, '2' as any, '3' as any)).not.toThrow()
		expect(() => new XYZNumberValues(1, 2, '3' as any)).not.toThrow()

		expect(() => new XYZNumberValues([1] as any)).not.toThrow()
		expect(() => new XYZNumberValues([1, 2] as any)).not.toThrow()
		expect(() => new XYZNumberValues([1, 2, 3] as any)).not.toThrow()

		expect(() => new XYZNumberValues([1, 2, false as any])).toThrowError(TypeError)
		expect(() => new XYZNumberValues([1, undefined as any, 3])).not.toThrow() // undefined values are ignored when it comes to XYZNumberValues
		expect(() => new XYZNumberValues(['foo' as any, 2, 3])).toThrowError(TypeError)
		expect(() => new XYZNumberValues([1, undefined as any, false as any])).toThrowError(TypeError)
		expect(() => new XYZNumberValues(['foo' as any, undefined as any, false as any])).toThrowError(TypeError)

		expect(() => new XYZNumberValues({x: 1, y: 2, z: 3})).not.toThrow()

		expect(() => new XYZNumberValues({x: 1, y: 2, z: false as any})).toThrowError(TypeError)
		expect(() => new XYZNumberValues({x: 1, y: undefined, z: 3})).not.toThrow()
		expect(() => new XYZNumberValues({x: 1, y: undefined, z: undefined})).not.toThrow()
		expect(() => new XYZNumberValues({x: 'foo' as any, y: 2, z: 3})).toThrowError(TypeError)

		const a = new XYZNumberValues()

		expect(() => (a.x = 'asdf' as any)).toThrowError(TypeError)
		expect(() => (a.y = true as any)).toThrowError(TypeError)
		expect(() => (a.z = {} as any)).toThrowError(TypeError)

		expect(() => a.set([] as any, false as any, null as any)).toThrowError(TypeError)
		expect(() => a.set(1, false as any, null as any)).toThrowError(TypeError)
		expect(() => a.set(1, 2, null as any)).toThrowError(TypeError)
	})
})
