import XYZAnyValues from './XYZAnyValues'
import {checkValues, testWithSeparator} from './XYZValues.test.common'

describe('XYZAnyValues', () => {
	describe('.constructor', () => {
		it('is a function', () => {
			expect(typeof XYZAnyValues).toBe('function')
		})

		it('has default args', () => {
			const a = new XYZAnyValues()
			checkValues(a, undefined, undefined, undefined)
		})

		it('can take arbitrary values', () => {
			const a = new XYZAnyValues(1, 'foo', false)
			checkValues(a, 1, 'foo', false)
		})

		it('can take an array of values', () => {
			const values = [1, 'foo', false]
			const a = new XYZAnyValues(values)
			checkValues(a, 1, 'foo', false)
		})

		it('can take an object with x, y, z properties.', () => {
			const values = {x: 1, y: 'foo', z: false}
			const a = new XYZAnyValues(values)
			checkValues(a, 1, 'foo', false)
		})
	})

	describe('.set', () => {
		it('can take arbitrary values', () => {
			const a = new XYZAnyValues()
			a.set(1, 'foo', false)
			checkValues(a, 1, 'foo', false)
		})
	})

	describe('.fromArray', () => {
		it('can take an array of values', () => {
			const a = new XYZAnyValues()
			const array: [any, any, any] = [1, 'foo', false]
			a.fromArray(array)
			checkValues(a, 1, 'foo', false)
		})
	})

	describe('.toArray', () => {
		it('returns an array representation', () => {
			const a = new XYZAnyValues()
			const array: [any, any, any] = [1, 'foo', false]
			a.fromArray(array)
			expect(a.toArray()).toEqual(array)
		})
	})

	describe('.fromObject', () => {
		it('can take an object with x, y, z properties.', () => {
			const a = new XYZAnyValues()
			const obj = {x: 1, y: 'foo', z: false}
			a.fromObject(obj)
			checkValues(a, 1, 'foo', false)
		})
	})

	describe('.toObject', () => {
		it('returns an object with x, y, z properties.', () => {
			const a = new XYZAnyValues()
			const obj = {x: 1, y: 'foo', z: false}
			a.fromObject(obj)
			expect(a.toObject()).toEqual(obj)
		})
	})

	describe('.fromString', () => {
		it('can take a string of delimited values, defaulting to space separated', () => {
			const a = new XYZAnyValues()

			let string = '1 foo false'
			a.fromString(string)
			checkValues(a, '1', 'foo', 'false')

			string = '  1 foo   false'
			a.fromString(string)
			checkValues(a, '1', 'foo', 'false')

			testWithSeparator<string>(a, ',', '1', 'foo', 'false')
			testWithSeparator<string>(a, ';', '1', 'foo', 'false')
			testWithSeparator<string>(a, '' + Math.random(), '1', 'foo', 'false')
		})
	})

	describe('.toString', () => {
		it('returns a string of the values, separated by space or custom delimiter (with spacing)', () => {
			const a = new XYZAnyValues()
			let string = '1 foo false'
			a.fromString(string)
			expect(a.toString()).toEqual(string)

			string = '1, foo, false'
			a.fromString(string)
			expect(a.toString()).not.toEqual(string)
			expect(a.toString(',')).toEqual(string)

			string = '1, foo, false'
			a.fromString(string)
			expect(a.toString()).not.toEqual(string)
			const sep = '' + Math.random()
			expect(a.toString(sep)).toEqual(`1${sep} foo${sep} false`)
		})
	})

	// TODO, this doesn't work because .set currently doesn't accept undefined values.
	describe('.fromDefault', () => {
		it('sets the values to default', () => {
			const a = new XYZAnyValues(1, 2, 3)
			a.fromDefault()
			checkValues(a, undefined, undefined, undefined)
		})
	})

	describe('setters', () => {
		it('sets values', () => {
			const a = new XYZAnyValues()

			a.x = 1
			a.y = 2
			a.z = 3

			checkValues(a, 1, 2, 3)
			expect(a.toArray()).toEqual([1, 2, 3])
		})

		it('triggers valuechange events', () => {
			const a = new XYZAnyValues()
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
})
