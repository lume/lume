import {Mixin, MixinResult, Constructor} from 'lowclass'
import {Object3D} from 'three'
import {attribute, reactive, autorun} from '@lume/element'
import {emits} from '@lume/eventful'
import '../lib/three/make-global'
import XYZNumberValues from './XYZNumberValues'
import Sizeable from './Sizeable'
import {toRadians} from './Utility'
import {XYZPartialValuesArray, XYZPartialValuesObject} from './XYZValues'

// TODO, this module augmentation doesn't work as prescribed in
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
// declare module 'three' {
//     interface Object3D {
//         pivot: Vector3
//     }
// }

// This patches Object3D to have a `.pivot` property of type THREE.Vector3 that
// allows the origin (pivot) of rotation and scale to be specified in local
// coordinate space. For more info:
// https://github.com/mrdoob/three.js/issues/15965
Object3D.prototype.updateMatrix = function () {
	this.matrix.compose(this.position, this.quaternion, this.scale)

	var pivot = (this as any).pivot

	if (pivot && (pivot.x !== 0 || pivot.y !== 0 || pivot.z !== 0)) {
		var px = pivot.x,
			py = pivot.y,
			pz = pivot.z
		var te = this.matrix.elements

		te[12] += px - te[0] * px - te[4] * py - te[8] * pz
		te[13] += py - te[1] * px - te[5] * py - te[9] * pz
		te[14] += pz - te[2] * px - te[6] * py - te[10] * pz
	}

	this.matrixWorldNeedsUpdate = true
}

const threeJsPostAdjustment = [0, 0, 0]
const alignAdjustment = [0, 0, 0]
const mountPointAdjustment = [0, 0, 0]
const appliedPosition = [0, 0, 0]

