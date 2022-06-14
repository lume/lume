import {createEffect, on} from 'solid-js'
import {XYZSizeModeValues} from './XYZSizeModeValues.js'
import {checkValues, testWithSeparator} from './XYZValues.test.common.js'

import type {XYZValuesArray, XYZValuesObject} from './XYZValues.js'

describe('XYZNumberValues', () => {
	describe('.constructor', () => {
		it('is a function', () => {
			expect(typeof XYZSizeModeValues).toBe('function')
		})

		it('has default args', () => {
			const a = new XYZSizeModeValues()
			checkValues(a, 'literal', 'literal', 'literal')
		})

		it('can take individual values', () => {
			const a = new XYZSizeModeValues('literal', 'proportional', 'literal')
			checkValues(a, 'literal', 'proportional', 'literal')
		})

		it('can take an array of values', () => {
			const values: XYZValuesArray<string> = ['literal', 'proportional', 'literal']
			const a = new XYZSizeModeValues(values)
			checkValues(a, 'literal', 'proportional', 'literal')
		})

		it('can take an object with x, y, z properties.', () => {
			const values: XYZValuesObject<string> = {x: 'literal', y: 'proportional', z: 'literal'}
			const a = new XYZSizeModeValues(values)
			checkValues(a, 'literal', 'proportional', 'literal')
		})
	})

	describe('.set', () => {
		it('can take individual values', () => {
			const a = new XYZSizeModeValues()
			a.set('literal', 'proportional', 'literal')
			checkValues(a, 'literal', 'proportional', 'literal')
		})
	})

	describe('.fromArray', () => {
		it('can take an array of values', () => {
			const a = new XYZSizeModeValues()
			const array: XYZValuesArray<string> = ['literal', 'proportional', 'literal']
			a.fromArray(array)
			checkValues(a, 'literal', 'proportional', 'literal')
		})
	})

	describe('.toArray', () => {
		it('returns an array representation', () => {
			const a = new XYZSizeModeValues()
			const array: XYZValuesArray<string> = ['literal', 'proportional', 'literal']
			a.fromArray(array)
			expect(a.toArray()).toEqual(array)
		})
	})

	describe('.fromObject', () => {
		it('can take an object with x, y, z properties.', () => {
			const a = new XYZSizeModeValues()
			const obj: XYZValuesObject<string> = {x: 'literal', y: 'proportional', z: 'literal'}
			a.fromObject(obj)
			checkValues(a, 'literal', 'proportional', 'literal')
		})
	})

	describe('.toObject', () => {
		it('returns an object with x, y, z properties.', () => {
			const a = new XYZSizeModeValues()
			const obj: XYZValuesObject<string> = {x: 'literal', y: 'proportional', z: 'literal'}
			a.fromObject(obj)
			expect(a.toObject()).toEqual(obj)
		})
	})

	describe('.fromString', () => {
		it('can take a string of delimited values, defaulting to space separated', () => {
			const a = new XYZSizeModeValues()

			let string = 'literal proportional literal'
			expect(() => a.fromString(string)).not.toThrowError(TypeError)
			checkValues(a, 'literal', 'proportional', 'literal')

			string = '  literal proportional   literal'
			expect(() => a.fromString(string)).not.toThrowError(TypeError)
			checkValues(a, 'literal', 'proportional', 'literal')

			testWithSeparator<string>(a, ',', 'literal', 'proportional', 'literal')
			testWithSeparator<string>(a, ';', 'proportional', 'proportional', 'literal')
			testWithSeparator<string>(a, '' + Math.random(), 'proportional', 'literal', 'proportional')
		})
	})

	describe('.toString', () => {
		it('returns a string of the values, separated by space or custom delimiter (with spacing)', () => {
			const a = new XYZSizeModeValues()
			let string = 'proportional literal literal'
			a.fromString(string)
			expect(a.toString()).toEqual(string)

			string = 'proportional, literal, literal'
			a.fromString(string)
			expect(a.toString()).not.toEqual(string)
			expect(a.toString(',')).toEqual(string)

			string = 'proportional, literal, literal'
			a.fromString(string)
			const sep = '' + Math.random()
			expect(a.toString(sep)).toEqual(`proportional${sep} literal${sep} literal`)
		})
	})

	// TODO, this doesn't work because .set currently doesn't accept undefined values.
	describe('.fromDefault', () => {
		it('sets the values to default', () => {
			const a = new XYZSizeModeValues('literal', 'proportional', 'literal')
			a.fromDefault()
			checkValues(a, 'literal', 'literal', 'literal')
		})
	})

	describe('setters', () => {
		it('sets values', () => {
			const a = new XYZSizeModeValues()

			a.x = 'literal'
			a.y = 'proportional'
			a.z = 'literal'

			checkValues(a, 'literal', 'proportional', 'literal')
			expect(a.toArray()).toEqual(['literal', 'proportional', 'literal'])
		})

		it('triggers reactivity', async () => {
			const a = new XYZSizeModeValues()
			let count = 0

			createEffect(on(a.asDependency, () => count++))

			await Promise.resolve()

			a.y = 'literal'
			a.z = 'proportional'
			a.x = 'literal'

			expect(count).toEqual(4)
		})
	})

	it("doesn't work with values that aren't strings", () => {
		expect(() => new XYZSizeModeValues('literal', 'proportional', 'literal')).not.toThrow()

		expect(() => new XYZSizeModeValues(-1 as any, -2 as any, -3 as any)).toThrowError(TypeError)
		expect(() => new XYZSizeModeValues(1 as any, -2 as any, -3 as any)).toThrowError(TypeError)
		expect(() => new XYZSizeModeValues(1 as any, 2 as any, -3 as any)).toThrowError(TypeError)

		expect(() => new XYZSizeModeValues(['literal'])).not.toThrow()
		expect(() => new XYZSizeModeValues(['literal', 'proportional'])).not.toThrow()
		expect(() => new XYZSizeModeValues(['literal', 'proportional', 'proportional'])).not.toThrow()

		expect(() => new XYZSizeModeValues(['literal', 'literal', false as any])).toThrowError(TypeError)
		expect(() => new XYZSizeModeValues(['literal', undefined as any, 'proportional'])).not.toThrow() // undefined values are ignored when it comes to XYZNumberValues
		expect(() => new XYZSizeModeValues([5 as any, 'literal', 'proportional'])).toThrowError(TypeError)
		expect(() => new XYZSizeModeValues(['literal', undefined as any, false as any])).toThrowError(TypeError)
		expect(() => new XYZSizeModeValues([5 as any, undefined as any, false as any])).toThrowError(TypeError)

		expect(() => new XYZSizeModeValues(['literal', 'literal', 'hooray' as any])).toThrowError(TypeError)
		expect(() => new XYZSizeModeValues(['literal', 'hoorah' as any, 'proportional'])).toThrowError(TypeError)
		expect(() => new XYZSizeModeValues(['yeah' as any, 'literal', 'proportional'])).toThrowError(TypeError)
		expect(() => new XYZSizeModeValues(['literal', 'hoorah' as any, 'hooray' as any])).toThrowError(TypeError)
		expect(() => new XYZSizeModeValues(['yeah' as any, 'hoorah' as any, 'hooray' as any])).toThrowError(TypeError)

		expect(() => new XYZSizeModeValues({x: 'literal'})).not.toThrow()
		expect(() => new XYZSizeModeValues({x: 'literal', y: 'literal'})).not.toThrow()
		expect(() => new XYZSizeModeValues({x: 'literal', y: 'literal', z: 'proportional'})).not.toThrow()

		expect(() => new XYZSizeModeValues({x: 'literal', y: 'literal', z: false as any})).toThrowError(TypeError)
		expect(() => new XYZSizeModeValues({x: 'literal', y: undefined as any, z: 'proportional'})).not.toThrow()
		expect(() => new XYZSizeModeValues({x: 5 as any, y: 'literal', z: 'proportional'})).toThrowError(TypeError)

		expect(() => new XYZSizeModeValues({x: 'literal', y: 'literal', z: 'hooray' as any})).toThrowError(TypeError)
		expect(() => new XYZSizeModeValues({x: 'literal', y: 'hoorah' as any, z: 'proportional'})).toThrowError(
			TypeError,
		)
		expect(() => new XYZSizeModeValues({x: 'yeah' as any, y: 'literal', z: 'proportional'})).toThrowError(TypeError)

		const a = new XYZSizeModeValues()

		expect(() => (a.x = -1 as any)).toThrowError(TypeError)
		expect(() => (a.y = -0.2 as any)).toThrowError(TypeError)
		expect(() => (a.z = -2 as any)).toThrowError(TypeError)

		expect(() => (a.x = 'yeah' as any)).toThrowError(TypeError)
		expect(() => (a.y = 'hoorah' as any)).toThrowError(TypeError)
		expect(() => (a.z = 'hooray' as any)).toThrowError(TypeError)

		expect(() => a.set([] as any, false as any, null as any)).toThrowError(TypeError)
		expect(() => a.set('literal', false as any, null as any)).toThrowError(TypeError)
		expect(() => a.set('literal', 'proportional', null as any)).toThrowError(TypeError)
	})
})
