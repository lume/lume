import {emits} from '@lume/eventful'
import {attribute, untrack, element, variable, Variable} from '@lume/element'
import {TreeNode} from './TreeNode.js'
import {XYZSizeModeValues, SizeModeValue} from '../xyz-values/XYZSizeModeValues.js'
import {XYZNonNegativeValues} from '../xyz-values/XYZNonNegativeValues.js'
import {Motor} from './Motor.js'

import type {StopFunction} from '@lume/element'
import type {
	XYZValues,
	XYZValuesObject,
	XYZPartialValuesArray,
	XYZPartialValuesObject,
} from '../xyz-values/XYZValues.js'
import type {RenderTask} from './Motor.js'
import type {XYZNumberValues} from '../xyz-values/XYZNumberValues.js'

// Cache variables to avoid making new variables in repeatedly-called methods.
const previousSize: Partial<XYZValuesObject<number>> = {}

export type SizeableAttributes = 'sizeMode' | 'size'

const sizeMode = new WeakMap<Sizeable, XYZSizeModeValues>()
const size = new WeakMap<Sizeable, XYZNonNegativeValues>()

// No decorators for private fields (yet), so we implement reactivity manually.
// const calculatedSize = new WeakMap<Sizeable, Variable<XYZValuesObject<number>>>()
const calculatedSize = new WeakMap<Sizeable, Variable<{x: number; y: number; z: number}>>()

/**
 * @class Sizeable - A class that contains the `sizeMode` and `size` features LUME's elements.
 * @extends TreeNode
 */
// Sizeable and its subclass Transformable extend TreeNode because they know
// about their `parent` when calculating proportional sizes or world matrices
// based on parent values.
@element
export class Sizeable extends TreeNode {
	// TODO handle ctor arg types
	constructor() {
		super()

		calculatedSize.set(
			this,
			// variable<XYZValuesObject<number>>({x: 0, y: 0, z: 0}),
			variable({x: 0, y: 0, z: 0}),
		)

		this.sizeMode.on('valuechanged', () => !this._isSettingProperty && (this.sizeMode = this.sizeMode))
		this.size.on('valuechanged', () => !this._isSettingProperty && (this.size = this.size))
	}

	/**
	 * @property {XYZSizeModeValues} sizeMode - Set the size mode for each
	 * axis. Possible size modes are "literal" and "proportional". The
	 * default values are "literal" for all axes. The size mode speicified
	 * for an axis dictates how the respective value of the same axis in
	 * the [`size`](TODO) property will behave.  A value of
	 * "literal" for the X axis of `sizeMode` means the value for the X axis
	 * of `size` will be a literal value.  A value of "proportional" for
	 * the X axis of `sizeMode` means the value for the X axis of
	 * `size` is a proportion of whatever the current size of
	 * this node's parent node is.
	 */
	@attribute
	@emits('propertychange')
	set sizeMode(newValue: XYZSizeModeValuesProperty) {
		if (typeof newValue === 'function') throw new TypeError('property functions are not allowed for sizeMode')
		if (!sizeMode.has(this)) sizeMode.set(this, new XYZSizeModeValues('literal', 'literal', 'literal'))
		this._setPropertyXYZ('sizeMode', sizeMode.get(this)!, newValue)
	}
	get sizeMode(): XYZSizeModeValues {
		if (!sizeMode.has(this)) sizeMode.set(this, new XYZSizeModeValues('literal', 'literal', 'literal'))
		return sizeMode.get(this)!
	}

	// prettier-ignore
	getSizeMode(): XYZSizeModeValues { return this.sizeMode as XYZSizeModeValues }
	// TODO ^: Now that TS 4.3 landed the ability to have separate types for
	// setters than for getters, we can remove methods like getSizeMode,
	// etc.

	// TODO: A "differential" size would be cool. Good for padding,
	// borders, etc. Inspired from Famous' differential sizing.
	//
	// TODO: A "target" size where sizing can be relative to another node.
	// This would be tricky though, because there could be circular size
	// dependencies. Maybe we'd throw an error in that case, because there'd be no original size to base off of.