function TransformableMixin<T extends Constructor>(Base: T) {
	const _Base = Constructor(Base)
	const Parent = Sizeable.mixin(_Base)

	// Transformable extends TreeNode (indirectly through Sizeable) because it
	// needs to be aware of its `parent` when calculating align adjustments.
	@reactive
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

		// @ts-ignore
		private __position = new XYZNumberValues(0, 0, 0).from(this.__position ?? undefined)

		/**
		 * Set the position of the Transformable.
		 *
		 * @param {Object} newValue
		 * @param {number} [newValue.x] The x-axis position to apply.
		 * @param {number} [newValue.y] The y-axis position to apply.
		 * @param {number} [newValue.z] The z-axis position to apply.
		 */
		@reactive
		@attribute
		@emits('propertychange')
		set position(newValue) {
			this._setPropertyXYZ('position', newValue)
		}
		get position() {
			return this.__position
		}

		private __rotation = new XYZNumberValues(0, 0, 0)

		/**
		 * @param {Object} newValue
		 * @param {number} [newValue.x] The x-axis rotation to apply.
		 * @param {number} [newValue.y] The y-axis rotation to apply.
		 * @param {number} [newValue.z] The z-axis rotation to apply.
		 */
		@reactive
		@attribute
		@emits('propertychange')
		set rotation(newValue) {
			this._setPropertyXYZ('rotation', newValue)
		}
		get rotation() {
			return this.__rotation
		}

		private __scale = new XYZNumberValues(1, 1, 1)

		/**
		 * @param {Object} newValue
		 * @param {number} [newValue.x] The x-axis scale to apply.
		 * @param {number} [newValue.y] The y-axis scale to apply.
		 * @param {number} [newValue.z] The z-axis scale to apply.
		 */
		@reactive
		@attribute
		@emits('propertychange')
		set scale(newValue) {
			this._setPropertyXYZ('scale', newValue)
		}
		get scale() {
			return this.__scale
		}

		private __origin = new XYZNumberValues(0.5, 0.5, 0.5)

		/**
		 * @param {Object} newValue
		 * @param {number} [newValue.x] The x-axis origin to apply.
		 * @param {number} [newValue.y] The y-axis origin to apply.
		 * @param {number} [newValue.z] The z-axis origin to apply.
		 */
		@reactive
		@attribute
		@emits('propertychange')
		set origin(newValue) {
			this._setPropertyXYZ('origin', newValue)
		}
		get origin() {
			return this.__origin
		}

		private __align = new XYZNumberValues(0, 0, 0)

		/**
		 * Set the alignment of the Node. This determines at which point in this
		 * Node's parent that this Node is mounted.
		 *
		 * @param {Object} newValue
		 * @param {number} [newValue.x] The x-axis align to apply.
		 * @param {number} [newValue.y] The y-axis align to apply.
		 * @param {number} [newValue.z] The z-axis align to apply.
		 */
		@reactive
		@attribute
		@emits('propertychange')
		set align(newValue) {
			this._setPropertyXYZ('align', newValue)
		}
		get align() {
			return this.__align
		}

		private __mountPoint = new XYZNumberValues(0, 0, 0)

		/**
		 * Set the mount point of the Node.
		 *
		 * @param {Object} newValue
		 * @param {number} [newValue.x] The x-axis mountPoint to apply.
		 * @param {number} [newValue.y] The y-axis mountPoint to apply.
		 * @param {number} [newValue.z] The z-axis mountPoint to apply.
		 */
		@reactive
		@attribute
		@emits('propertychange')
		set mountPoint(newValue) {
			this._setPropertyXYZ('mountPoint', newValue)
		}
		get mountPoint() {
			return this.__mountPoint
		}

		private __opacity = 1

		/**
		 * Set this Node's opacity.
		 *
		 * @param {number} opacity A floating point number clamped between 0 and
		 * 1 (inclusive). 0 is fully transparent, 1 is fully opaque.
		 */
		@reactive
		@attribute
		@emits('propertychange')
		set opacity(newValue) {
			this._setPropertySingle('opacity', newValue)
		}
		get opacity() {
			return this.__opacity
		}

		connectedCallback() {
			super.connectedCallback()

			this._stopFns.push(
				autorun(() => {
					this.rotation
					this._updateRotation()
				}),
				autorun(() => {
					this.scale
					this._updateScale()
				}),
				// position is handled _calculateMatrix
			)
		}

		/** This is called by Motor on each update before the GL or CSS renderers will re-render. */
		// TODO rename "render" to "update". "render" is more for the renderer classes.
		protected _render(_timestamp: number): void {
			// super._render && super._render()

			// TODO: only run this when necessary (f.e. not if only opacity
			// changed, only if position/align/mountPoint changed, etc)
			this._calculateMatrix()
		}

		// TODO These are from ImerativeBase. Transformable shouldn't know about
		// Three.js objects. Maybe Three-specific stuff belongs somewhere else?
		// Not sure where though.
		three!: Object3D
		threeCSS!: Object3D

		protected _updateRotation(): void {
			// Currently rotation is left-handed as far as values inputted into
			// the LUME APIs. This method converts them to Three's right-handed
			// system.

			// TODO Make an option to use left-handed or right-handed rotation,
			// where right-handed will match with Three.js transforms, while
			// left-handed matches with CSS transforms (but in the latter case
			// using Three.js APIs will not match the same paradigm because the
			// option changes only the LUME API).

			// TODO Make the rotation unit configurable (f.e. use degrees or
			// radians)

			// TODO Make the handedness configurable (f.e. left handed or right
			// handed rotation)

			this.three.rotation.set(
				-toRadians(this.rotation.x),
				// We don't negate Y rotation here, but we negate Y translation
				// in _calculateMatrix so that it has the same effect.
				toRadians(this.rotation.y),
				-toRadians(this.rotation.z),
			)

			// TODO Besides that Transformable shouldn't know about Three.js
			// objects, it should also not know about Scene. The isScene check
			// prevents us from having to import Scene (avoiding a circular
			// dependency).
			const childOfScene = (this.parent as any)?.isScene

			// TODO write a comment as to why we needed the childOfScne check to
			// alternate rotation directions here. It's been a while, I forgot
			// why. I should've left a comment when I wrote this!
			this.threeCSS.rotation.set(
				(childOfScene ? -1 : 1) * toRadians(this.rotation.x),
				toRadians(this.rotation.y),
				(childOfScene ? -1 : 1) * toRadians(this.rotation.z),
			)
		}

		protected _updateScale(): void {
			this.three.scale.set(this.scale.x, this.scale.y, this.scale.z)

			this.threeCSS.scale.set(this.scale.x, this.scale.y, this.scale.z)
		}

		/**
		 * Takes all the current component values (position, rotation, etc) and
		 * calculates a transformation DOMMatrix from them. See "W3C Geometry
		 * Interfaces" to learn about DOMMatrix.
		 *
		 * @method
		 * @private
		 * @memberOf Node
		 *
		 * TODO #66: make sure this is called after size calculations when we
		 * move _calcSize to a render task.
		 */
		protected _calculateMatrix(): void {
			const {__align: align, __mountPoint: mountPoint, __position: position, __origin: origin} = this
			const size = this.calculatedSize

			// THREE-COORDS-TO-DOM-COORDS
			// translate the "mount point" back to the top/left/back of the object
			// (in Three.js it is in the center of the object).
			threeJsPostAdjustment[0] = size.x / 2
			threeJsPostAdjustment[1] = size.y / 2
			threeJsPostAdjustment[2] = size.z / 2

			// TODO If a Scene has a `parent`, it is not mounted directly into a
			// regular DOM element but rather it is child of a Node. In this
			// case we don't want the scene size to be based on observed size
			// of a regular DOM element, but relative to a parent Node just
			// like for all other Nodes.
			const parentSize = this._getParentSize()

			// THREE-COORDS-TO-DOM-COORDS
			// translate the "align" back to the top/left/back of the parent element.
			// We offset this in ElementOperations#applyTransform. The Y
			// value is inverted because we invert it below.
			threeJsPostAdjustment[0] += -parentSize.x / 2
			threeJsPostAdjustment[1] += -parentSize.y / 2
			threeJsPostAdjustment[2] += -parentSize.z / 2

			alignAdjustment[0] = parentSize.x * align.x
			alignAdjustment[1] = parentSize.y * align.y
			alignAdjustment[2] = parentSize.z * align.z

			mountPointAdjustment[0] = size.x * mountPoint.x
			mountPointAdjustment[1] = size.y * mountPoint.y
			mountPointAdjustment[2] = size.z * mountPoint.z

			appliedPosition[0] = position.x + alignAdjustment[0] - mountPointAdjustment[0]
			appliedPosition[1] = position.y + alignAdjustment[1] - mountPointAdjustment[1]
			appliedPosition[2] = position.z + alignAdjustment[2] - mountPointAdjustment[2]

			// NOTE We negate Y translation in several places below so that Y
			// goes downward like in DOM's CSS transforms.

			// TODO Make an option that configures whether Y goes up or down.

			this.three.position.set(
				appliedPosition[0] + threeJsPostAdjustment[0],
				// THREE-COORDS-TO-DOM-COORDS negate the Y value so that
				// Three.js' positive Y is downward like DOM.
				-(appliedPosition[1] + threeJsPostAdjustment[1]),
				appliedPosition[2] + threeJsPostAdjustment[2],
			)

			// TODO Besides that Transformable shouldn't know about Three.js
			// objects, it should also not know about Scene.
			const childOfScene = this.threeCSS.parent && this.threeCSS.parent.type === 'Scene'

			// FIXME we shouldn't need this conditional check. See the next XXX.
			if (childOfScene) {
				this.threeCSS.position.set(
					appliedPosition[0] + threeJsPostAdjustment[0],
					// THREE-COORDS-TO-DOM-COORDS negate the Y value so that
					// Three.js' positive Y is downward like DOM.
					-(appliedPosition[1] + threeJsPostAdjustment[1]),
					appliedPosition[2] + threeJsPostAdjustment[2],
				)
			} else {
				// XXX CSS objects that aren't direct child of a scene are
				// already centered on X and Y (not sure why, but maybe
				// CSS3DObjectNested has clues, which is based on
				// THREE.CSS3DObject)
				this.threeCSS.position.set(
					appliedPosition[0],
					-appliedPosition[1],
					appliedPosition[2] + threeJsPostAdjustment[2], // only apply Z offset
				)
			}

			if (origin.x !== 0.5 || origin.y !== 0.5 || origin.z !== 0.5) {
				// Here we multiply by size to convert from a ratio to a range
				// of units, then subtract half because Three.js origin is
				// centered around (0,0,0) meaning Three.js origin goes from
				// -0.5 to 0.5 instead of from 0 to 1.

				;(this.three as any).pivot.set(
					origin.x * size.x - size.x / 2,
					// THREE-COORDS-TO-DOM-COORDS negate the Y value so that
					// positive Y means down instead of up (because Three,js Y
					// values go up).
					-(origin.y * size.y - size.y / 2),
					origin.z * size.z - size.z / 2,
				)
				;(this.threeCSS as any).pivot.set(
					origin.x * size.x - size.x / 2,
					// THREE-COORDS-TO-DOM-COORDS negate the Y value so that
					// positive Y means down instead of up (because Three,js Y
					// values go up).
					-(origin.y * size.y - size.y / 2),
					origin.z * size.z - size.z / 2,
				)
			}
			// otherwise, use default Three.js origin of (0,0,0) which is
			// equivalent to our (0.5,0.5,0.5), by removing the pivot value.
			else {
				;(this.three as any).pivot.set(0, 0, 0)
				;(this.threeCSS as any).pivot.set(0, 0, 0)
			}

			this.three.updateMatrix()
			this.threeCSS.updateMatrix()
		}

		protected _calculateWorldMatricesInSubtree(): void {
			this.three.updateMatrixWorld()
			this.threeCSS.updateMatrixWorld()
			this.emit('worldMatrixUpdate')
		}
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
