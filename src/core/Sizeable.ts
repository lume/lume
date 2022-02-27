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

// No decorators for private fields (yet), so we implement reactivity manually
// by having a WeakMap-based private value for each instance.
const calculatedSize = new WeakMap<Sizeable, Variable<XYZValuesObject<number>>>()

/**
 * @class Sizeable - Provides features for defining the size volume of an object in 3D space.
 *
 * The properties of `Sizeable` all follow a common usage pattern,
 * described in the [`Common Attributes`](../../guide/common-attributes) doc.
 *
 * @extends TreeNode
 */
// Sizeable and its subclass Transformable extend from TreeNode because they know
// about their `parent` when calculating proportional sizes or world matrices
// based on parent values.
@element
export class Sizeable extends TreeNode {
	// TODO handle ctor arg types
	constructor() {
		super()

		calculatedSize.set(this, variable({x: 0, y: 0, z: 0}))

		this.sizeMode.on('valuechanged', () => !this._isSettingProperty && (this.sizeMode = this.sizeMode))
		this.size.on('valuechanged', () => !this._isSettingProperty && (this.size = this.size))
	}

	/**
	 * @property {string | [x?: string, y?: string, z?: string] | {x?: string, y?: string, z?: string} | XYZSizeModeValues | null} sizeMode -
	 *
	 * *attribute*
	 *
	 * Default: <code>new <a href="../xyz-values/XYZSizeModeValues">XYZSizeModeValues</a>('literal', 'literal', 'literal')</code>
	 *
	 * Set the size mode for each axis. Possible values are `"literal"` and
	 * `"proportional"`. For example,
	 *
	 * ```html
	 * <lume-node size-mode="proportional literal"></lume-node>
	 * ```
	 *
	 * The `.sizeMode` for a particular axis dictates how the respective
	 * [`.size`](#size) value along the same axis will behave. A value of
	 * `"literal"` for an axis means the `.size` value along the same axis will
	 * be a literally as specified. A `.sizeMode` value of `"proportional"`
	 * for the an axis means the `.size` value along the same axis will be a
	 * proportion of the object's parent's size along the same axis.
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

	// TODO: A "differential" size would be cool. Good for padding,
	// borders, etc. Inspired from Famous' differential sizing.
	//
	// TODO: A "target" size where sizing can be relative to another node.
	// This would be tricky though, because there could be circular size
	// dependencies. Maybe we'd throw an error in that case, because there'd be no original size to base off of.

	/**
	 * @property {string | [x?: number, y?: number, z?: number] | {x?: number, y?: number, z?: number} | XYZNonNegativeValues | null} size -
	 *
	 * *attribute*
	 *
	 * Default: <code>new <a href="../xyz-values/XYZNonNegativeValues">XYZNonNegativeValues</a>(0, 0, 0)</code>
	 *
	 * Set the size of the object along each axis. The meaning of a size value for a particular axis depends on the
	 * [`.sizeMode`](#sizemode) value for the same axis.
	 *
	 * All size values must be positive numbers or an error is thrown.
	 *
	 * Literal sizes can be any positive value (the literal size that you want).
	 * Proportional size along an axis represents a proportion of the parent
	 * size on the same axis. `0` means 0% of the parent size, and `1.0` means
	 * 100% of the parent size.
	 *
	 * For example, if `.sizeMode` is set to `el.sizeMode = ['literal',
	 * 'proportional', 'literal']`, then setting `el.size = [20, 0.5, 30]` means
	 * the X size is a literal value of `20`, the Y size is 50% of the parent Y
	 * size, and the Z size is a literal value of `30`. It is easy this way to
	 * mix literal and proportional sizes for the different axes.
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

	/**
	 * @property {{x: number, y: number, z: number}} calculatedSize -
	 *
	 * *readonly*, *reactive*
	 *
	 * Get the actual size of an element as an object with `x`, `y`, and `z`
	 * properties, each property containing the computed size along its
	 * respective axis.
	 *
	 * This can be useful when size is proportional, as the actual size of the
	 * an element will depend on the size of its parent, and otherwise looking
	 * at the `.size` value won't tell us the actual size.
	 */
	get calculatedSize() {
		// TODO we can re-calculate the actual size lazily, this way it can
		// normally be deferred to a Motor render task, unless a user
		// explicitly needs it and reads the value.
		// if (this.__sizeDirty) this._calcSize

		// TODO make it a readonly reactive object instead of cloning.
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

	get composedLumeParent(): Sizeable | null {
		const result = super._composedParent
		if (!(result instanceof Sizeable)) return null
		return result
	}

	get composedLumeChildren(): Sizeable[] {
		return super._composedChildren as Sizeable[]
	}

	_getParentSize() {
		return (this.composedLumeParent && calculatedSize.get(this.composedLumeParent)?.get()) ?? {x: 0, y: 0, z: 0}
	}

	_calcSize() {
		const _calculatedSize = calculatedSize.get(this)!.get()

		Object.assign(previousSize, _calculatedSize)

		const size = this.size
		const sizeMode = this.sizeMode
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
			untrack(() => xyz.from(newValue))
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
			untrack(() => setter(newValue as any)) // FIXME no any
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
	deltaTime: number,
) => XYZValuesPropertyType | false

export type XYZNumberValuesPropertyFunction = XYZValuesPropertyFunction<XYZNumberValuesProperty, number>
export type XYZNonNegativeNumberValuesPropertyFunction = XYZValuesPropertyFunction<
	XYZNonNegativeNumberValuesProperty,
	number
>

export type SinglePropertyFunction = (value: number, time: number) => number | false
