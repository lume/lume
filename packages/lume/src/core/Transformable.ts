import {Mixin, MixinResult, Constructor} from 'lowclass'
import {attribute, element} from '@lume/element'
import {emits} from '@lume/eventful'
import XYZNumberValues from './XYZNumberValues.js'
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

function TransformableMixin<T extends Constructor<HTMLElement>>(Base: T) {
	const _Base = Constructor<HTMLElement>(Base)
	const Parent = Sizeable.mixin(_Base)

	// Transformable extends TreeNode (indirectly through Sizeable) because it
	// needs to be aware of its `parent` when calculating align adjustments.
	@element
	class Transformable extends Parent {
		constructor(...args: any[]) {
			super(...args)

			// TODO: Once TS lands the upcoming feature to have getters with
			// different types than setters, we can fix the ugly type casting
			// in the following constructor lines.
			// Tracking issues: https://github.com/microsoft/TypeScript/issues/2521 and https://github.com/microsoft/TypeScript/pull/42425
			// The get*() methods (f.e. getPosition()) are temporary for
			// us TypeScript users until the above issues are fixed soon, at which
			// point we can use the getters like a JavaScript user would.
			this.getPosition().on('valuechanged', () => !this._isSettingProperty && (this.position = this.position))
			this.getRotation().on('valuechanged', () => !this._isSettingProperty && (this.rotation = this.rotation))
			this.getScale().on('valuechanged', () => !this._isSettingProperty && (this.scale = this.scale))
			this.getOrigin().on('valuechanged', () => !this._isSettingProperty && (this.origin = this.origin))
			this.getAlignPoint().on(
				'valuechanged',
				() => !this._isSettingProperty && (this.alignPoint = this.alignPoint),
			)
			this.getMountPoint().on(
				'valuechanged',
				() => !this._isSettingProperty && (this.mountPoint = this.mountPoint),
			)
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
			if (!this.__position) this.__position = new XYZNumberValues(0, 0, 0)
			this._setPropertyXYZ('position', newValue)
		}
		get position(): XYZNumberValuesProperty | XYZNumberValuesPropertyFunction {
			if (!this.__position) this.__position = new XYZNumberValues(0, 0, 0)
			return this.__position
		}

		private declare __position?: XYZNumberValues

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
			if (!this.__rotation) this.__rotation = new XYZNumberValues(0, 0, 0)
			this._setPropertyXYZ('rotation', newValue)
		}
		get rotation(): XYZNumberValuesProperty | XYZNumberValuesPropertyFunction {
			if (!this.__rotation) this.__rotation = new XYZNumberValues(0, 0, 0)
			return this.__rotation
		}

		private declare __rotation?: XYZNumberValues

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
			if (!this.__scale) this.__scale = new XYZNumberValues(1, 1, 1)
			this._setPropertyXYZ('scale', newValue)
		}
		get scale(): XYZNumberValuesProperty | XYZNumberValuesPropertyFunction {
			if (!this.__scale) this.__scale = new XYZNumberValues(1, 1, 1)
			return this.__scale
		}

		private declare __scale?: XYZNumberValues

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
			if (!this.__origin) this.__origin = new XYZNumberValues(0.5, 0.5, 0.5)
			this._setPropertyXYZ('origin', newValue)
		}
		get origin(): XYZNumberValuesProperty | XYZNumberValuesPropertyFunction {
			if (!this.__origin) this.__origin = new XYZNumberValues(0.5, 0.5, 0.5)
			return this.__origin
		}

		private declare __origin?: XYZNumberValues

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
			if (!this.__alignPoint) this.__alignPoint = new XYZNumberValues(0, 0, 0)
			this._setPropertyXYZ('alignPoint', newValue)
		}
		get alignPoint(): XYZNumberValuesProperty | XYZNumberValuesPropertyFunction {
			if (!this.__alignPoint) this.__alignPoint = new XYZNumberValues(0, 0, 0)
			return this.__alignPoint
		}

		private declare __alignPoint?: XYZNumberValues

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
			if (!this.__mountPoint) this.__mountPoint = new XYZNumberValues(0, 0, 0)
			this._setPropertyXYZ('mountPoint', newValue)
		}
		get mountPoint(): XYZNumberValuesProperty | XYZNumberValuesPropertyFunction {
			if (!this.__mountPoint) this.__mountPoint = new XYZNumberValues(0, 0, 0)
			return this.__mountPoint
		}

		private declare __mountPoint?: XYZNumberValues

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
			if (this.__opacity == null) this.__opacity = 1
			this._setPropertySingle('opacity', newValue)
		}
		get opacity(): number | SinglePropertyFunction {
			if (this.__opacity == null) this.__opacity = 1
			return this.__opacity
		}

		private declare __opacity?: number

		// prettier-ignore
		getOpacity(): number { return this.opacity as number }
	}

	return Transformable as MixinResult<typeof Transformable, T>
}

export const Transformable = Mixin(TransformableMixin)
export interface Transformable extends InstanceType<typeof Transformable> {}
export default Transformable
