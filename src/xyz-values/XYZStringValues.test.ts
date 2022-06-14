import {createEffect, on} from 'solid-js'
import {XYZStringValues} from './XYZStringValues.js'
import {checkValues, testWithSeparator} from './XYZValues.test.common.js'

import type {XYZValuesArray, XYZValuesObject} from './XYZValues.js'

describe('XYZNumberValues', () => {
	describe('.constructor', () => {
		it('is a function', () => {
			expect(typeof XYZStringValues).toBe('function')
		})

		it('has default args', () => {
			const a = new XYZStringValues()
			checkValues(a, '', '', '')
		})

		it('can take individual values', () => {
			const a = new XYZStringValues('a', 'b', 'c')
			checkValues(a, 'a', 'b', 'c')
		})

		it('can take an array of values', () => {
			const values: XYZValuesArray<string> = ['a', 'b', 'c']
			const a = new XYZStringValues(values)
			checkValues(a, 'a', 'b', 'c')
		})

		it('can take an object with x, y, z properties.', () => {
			const values: XYZValuesObject<string> = {x: 'a', y: 'b', z: 'c'}
			const a = new XYZStringValues(values)
			checkValues(a, 'a', 'b', 'c')
		})
	})

	describe('.set', () => {
		it('can take individual values', () => {
			const a = new XYZStringValues()
			a.set('a', 'b', 'c')
			checkValues(a, 'a', 'b', 'c')
		})
	})

	describe('.fromArray', () => {
		it('can take an array of values', () => {
			const a = new XYZStringValues()
			const array: XYZValuesArray<string> = ['a', 'b', 'c']
			a.fromArray(array)
			checkValues(a, 'a', 'b', 'c')
		})
	})

	describe('.toArray', () => {
		it('returns an array representation', () => {
			const a = new XYZStringValues()
			const array: XYZValuesArray<string> = ['a', 'b', 'c']
			a.fromArray(array)
			expect(a.toArray()).toEqual(array)
		})
	})

	describe('.fromObject', () => {
		it('can take an object with x, y, z properties.', () => {
			const a = new XYZStringValues()
			const obj: XYZValuesObject<string> = {x: 'a', y: 'b', z: 'c'}
			a.fromObject(obj)
			checkValues(a, 'a', 'b', 'c')
		})
	})

	describe('.toObject', () => {
		it('returns an object with x, y, z properties.', () => {
			const a = new XYZStringValues()
			const obj: XYZValuesObject<string> = {x: 'a', y: 'b', z: 'c'}
			a.fromObject(obj)
			expect(a.toObject()).toEqual(obj)
		})
	})

	describe('.fromString', () => {
		it('can take a string of delimited values, defaulting to space separated', () => {
			const a = new XYZStringValues()

			let string = '1 foo false'
			expect(() => a.fromString(string)).not.toThrowError(TypeError)
			checkValues(a, '1', 'foo', 'false')

			string = '  1.2 2   3.456'
			expect(() => a.fromString(string)).not.toThrowError(TypeError)
			checkValues(a, '1.2', '2', '3.456')

			testWithSeparator<string>(a, ',', 'foo', 'bar', 'baz')
			testWithSeparator<string>(a, ';', '3.14', '5', '4')
			testWithSeparator<string>(a, '' + Math.random(), 'a', 'b', 'c')
		})
	})

	describe('.toString', () => {
		it('returns a string of the values, separated by space or custom delimiter (with spacing)', () => {
			const a = new XYZStringValues()
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
			const a = new XYZStringValues('a', 'b', 'c')
			a.fromDefault()
			checkValues(a, '', '', '')
		})
	})

	describe('setters', () => {
		it('sets values', () => {
			const a = new XYZStringValues()

			a.x = 'foo'
			a.y = 'bar'
			a.z = 'baz'

			checkValues(a, 'foo', 'bar', 'baz')
			expect(a.toArray()).toEqual(['foo', 'bar', 'baz'])
		})

		it('triggers reactivity', async () => {
			const a = new XYZStringValues()
			let count = 0

			createEffect(on(a.asDependency, () => count++))

			await Promise.resolve()

			a.y = 'bar'
			a.z = 'baz'
			a.x = 'foo'

			expect(count).toEqual(4)
		})
	})

	it("doesn't work with values that aren't strings", () => {
		expect(() => new XYZStringValues('a', 'b', 'c')).not.toThrow()

		expect(() => new XYZStringValues(-1 as any, -2 as any, -3 as any)).toThrowError(TypeError)
		expect(() => new XYZStringValues(1 as any, -2 as any, -3 as any)).toThrowError(TypeError)
		expect(() => new XYZStringValues(1 as any, 2 as any, -3 as any)).toThrowError(TypeError)

		expect(() => new XYZStringValues(['1'])).not.toThrow()
		expect(() => new XYZStringValues(['1', '2'])).not.toThrow()
		expect(() => new XYZStringValues(['1', '2', '3'])).not.toThrow()

		expect(() => new XYZStringValues(['1', '2', false as any])).toThrowError(TypeError)
		expect(() => new XYZStringValues(['1', undefined as any, '3'])).not.toThrow() // undefined values are ignored when it comes to XYZNumberValues
		expect(() => new XYZStringValues([5 as any, '2', '3'])).toThrowError(TypeError)
		expect(() => new XYZStringValues(['1', undefined as any, false as any])).toThrowError(TypeError)
		expect(() => new XYZStringValues([5 as any, undefined as any, false as any])).toThrowError(TypeError)

		expect(() => new XYZStringValues({x: '1'})).not.toThrow()
		expect(() => new XYZStringValues({x: '1', y: '2'})).not.toThrow()
		expect(() => new XYZStringValues({x: '1', y: '2', z: '3'})).not.toThrow()

		expect(() => new XYZStringValues({x: '1', y: '2', z: false as any})).toThrowError(TypeError)
		expect(() => new XYZStringValues({x: '1', y: undefined as any, z: '3'})).not.toThrow()
		expect(() => new XYZStringValues({x: 5 as any, y: '2', z: '3'})).toThrowError(TypeError)

		const a = new XYZStringValues()

		expect(() => (a.x = -1 as any)).toThrowError(TypeError)
		expect(() => (a.y = -0.2 as any)).toThrowError(TypeError)
		expect(() => (a.z = -2 as any)).toThrowError(TypeError)

		expect(() => a.set([] as any, false as any, null as any)).toThrowError(TypeError)
		expect(() => a.set('1', false as any, null as any)).toThrowError(TypeError)
		expect(() => a.set('1', '2', null as any)).toThrowError(TypeError)
	})
})
