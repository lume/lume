import { XYZNumberValues } from '../xyz-values/XYZNumberValues.js';
import { Sizeable, type XYZNumberValuesProperty, type XYZNumberValuesPropertyFunction } from './Sizeable.js';
import type { SizeableAttributes } from './Sizeable.js';
export type TransformableAttributes = SizeableAttributes | 'position' | 'rotation' | 'scale' | 'origin' | 'alignPoint' | 'mountPoint';
/**
 * @class Transformable - A class containing transform-related features for all
 * `Element3D` and `Scene` elements: rotation, position, scale, mount-point,
 * align-point, and origin. Note that Transforms have no effect on Scene
 * elements, but Scenes still use the features from Sizeable (the base class of
 * Transformable) for sizing.
 *
 * The properties of `Transformable` all follow a common usage pattern,
 * described in the [`Common Attributes`](../../guide/common-attributes) doc.
 *
 * @extends Sizeable
 */
export declare class Transformable extends Sizeable {
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
    set position(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction);
    get position(): XYZNumberValues;
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
    set rotation(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction);
    get rotation(): XYZNumberValues;
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
    set scale(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction);
    get scale(): XYZNumberValues;
    /**
     * @property {string | [x?: number, y?: number, z?: number] | {x?: number, y?: number, z?: number} | XYZNumberValues | null} origin -
     *
     * *attribute*
     *
     * Default: <code>new [XYZNumberValues](../xyz-values/XYZNumberValues)(0.5, 0.5, 0.5)</code>
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
     * <live-code id="example"></live-code>
     * <script>
     *   example.content = originExample
     * </script>
     */
    set origin(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction);
    get origin(): XYZNumberValues;
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
    set alignPoint(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction);
    get alignPoint(): XYZNumberValues;
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
    set mountPoint(newValue: XYZNumberValuesProperty | XYZNumberValuesPropertyFunction);
    get mountPoint(): XYZNumberValues;
}
//# sourceMappingURL=Transformable.d.ts.map