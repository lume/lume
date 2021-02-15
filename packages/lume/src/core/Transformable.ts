import {Mixin, MixinResult, Constructor} from 'lowclass'
import {attribute, element} from '@lume/element'
import {emits} from '@lume/eventful'
import XYZNumberValues from './XYZNumberValues'
import Sizeable from './Sizeable'

import type {XYZPartialValuesArray, XYZPartialValuesObject} from './XYZValues'

function TransformableMixin<T extends Constructor<HTMLElement>>(Base: T) {
	const _Base = Constructor<HTMLElement>(Base)
	const Parent = Sizeable.mixin(_Base)

	// Transformable extends TreeNode (indirectly through Sizeable) because it
	// needs to be aware of its `parent` when calculating align adjustments.
	@element
	class Transformable extends Parent {
		constructor(...args: any[]) {
			super(...args)

			this.position.on('valuechanged', () => !this._isSettingProperty && (this.position = this.position))
			this.rotation.on('valuechanged', () => !this._isSettingProperty && (this.rotation = this.rotation))
			this.scale.on('valuechanged', () => !this._isSettingProperty && (this.scale = this.scale))
			this.origin.on('valuechanged', () => !this._isSettingProperty && (this.origin = this.origin))
			this.align.on('valuechanged', () => !this._isSettingProperty && (this.align = this.align))
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
		set position(newValue) {
			if (!this.__position) this.__position = new XYZNumberValues(0, 0, 0)
			this._setPropertyXYZ('position', newValue)
		}
		get position() {
			if (!this.__position) this.__position = new XYZNumberValues(0, 0, 0)
			return this.__position
		}

		private declare __position?: XYZNumberValues

		/**
		 * @param {Object} newValue
		 * @param {number} [newValue.x] The x-axis rotation to apply.
		 * @param {number} [newValue.y] The y-axis rotation to apply.
		 * @param {number} [newValue.z] The z-axis rotation to apply.
		 */
		@attribute
		@emits('propertychange')
		set rotation(newValue) {
			if (!this.__rotation) this.__rotation = new XYZNumberValues(0, 0, 0)
			this._setPropertyXYZ('rotation', newValue)
		}
		get rotation() {
			if (!this.__rotation) this.__rotation = new XYZNumberValues(0, 0, 0)
			return this.__rotation
		}

		private declare __rotation?: XYZNumberValues

		/**
		 * @param {Object} newValue
		 * @param {number} [newValue.x] The x-axis scale to apply.
		 * @param {number} [newValue.y] The y-axis scale to apply.
		 * @param {number} [newValue.z] The z-axis scale to apply.
		 */
		@attribute
		@emits('propertychange')
		set scale(newValue) {
			if (!this.__scale) this.__scale = new XYZNumberValues(1, 1, 1)
			this._setPropertyXYZ('scale', newValue)
		}
		get scale() {
			if (!this.__scale) this.__scale = new XYZNumberValues(1, 1, 1)
			return this.__scale
		}

		private declare __scale?: XYZNumberValues

		/**
		 * @param {Object} newValue
		 * @param {number} [newValue.x] The x-axis origin to apply.
		 * @param {number} [newValue.y] The y-axis origin to apply.
		 * @param {number} [newValue.z] The z-axis origin to apply.
		 */
		@attribute
		@emits('propertychange')
		set origin(newValue) {
			if (!this.__origin) this.__origin = new XYZNumberValues(0.5, 0.5, 0.5)
			this._setPropertyXYZ('origin', newValue)
		}
		get origin() {
			if (!this.__origin) this.__origin = new XYZNumberValues(0.5, 0.5, 0.5)
			return this.__origin
		}

		private declare __origin?: XYZNumberValues

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
		set align(newValue) {
			if (!this.__align) this.__align = new XYZNumberValues(0, 0, 0)
			this._setPropertyXYZ('align', newValue)
		}
		get align() {
			if (!this.__align) this.__align = new XYZNumberValues(0, 0, 0)
			return this.__align
		}

		private declare __align?: XYZNumberValues

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
		set mountPoint(newValue) {
			if (!this.__mountPoint) this.__mountPoint = new XYZNumberValues(0, 0, 0)
			this._setPropertyXYZ('mountPoint', newValue)
		}
		get mountPoint() {
			if (!this.__mountPoint) this.__mountPoint = new XYZNumberValues(0, 0, 0)
			return this.__mountPoint
		}

		private declare __mountPoint?: XYZNumberValues

		/**
		 * Set this Node's opacity.
		 *
		 * @param {number} opacity A floating point number clamped between 0 and
		 * 1 (inclusive). 0 is fully transparent, 1 is fully opaque.
		 */
		@attribute
		@emits('propertychange')
		set opacity(newValue) {
			if (this.__opacity == null) this.__opacity = 1
			this._setPropertySingle('opacity', newValue)
		}
		get opacity() {
			if (this.__opacity == null) this.__opacity = 1
			return this.__opacity
		}

		private declare __opacity?: number
	}

	return Transformable as MixinResult<typeof Transformable, T>
}

export const Transformable = Mixin(TransformableMixin)
export interface Transformable extends InstanceType<typeof Transformable> {}
export default Transformable

// position
// rotation
// scale
// origin
// align
// mountPoint

export type NumberValues = XYZNumberValues | XYZPartialValuesArray<number> | XYZPartialValuesObject<number> | string

export type Position = NumberValues
export type Rotation = NumberValues
export type Scale = NumberValues
export type Origin = NumberValues
export type Align = NumberValues
export type MountPoint = NumberValues

export function position(val: Position) {
	return val as XYZNumberValues
}

export function rotation(val: Rotation) {
	return val as XYZNumberValues
}

export function scale(val: Origin) {
	return val as XYZNumberValues
}

export function origin(val: Origin) {
	return val as XYZNumberValues
}

export function align(val: Align) {
	return val as XYZNumberValues
}

export function mountPoint(val: MountPoint) {
	return val as XYZNumberValues
}
