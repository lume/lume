import {signal} from 'classy-solid'
import {attribute, element, noSignal} from '@lume/element'
import {TreeNode} from './TreeNode.js'
import {XYZSizeModeValues} from '../xyz-values/XYZSizeModeValues.js'
import {XYZNonNegativeValues} from '../xyz-values/XYZNonNegativeValues.js'
import {CompositionTracker} from './CompositionTracker.js'
import type {XYZValuesObject} from '../xyz-values/XYZValues.js'
import {
	PropertyAnimator,
	type XYZNonNegativeNumberValuesProperty,
	type XYZNonNegativeNumberValuesPropertyFunction,
	type XYZSizeModeValuesProperty,
} from './PropertyAnimator.js'

const previousSize: Partial<XYZValuesObject<number>> = {}

export type SizeableAttributes = 'sizeMode' | 'size'

const sizeMode = new WeakMap<Sizeable, XYZSizeModeValues>()
const size = new WeakMap<Sizeable, XYZNonNegativeValues>()

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
export
@element
class Sizeable extends PropertyAnimator(CompositionTracker(TreeNode)) {
	@signal accessor #calculatedSize: XYZValuesObject<number> = {x: 0, y: 0, z: 0}

	/**
	 * @property {string | [x?: string, y?: string, z?: string] | {x?: string, y?: string, z?: string} | XYZSizeModeValues | null} sizeMode -
	 *
	 * *attribute*
	 *
	 * Default: <code>new [XYZSizeModeValues](../xyz-values/XYZSizeModeValues)('literal', 'literal', 'literal')</code>
	 *
	 * Set the size mode for each axis. Possible values are `"literal"` (or `"l"` for short) and
	 * `"proportional"` (or `"p"` for short). For example,
	 *
	 * ```html
	 * <lume-element3d size-mode="proportional literal"></lume-element3d>
	 * <lume-element3d size-mode="p l"></lume-element3d>
	 * ```
	 *
	 * The value of `.sizeMode` for a particular axis dictates how the respective
	 * [`.size`](#size) value along the same axis will behave:
	 *
	 * - A value of `"literal"` for an axis means the `.size` value along that
	 * axis will be literally as specified.
	 * - A value of `"proportional"` for an axis means the `.size`
	 * value along that axis will be a proportion of the object's parent's size
	 * along that axis.
	 */
	@attribute @noSignal set sizeMode(newValue: XYZSizeModeValuesProperty) {
		if (typeof newValue === 'function') throw new TypeError('property functions are not allowed for sizeMode')
		if (!sizeMode.has(this)) sizeMode.set(this, new XYZSizeModeValues('literal', 'literal', 'literal'))
		this._setPropertyXYZ('sizeMode', sizeMode.get(this)!, newValue)
	}
	@attribute @noSignal get sizeMode(): XYZSizeModeValues {
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
	 * Default: <code>new [XYZNonNegativeValues](../xyz-values/XYZNonNegativeValues)(0, 0, 0)</code>
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
	@attribute @noSignal set size(
		newValue: XYZNonNegativeNumberValuesProperty | XYZNonNegativeNumberValuesPropertyFunction,
	) {
		if (!size.has(this)) size.set(this, new XYZNonNegativeValues(0, 0, 0))
		this._setPropertyXYZ('size', size.get(this)!, newValue)
	}
	@attribute @noSignal get size(): XYZNonNegativeValues {
		if (!size.has(this)) size.set(this, new XYZNonNegativeValues(0, 0, 0))
		return size.get(this)!
	}

	/**
	 * @property {{x: number, y: number, z: number}} calculatedSize -
	 *
	 * *readonly*, *signal*
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
		// if (this.#sizeDirty) this._calcSize

		// TODO make it a readonly reactive object instead of cloning.
		return {...this.#calculatedSize}
	}

	get composedLumeParent(): Sizeable | null {
		const result = this.composedParent
		if (!(result instanceof Sizeable)) return null
		return result
	}

	get composedLumeChildren(): Sizeable[] {
		return super._composedChildren as Sizeable[]
	}

	/**
	 * @property {{x: number, y: number, z: number}} parentSize
	 *
	 * *signal* *readonly*
	 *
	 * Returns an object with `x`, `y`, and `z` properties containing the size
	 * dimensions of the composed LUME parent. If there is no composed LUME
	 * parent, the size is 0,0,0.
	 */
	get parentSize() {
		return this.composedLumeParent?.calculatedSize ?? {x: 0, y: 0, z: 0}
	}

	_calcSize() {
		const calculatedSize = this.#calculatedSize

		Object.assign(previousSize, calculatedSize)

		const size = this.size
		const sizeMode = this.sizeMode
		const {x: modeX, y: modeY, z: modeZ} = sizeMode
		const parentSize = this.parentSize

		if (modeX === 'literal' || modeX === 'l') {
			calculatedSize.x = size.x
		} else if (modeX === 'proportional' || modeX === 'p') {
			calculatedSize.x = parentSize.x * size.x
		}

		if (modeY === 'literal' || modeY === 'l') {
			calculatedSize.y = size.y
		} else if (modeY === 'proportional' || modeY === 'p') {
			calculatedSize.y = parentSize.y * size.y
		}

		if (modeZ === 'literal' || modeZ === 'l') {
			calculatedSize.z = size.z
		} else if (modeZ === 'proportional' || modeZ === 'p') {
			calculatedSize.z = parentSize.z * size.z
		}

		// We set it to the same value to trigger reactivity.
		this.#calculatedSize = calculatedSize

		if (
			previousSize.x !== calculatedSize.x ||
			previousSize.y !== calculatedSize.y ||
			previousSize.z !== calculatedSize.z
		) {
			// TODO replace events with reactivity
			this.emit('sizechange', {...calculatedSize})
		}
	}
}
