import {attribute, element} from '@lume/element'
import {emits} from '@lume/eventful'
import {XYZNumberValues} from './XYZNumberValues.js'
import {SinglePropertyFunction, Sizeable, XYZNumberValuesProperty, XYZNumberValuesPropertyFunction} from './Sizeable.js'

import type {SizeableAttributes} from './Sizeable.js'

export type TransformableAttributes =
	| SizeableAttributes
	| 'position'
	| 'rotation'
	| 'scale'
	| 'origin'
	| 'alignPoint'
	| 'mountPoint'
	| 'opacity'

const position = new WeakMap<Transformable, XYZNumberValues>()
const rotation = new WeakMap<Transformable, XYZNumberValues>()
const scale = new WeakMap<Transformable, XYZNumberValues>()
const origin = new WeakMap<Transformable, XYZNumberValues>()
const alignPoint = new WeakMap<Transformable, XYZNumberValues>()
const mountPoint = new WeakMap<Transformable, XYZNumberValues>()
const opacity = new WeakMap<Transformable, number>()

// Transformable extends TreeNode (indirectly through Sizeable) because it
// needs to be aware of its `parent` when calculating align adjustments.
@element
export class Transformable extends Sizeable {
	constructor() {
		super()

		this.position.on('valuechanged', () => !this._isSettingProperty && (this.position = this.position))
		this.rotation.on('valuechanged', () => !this._isSettingProperty && (this.rotation = this.rotation))
		this.scale.on('valuechanged', () => !this._isSettingProperty && (this.scale = this.scale))
		this.origin.on('valuechanged', () => !this._isSettingProperty && (this.origin = this.origin))
		this.alignPoint.on('valuechanged', () => !this._isSettingProperty && (this.alignPoint = this.alignPoint))
		this.mountPoint.on('valuechanged', () => !this._isSettingProperty && (this.mountPoint = this.mountPoint))
	}

	/**
	 * Set the position of the Transformable.
	 *
	 * @param {Object} newValue
	 * @param {number} [newValue.x] The x-axis position to apply.
	 * @param {number} [newValue.y] The y-axis position to apply.
	 * @param {number} [newValue.z] The z-axis position to apply.
	 */
	@attribute
	@emits('propertychange')
	set position(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction) {
		if (!position.has(this)) position.set(this, new XYZNumberValues(0, 0, 0))
		this._setPropertyXYZ('position', position.get(this)!, newValue)
	}
	get position(): XYZNumberValues {
		if (!position.has(this)) position.set(this, new XYZNumberValues(0, 0, 0))
		return position.get(this)!
	}

	// prettier-ignore
	getPosition(): XYZNumberValues { return this.position as XYZNumberValues }

	/**
	 * @param {Object} newValue
	 * @param {number} [newValue.x] The x-axis rotation to apply.
	 * @param {number} [newValue.y] The y-axis rotation to apply.
	 * @param {number} [newValue.z] The z-axis rotation to apply.
	 */
	@attribute
	@emits('propertychange')
	set rotation(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction) {
		if (!rotation.has(this)) rotation.set(this, new XYZNumberValues(0, 0, 0))
		this._setPropertyXYZ('rotation', rotation.get(this)!, newValue)
	}
	get rotation(): XYZNumberValues {
		if (!rotation.has(this)) rotation.set(this, new XYZNumberValues(0, 0, 0))
		return rotation.get(this)!
	}

	// prettier-ignore
	getRotation(): XYZNumberValues { return this.rotation as XYZNumberValues }

	/**
	 * @param {Object} newValue
	 * @param {number} [newValue.x] The x-axis scale to apply.
	 * @param {number} [newValue.y] The y-axis scale to apply.
	 * @param {number} [newValue.z] The z-axis scale to apply.
	 */
	@attribute
	@emits('propertychange')
	set scale(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction) {
		if (!scale.has(this)) scale.set(this, new XYZNumberValues(1, 1, 1))
		this._setPropertyXYZ('scale', scale.get(this)!, newValue)
	}
	get scale(): XYZNumberValues {
		if (!scale.has(this)) scale.set(this, new XYZNumberValues(1, 1, 1))
		return scale.get(this)!
	}

	// prettier-ignore
	getScale(): XYZNumberValues { return this.scale as XYZNumberValues }

	/**
	 * @param {Object} newValue
	 * @param {number} [newValue.x] The x-axis origin to apply.
	 * @param {number} [newValue.y] The y-axis origin to apply.
	 * @param {number} [newValue.z] The z-axis origin to apply.
	 */
	@attribute
	@emits('propertychange')
	set origin(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction) {
		if (!origin.has(this)) origin.set(this, new XYZNumberValues(0.5, 0.5, 0.5))
		this._setPropertyXYZ('origin', origin.get(this)!, newValue)
	}
	get origin(): XYZNumberValues {
		if (!origin.has(this)) origin.set(this, new XYZNumberValues(0.5, 0.5, 0.5))
		return origin.get(this)!
	}

	// prettier-ignore
	getOrigin(): XYZNumberValues { return this.origin as XYZNumberValues }

	/**
	 * Set the alignment of the Node. This determines at which point in this
	 * Node's parent that this Node is mounted.
	 *
	 * @param {Object} newValue
	 * @param {number} [newValue.x] The x-axis align to apply.
	 * @param {number} [newValue.y] The y-axis align to apply.
	 * @param {number} [newValue.z] The z-axis align to apply.
	 */
	@attribute
	@emits('propertychange')
	set alignPoint(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction) {
		if (!alignPoint.has(this)) alignPoint.set(this, new XYZNumberValues(0, 0, 0))
		this._setPropertyXYZ('alignPoint', alignPoint.get(this)!, newValue)
	}
	get alignPoint(): XYZNumberValues {
		if (!alignPoint.has(this)) alignPoint.set(this, new XYZNumberValues(0, 0, 0))
		return alignPoint.get(this)!
	}

	// prettier-ignore
	getAlignPoint(): XYZNumberValues { return this.alignPoint as XYZNumberValues }

	/**
	 * Set the mount point of the Node.
	 *
	 * @param {Object} newValue
	 * @param {number} [newValue.x] The x-axis mountPoint to apply.
	 * @param {number} [newValue.y] The y-axis mountPoint to apply.
	 * @param {number} [newValue.z] The z-axis mountPoint to apply.
	 */
	@attribute
	@emits('propertychange')
	set mountPoint(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction) {
		if (!mountPoint.has(this)) mountPoint.set(this, new XYZNumberValues(0, 0, 0))
		this._setPropertyXYZ('mountPoint', mountPoint.get(this)!, newValue)
	}
	get mountPoint(): XYZNumberValues {
		if (!mountPoint.has(this)) mountPoint.set(this, new XYZNumberValues(0, 0, 0))
		return mountPoint.get(this)!
	}

	// prettier-ignore
	getMountPoint(): XYZNumberValues { return this.mountPoint as XYZNumberValues }

	/**
	 * Set this Node's opacity.
	 *
	 * @param {number} opacity A floating point number clamped between 0 and
	 * 1 (inclusive). 0 is fully transparent, 1 is fully opaque.
	 */
	// TODO opacity doesn't belong in Transformable
	@attribute
	@emits('propertychange')
	set opacity(newValue: number | SinglePropertyFunction) {
		if (!opacity.has(this)) opacity.set(this, 1)
		this._setPropertySingle('opacity', v => opacity.set(this, v), newValue)
	}
	get opacity(): number {
		if (!opacity.has(this)) opacity.set(this, 1)
		return opacity.get(this)!
	}

	// prettier-ignore
	getOpacity(): number { return this.opacity as number }
}