	/**
	 * @property {XYZNonNegativeValues} size -
	 * Set the size of each axis. The size for each axis depends on the
	 * sizeMode for each axis. For example, if node.sizeMode is set to
	 * `sizeMode = ['literal', 'proportional', 'literal']`, then setting
	 * `size = [20, 0.5, 30]` means that X size is a literal value of 20,
	 * Y size is 0.5 of it's parent Y size, and Z size is a literal value
	 * of 30. It is easy this way to mix literal and proportional sizes for
	 * the different axes.
	 *
	 * Literal sizes can be any value (the literal size that you want) and
	 * proportional sizes are a number between 0 and 1 representing a
	 * proportion of the parent node size. 0 means 0% of the parent size,
	 * and 1.0 means 100% of the parent size.
	 *
	 * All size values must be positive numbers.
	 *
	 * @param {Object} newValue
	 * @param {number} [newValue.x] The x-axis size to apply.
	 * @param {number} [newValue.y] The y-axis size to apply.
	 * @param {number} [newValue.z] The z-axis size to apply.
	 */
	@attribute
	@emits('propertychange')
	set size(newValue: XYZNonNegativeNumberValuesProperty | XYZNonNegativeNumberValuesPropertyFunction) {
		if (!size.has(this)) size.set(this, new XYZNonNegativeValues(0, 0, 0))
		this._setPropertyXYZ('size', size.get(this)!, newValue)
	}
	get size(): XYZNonNegativeValues {
		if (!size.has(this)) size.set(this, new XYZNonNegativeValues(0, 0, 0))
		return size.get(this)!
	}

	// prettier-ignore
	getSize(): XYZNonNegativeValues { return this.size as XYZNonNegativeValues }

	/**
	 * Get the actual size of the Node. This can be useful when size is
	 * proportional, as the actual size of the Node depends on the size of
	 * it's parent.
	 *
	 * @readonly
	 *
	 * @return {Array.number} An Oject with x, y, and z properties, each
	 * property representing the computed size of the x, y, and z axes
	 * respectively.
	 *
	 * @reactive
	 */
	get calculatedSize() {
		// TODO we can re-calculate the actual size lazily, this way it can
		// normally be deferred to a Motor render task, unless a user
		// explicitly needs it and reads the value.
		// if (this.__sizeDirty) this._calcSize

		// TODO make __calculatedSize properties readonly and don't clone it
		// each time.
		return {...(calculatedSize.get(this)?.get() ?? {x: 0, y: 0, z: 0})}
	}

	/**
	 * Subclasses should push stop functions returned by autorun() into this
	 * array in connectedCallback, then disconnectedCallback will
	 * automatically clean them up.
	 */
	// XXX Perhaps move this to a separate mixin, as it isn't really related to sizing.
	_stopFns: Array<StopFunction> = []

	connectedCallback() {
		super.connectedCallback()

		// For example, subclasses should push autoruns in connectedCallback.
		// this._stopFns.push(autorun(...))
	}

	disconnectedCallback() {
		super.disconnectedCallback?.()

		for (const stop of this._stopFns) stop()
		this._stopFns.length = 0
	}

	get _renderParent(): Sizeable | null {
		if (this.hasHtmlApi) {
			return this._composedParent as Sizeable | null
		} else {
			return this.parent as Sizeable | null
		}
	}

	get _renderChildren() {
		if (this.hasHtmlApi) {
			return this._composedChildren
		} else {
			return this.subnodes
		}
	}

	_getParentSize() {
		return (this._renderParent && calculatedSize.get(this._renderParent)?.get()) ?? {x: 0, y: 0, z: 0}
	}

