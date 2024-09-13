import type {Constructor} from 'lowclass/dist/Constructor.js'
import {Motor, type RenderTask} from './Motor.js'
import {XYZSizeModeValues, type SizeModeValue} from '../xyz-values/XYZSizeModeValues.js'
import {XYZNonNegativeValues} from '../xyz-values/XYZNonNegativeValues.js'
import type {XYZValues, XYZPartialValuesArray, XYZPartialValuesObject} from '../xyz-values/XYZValues.js'
import type {XYZNumberValues} from '../xyz-values/XYZNumberValues.js'
import type {PossiblyCustomElement} from './PossibleCustomElement.js'

const isInstance = Symbol()

/**
 * @mixin - TODO make this @mixin tag do something in the docs.
 * @class PropertyAnimator - This is a utility mixin class to make some Lume
 * element properties animatable when provided a function. This allows animation
 * of some properties like so:
 *
 * ```js
 * const box = document.querySelector('lume-box')
 * box.rotation = (x, y, z, t, dt) => [x, ++y, z]
 * box.opacity = (opacity, t, dt) => opacity - 0.01
 * ```
 *
 * Currently it is only for any XYZValues properties (for example `position`, `rotation`, etc), or `opacity`.
 *
 * For an `XYZValues` property, the function accepts the current x, y, z, time,
 * and deltaTime values for the current frame, and should return the new desired
 * values.
 *
 * For `opacity` it is similar, but the function accepts a opacity, time, and
 * deltaTime, and should return the new desired opacity.
 */
export function PropertyAnimator<T extends Constructor<PossiblyCustomElement>>(Base: T = Object as any) {
	class PropertyAnimator extends Base {
		// @ts-ignore, prevent downstream "has or is using private name" errors.
		[isInstance as any] = true

		_setPropertyXYZ<K extends keyof this, V>(name: K, xyz: XYZValues, newValue: V) {
			// @ts-ignore
			if (newValue === xyz) return

			if (isXYZPropertyFunction(newValue)) {
				this.#handleXYZPropertyFunction(newValue, name, xyz)
			} else {
				if (!this.#settingValueFromPropFunction) this.#removePropertyFunction(name)
				else this.#settingValueFromPropFunction = false

				xyz.from(newValue)
			}
		}

		_setPropertySingle<K extends keyof this, V>(name: K, setter: (newValue: this[K]) => void, newValue: V) {
			if (isSinglePropertyFunction(newValue)) {
				this.#handleSinglePropertyFunction(newValue, name)
			} else {
				if (!this.#settingValueFromPropFunction) this.#removePropertyFunction(name)
				else this.#settingValueFromPropFunction = false

				setter(newValue as any) // FIXME no any
			}
		}

		#propertyFunctions: Map<string, RenderTask> | null = null
		#settingValueFromPropFunction = false

		#handleXYZPropertyFunction(fn: XYZNumberValuesPropertyFunction, name: keyof this, xyz: XYZValues) {
			if (!this.#propertyFunctions) this.#propertyFunctions = new Map()

			const propFunction = this.#propertyFunctions.get(name as string)

			if (propFunction) Motor.removeRenderTask(propFunction)

			this.#propertyFunctions.set(
				name as string,
				Motor.addRenderTask((time, deltaTime) => {
					const result = fn(xyz.x, xyz.y, xyz.z, time, deltaTime)

					if (result === false) {
						this.#propertyFunctions!.delete(name as string)
						return false
					}

					this.#settingValueFromPropFunction = true
					xyz.from(result)

					return
				}),
			)
		}

		#handleSinglePropertyFunction(fn: SinglePropertyFunction, name: keyof this) {
			if (!this.#propertyFunctions) this.#propertyFunctions = new Map()

			const propFunction = this.#propertyFunctions.get(name as string)

			if (propFunction) Motor.removeRenderTask(propFunction)

			this.#propertyFunctions.set(
				name as string,
				Motor.addRenderTask(time => {
					const result = fn((this as any)[name], time)

					if (result === false) {
						this.#propertyFunctions!.delete(name as string)
						return false
					}

					this.#settingValueFromPropFunction = true
					;(this as any)[name] = result

					// TODO The RenderTask return type is `false | void`, so why
					// does the noImplicitReturns TS option require a return
					// here? Open bug on TypeScript.
					return
				}),
			)
		}

		// remove property function (render task) if any.
		#removePropertyFunction(name: keyof this) {
			if (!this.#propertyFunctions) return

			const propFunction = this.#propertyFunctions.get(name as string)

			if (propFunction) {
				Motor.removeRenderTask(propFunction)
				this.#propertyFunctions.delete(name as string)
				if (!this.#propertyFunctions.size) this.#propertyFunctions = null
			}
		}

		removeAllPropertyFunctions() {
			if (this.#propertyFunctions)
				for (const [name] of this.#propertyFunctions) this.#removePropertyFunction(name as keyof this)
		}

		override disconnectedCallback() {
			super.disconnectedCallback?.()
			this.removeAllPropertyFunctions()
		}
	}

	PropertyAnimator.prototype[isInstance] = true

	return PropertyAnimator
}

Object.defineProperty(PropertyAnimator, Symbol.hasInstance, {
	value(obj: any): boolean {
		if (!obj) return false
		if (obj[isInstance]) return true
		return false
	},
})

// the following type guards are used above just to satisfy the type system,
// though the actual runtime check does not guarantee that the functions are of
// the expected shape.
function isXYZPropertyFunction(f: any): f is XYZNumberValuesPropertyFunction {
	return typeof f === 'function'
}
function isSinglePropertyFunction(f: any): f is SinglePropertyFunction {
	return typeof f === 'function'
}

// This type represents the types of values that can be set via attributes or
// properties (attributes pass strings to properties and properties all handle
// string values for example, hence why it includes `| string`)
export type XYZValuesProperty<XYZValuesType extends XYZValues, DataType> =
	| XYZValuesType
	| XYZPartialValuesArray<DataType>
	| XYZPartialValuesObject<DataType>
	| string

export type XYZNumberValuesProperty = XYZValuesProperty<XYZNumberValues, number>
export type XYZNonNegativeNumberValuesProperty = XYZValuesProperty<XYZNonNegativeValues, number>
export type XYZSizeModeValuesProperty = XYZValuesProperty<XYZSizeModeValues, SizeModeValue>

// Property functions are used for animating properties of type XYZNumberValues
export type XYZValuesPropertyFunction<XYZValuesPropertyType, DataType> = (
	x: DataType,
	y: DataType,
	z: DataType,
	time: number,
	deltaTime: number,
) => XYZValuesPropertyType | false

export type XYZNumberValuesPropertyFunction = XYZValuesPropertyFunction<XYZNumberValuesProperty, number>
export type XYZNonNegativeNumberValuesPropertyFunction = XYZValuesPropertyFunction<
	XYZNonNegativeNumberValuesProperty,
	number
>

export type SinglePropertyFunction = (value: number, time: number) => number | false
