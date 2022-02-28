import {attribute, element} from '@lume/element'
import {emits} from '@lume/eventful'
import {XYZNumberValues} from '../xyz-values/XYZNumberValues.js'
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

/**
 * @class Transformable - A class containing transform-related features for all
 * `Node` and `Scene` elements: rotation, position, scale, mount-point,
 * align-point, and origin. Note that Transforms have no effect on Scene
 * elements, but Scenes still use the features from Sizeable (the base class of
 * Transformable) for sizing.
 *
 * The properties of `Transformable` all follow a common usage pattern,
 * described in the [`Common Attributes`](../../guide/common-attributes) doc.
 *
 * @extends Sizeable
 */
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

	// TODO readem's JSDoc parser can not handle the following type if it is
	// split onto multiple lines.

	/**
	 * @property {string | [x?: number, y?: number, z?: number] | {x?: number, y?: number, z?: number} | XYZNumberValues | null} position -
	 *
	 * *attribute*
	 *
	 * Default: <code>new [XYZNumberValues](../xyz-values/XYZNumberValues)(0, 0, 0)</code>
	 *
	 * Set the position of the object in 3D space, relative to its
	 * parent, by specifying X, Y, and Z coordinates.
	 */
	// TODO evalute being able to set reactive arrays or objects and
	// re-rendering based on updates to those arrays.
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

	/**
	 * @property {string | [x?: number, y?: number, z?: number] | {x?: number, y?: number, z?: number} | XYZNumberValues | null} rotation -
	 *
	 * *attribute*
	 *
	 * Default: <code>new [XYZNumberValues](../xyz-values/XYZNumberValues)(0, 0, 0)</code>
	 *
	 * Set the orientation of the object in 3D space, relative to its
	 * parent, by specifying rotation in degrees around the X, Y, and Z axes.
	 * Rotation direction is left-handed, meaning that if you point your thumb
	 * along the positive direction of an axis, your other four fingers wrap
	 * around that axis in the direction of positive rotation. A value of `[0,
	 * 30, 0]` will rotate the object 30 degrees around the Y axis. The rotation
	 * order is X, Y, Z, meaning that an X rotation rotates the object's Y and Z
	 * axes, and a Y rotation rotates the object's Z axis.
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

	/**
	 * @property {string | [x?: number, y?: number, z?: number] | {x?: number, y?: number, z?: number} | XYZNumberValues | null} scale -
	 *
	 * *attribute*
	 *
	 * Default: <code>new [XYZNumberValues](../xyz-values/XYZNumberValues)(1, 1, 1)</code>
	 *
	 * Set the scale of the object in 3D space, relative to its parent,
	 * by specifying scale along the X, Y, and Z axes.
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

	/**
	 * @property {string | [x?: number, y?: number, z?: number] | {x?: number, y?: number, z?: number} | XYZNumberValues | null} origin -
	 *
	 * *attribute*
	 *
	 * Default: <code>new [XYZNumberValues](../xyz-values/XYZNumberValues)(0, 0, 0)</code>
	 *
	 * Set the rotational origin of the object in 3D space, relative to
	 * itself, by specifying origin along the X, Y, and Z axes.
	 *
	 * The origin is the point within the object's [`size`](./Sizeable#size)
	 * space about which it rotates when a [`rotation`](#rotation) is specified.
	 * No matter what rotation the object has, this point does not move.
	 *
	 * The value for each axis is a portion of the object's size on the same
	 * axis. For example, a value of `0 0 0` places the origin at top/left/rear
	 * corner of the object's size space, a value of `0.5 0.5 0.5` places the
	 * origin in the center of the object's size space, and a value of `1 1 1`
	 * places the origin at the bottom/right/front of the object's size space.
	 *
	 * This example shows different values of origin. The pink dots are placed
	 * at each origin point on each cube. All cubes are initially oriented the
	 * same, but as you move the sliders, each cube rotates around their
	 * specific origin.
	 *
	 * <div id="originExample"></div>
	 * <script type="application/javascript">
	 *   new Vue({
	 *     el: '#originExample',
	 *     template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
	 *     data: { code: originExample },
	 *   })
	 * </script>
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

	/**
	 * @property {string | [x?: number, y?: number, z?: number] | {x?: number, y?: number, z?: number} | XYZNumberValues | null} alignPoint -
	 *
	 * *attribute*
	 *
	 * Default: <code>new [XYZNumberValues](../xyz-values/XYZNumberValues)(0, 0, 0)</code>
	 *
	 * Set the align point of the object in 3D space, relative to its
	 * parent, by specifying values along the X, Y, and Z axes.
	 *
	 * The align point is the point within the object's parent's
	 * [`size`](./Sizeable#size) space at which the object's position is 0,0,0.
	 *
	 * The value for each axis is a portion of the object's parent size on the
	 * same axis. For example, a value of `0 0 0` places the align point at
	 * top/left/rear corner of the object's parent's size space, a value of `0.5
	 * 0.5 0.5` places the align point in the center of the parent's size space,
	 * and a value of `1 1 1` places the origin at the bottom/right/front of the
	 * parent's size space.
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

	/**
	 * @property {string | [x?: number, y?: number, z?: number] | {x?: number, y?: number, z?: number} | XYZNumberValues | null} mountPoint -
	 *
	 * *attribute*
	 *
	 * Default: <code>new [XYZNumberValues](../xyz-values/XYZNumberValues)(0, 0, 0)</code>
	 *
	 * Set the mount point of the object in 3D space, relative to itself,
	 * by specifying values along the X, Y, and Z axes.
	 *
	 * The mount point is the point within the object's
	 * [`size`](./Sizeable#size) space that is placed at the location specified
	 * by [`position`](#position).
	 *
	 * The value for each axis is a portion of the object's size on the
	 * same axis. For example, a value of `0 0 0` places the align point at
	 * top/left/rear corner of the object's size space, a value of `0.5
	 * 0.5 0.5` places the align point in the center of the object's size space,
	 * and a value of `1 1 1` places the origin at the bottom/right/front of the
	 * object's size space.
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

	/**
	 * @property {string | number | null} opacity -
	 *
	 * *attribute*
	 *
	 * Default: `1`
	 *
	 * Set the object's opacity.
	 *
	 * The value should be a number from `0` to `1`. `0` is fully transparent, and `1` is fully opaque.
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
}