	_calcSize() {
		const _calculatedSize = calculatedSize.get(this)!.get()

		Object.assign(previousSize, _calculatedSize)

		const size = this.getSize()
		const sizeMode = this.getSizeMode()
		const parentSize = this._getParentSize()

		if (sizeMode.x == 'literal') {
			_calculatedSize.x = size.x
		} else {
			// proportional
			_calculatedSize.x = parentSize.x * size.x
		}

		if (sizeMode.y == 'literal') {
			_calculatedSize.y = size.y
		} else {
			// proportional
			_calculatedSize.y = parentSize.y * size.y
		}

		if (sizeMode.z == 'literal') {
			_calculatedSize.z = size.z
		} else {
			// proportional
			_calculatedSize.z = parentSize.z * size.z
		}

		// trigger reactive updates (although we set it to the same value)
		calculatedSize.get(this)!.set(_calculatedSize)

		if (
			previousSize.x !== _calculatedSize.x ||
			previousSize.y !== _calculatedSize.y ||
			previousSize.z !== _calculatedSize.z
		) {
			this.emit('sizechange', {..._calculatedSize})
		}
	}

	#isSettingProperty = false

	get _isSettingProperty() {
		return this.#isSettingProperty
	}

	_setPropertyXYZ<K extends keyof this, V>(name: K, xyz: XYZValues, newValue: V) {
		// if (newValue === (this as any)['__' + name]) return
		// @ts-ignore
		if (newValue === xyz) return

		this.#isSettingProperty = true

		if (isXYZPropertyFunction(newValue)) {
			this.#handleXYZPropertyFunction(newValue, name, xyz)
		} else {
			if (!this.#settingValueFromPropFunction) this.#removePropertyFunction(name)
			else this.#settingValueFromPropFunction = false

			// If we're in a computation, we don't want the valuechanged
			// event that will be emitted to trigger reactivity (see
			// valuechanged listeners above). If we've reached this logic,
			// it is because a property is being set, which will already
			// trigger reactivity.
			untrack(() => {
				// ;(this as any)['__' + name].from(newValue)
				xyz.from(newValue)
			})
		}

		this.#isSettingProperty = false
	}

	_setPropertySingle<K extends keyof this, V>(name: K, setter: (newValue: this[K]) => void, newValue: V) {
		this.#isSettingProperty = true

		if (isSinglePropertyFunction(newValue)) {
			this.#handleSinglePropertyFunction(newValue, name)
		} else {
			if (!this.#settingValueFromPropFunction) this.#removePropertyFunction(name)
			else this.#settingValueFromPropFunction = false

			// Same note about this untrack() call as the one in _setPropertyXYZ.
			untrack(() => {
				// ;(this as any)['__' + name] = newValue
				setter(newValue as any) // FIXME no any
			})
		}

		this.#isSettingProperty = false
	}

	#propertyFunctions: Map<string, RenderTask> | null = null
	#settingValueFromPropFunction = false

	#handleXYZPropertyFunction(fn: XYZNumberValuesPropertyFunction, name: keyof this, xyz: XYZValues) {
		if (!this.#propertyFunctions) this.#propertyFunctions = new Map()

		const propFunction = this.#propertyFunctions.get(name as string)

		if (propFunction) Motor.removeRenderTask(propFunction)

		this.#propertyFunctions.set(
			name as string,
			Motor.addRenderTask(time => {
				const result = fn(
					// (this as any)['__' + name].x,
					// (this as any)['__' + name].y,
					// (this as any)['__' + name].z,
					xyz.x,
					xyz.y,
					xyz.z,
					time,
				)

				if (result === false) {
					this.#propertyFunctions!.delete(name as string)
					return false
				}

				// mark this true, so that the following set of this[name]
				// doesn't override the prop function (normally a
				// user can set this[name] to a value that isn't a function
				// to disable the prop function).
				this.#settingValueFromPropFunction = true

				// ;(this as any)[name] = result
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
				// const result = fn((this as any)['__' + name], time)
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
}

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
) => XYZValuesPropertyType | false

export type XYZNumberValuesPropertyFunction = XYZValuesPropertyFunction<XYZNumberValuesProperty, number>
export type XYZNonNegativeNumberValuesPropertyFunction = XYZValuesPropertyFunction<
	XYZNonNegativeNumberValuesProperty,
	number
>

export type SinglePropertyFunction = (value: number, time: number) => number | false
