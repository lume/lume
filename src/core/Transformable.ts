import {Mixin, MixinResult, Constructor} from 'lowclass'
import {Object3D} from 'three'
import '../lib/three/make-global'
import XYZNumberValues from './XYZNumberValues'
import Sizeable, {SizeProp} from './Sizeable'
import {props} from './props'
import {toRadians} from './Utility'

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
Object3D.prototype.updateMatrix = function() {
    this.matrix.compose(
        this.position,
        this.quaternion,
        this.scale
    )

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

type TransformProp = SizeProp | 'position' | 'rotation' | 'scale' | 'origin' | 'align' | 'mountPoint' | 'opacity'

function TransformableMixin<T extends Constructor>(Base: T) {
    const Parent = Sizeable.mixin(Constructor(Base))

    // Transformable extends TreeNode (indirectly through Sizeable) because it
    // needs to be aware of its `parent` when calculating align adjustments.
    class Transformable extends Parent {
        static props = {
            ...(Parent.props || {}),
            position: props.XYZNumberValues,
            rotation: props.XYZNumberValues,
            scale: props.XYZNumberValues,
            origin: props.XYZNumberValues,
            align: props.XYZNumberValues,
            mountPoint: props.XYZNumberValues,
            opacity: props.number,
        }

        /**
         * Set the position of the Transformable.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis position to apply.
         * @param {number} [newValue.y] The y-axis position to apply.
         * @param {number} [newValue.z] The z-axis position to apply.
         */
        set position(newValue: any) {
            this._setPropertyXYZ<Transformable, TransformProp>('position', newValue)
        }
        get position(): any {
            return this._props.position
        }

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis rotation to apply.
         * @param {number} [newValue.y] The y-axis rotation to apply.
         * @param {number} [newValue.z] The z-axis rotation to apply.
         */
        set rotation(newValue: any) {
            this._setPropertyXYZ<Transformable, TransformProp>('rotation', newValue)
        }
        get rotation(): any {
            return this._props.rotation
        }

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis scale to apply.
         * @param {number} [newValue.y] The y-axis scale to apply.
         * @param {number} [newValue.z] The z-axis scale to apply.
         */
        set scale(newValue: any) {
            this._setPropertyXYZ<Transformable, TransformProp>('scale', newValue)
        }
        get scale(): any {
            return this._props.scale
        }

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis origin to apply.
         * @param {number} [newValue.y] The y-axis origin to apply.
         * @param {number} [newValue.z] The z-axis origin to apply.
         */
        set origin(newValue: any) {
            this._setPropertyXYZ<Transformable, TransformProp>('origin', newValue)
        }
        get origin(): any {
            return this._props.origin
        }

        /**
         * Set this Node's opacity.
         *
         * @param {number} opacity A floating point number clamped between 0 and
         * 1 (inclusive). 0 is fully transparent, 1 is fully opaque.
         */
        set opacity(newValue: any) {
            this._setPropertySingle<Transformable, TransformProp>('opacity', newValue)
        }
        get opacity(): any {
            return this._props.opacity
        }

        /**
         * Set the alignment of the Node. This determines at which point in this
         * Node's parent that this Node is mounted.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis align to apply.
         * @param {number} [newValue.y] The y-axis align to apply.
         * @param {number} [newValue.z] The z-axis align to apply.
         */
        set align(newValue: any) {
            this._setPropertyXYZ<Transformable, TransformProp>('align', newValue)
        }
        get align(): any {
            return this._props.align
        }

        /**
         * Set the mount point of the Node.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis mountPoint to apply.
         * @param {number} [newValue.y] The y-axis mountPoint to apply.
         * @param {number} [newValue.z] The z-axis mountPoint to apply.
         */
        set mountPoint(newValue: any) {
            this._setPropertyXYZ<Transformable, TransformProp>('mountPoint', newValue)
        }
        get mountPoint(): any {
            return this._props.mountPoint
        }

        makeDefaultProps() {
            return Object.assign((super.makeDefaultProps && super.makeDefaultProps()) || {}, {
                position: new XYZNumberValues(0, 0, 0),
                rotation: new XYZNumberValues(0, 0, 0),
                scale: new XYZNumberValues(1, 1, 1),
                origin: new XYZNumberValues(0.5, 0.5, 0.5),
                align: new XYZNumberValues(0, 0, 0),
                mountPoint: new XYZNumberValues(0, 0, 0),
                opacity: 1,
            })
        }

        protected _setPropertyObservers(): void {
            super._setPropertyObservers && super._setPropertyObservers()

            this._properties.position.on('valuechanged', () => this.trigger('propertychange', 'position'))
            this._properties.rotation.on('valuechanged', () => this.trigger('propertychange', 'rotation'))
            this._properties.scale.on('valuechanged', () => this.trigger('propertychange', 'scale'))
            this._properties.origin.on('valuechanged', () => this.trigger('propertychange', 'origin'))
            this._properties.align.on('valuechanged', () => this.trigger('propertychange', 'align'))
            this._properties.mountPoint.on('valuechanged', () => this.trigger('propertychange', 'mountPoint'))

            // this is also triggered by Sizeable.updated, besides the above lines
            this.on('propertychange', (prop: string) => this._onPropChange(prop))
        }

        protected _onPropChange(prop: string): void {
            if (
                // position not handled here because it is handled in _calculateMatrix
                // prop === 'position' ||
                prop === 'rotation' ||
                prop === 'scale'
            ) {
                ;(this as any)['_update_' + prop]()
            }
        }

        // TODO rename "render" to "update".
        protected _render(_timestamp: number): void {
            // super._render && super._render()

            // TODO: only run this when necessary (f.e. not if only opacity
            // changed, only if position/align/mountPoint changed, etc)
            this._calculateMatrix()
        }

        // TODO These is from ImerativeBase. Refactor?
        three!: Object3D
        threeCSS!: Object3D

        protected _update_rotation(): void {
            // TODO make the rotation unit configurable (f.e. use degrees or
            // radians)
            this.three.rotation.set(toRadians(this.rotation.x), toRadians(this.rotation.y), toRadians(this.rotation.z))

            const childOfScene = this.threeCSS.parent && this.threeCSS.parent.type === 'Scene'

            this.threeCSS.rotation.set(
                (childOfScene ? 1 : -1) * toRadians(this.rotation.x),
                toRadians(this.rotation.y),
                (childOfScene ? 1 : -1) * toRadians(this.rotation.z)
            )
        }

        protected _update_scale(): void {
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
            const {align, mountPoint, position, origin} = this._properties
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

            this.three.position.set(
                appliedPosition[0] + threeJsPostAdjustment[0],
                // THREE-COORDS-TO-DOM-COORDS negate the Y value so that
                // Three.js' positive Y is downward like DOM.
                -(appliedPosition[1] + threeJsPostAdjustment[1]),
                appliedPosition[2] + threeJsPostAdjustment[2]
            )

            const childOfScene = this.threeCSS.parent && this.threeCSS.parent.type === 'Scene'

            if (childOfScene) {
                this.threeCSS.position.set(
                    appliedPosition[0] + threeJsPostAdjustment[0],
                    // THREE-COORDS-TO-DOM-COORDS negate the Y value so that
                    // Three.js' positive Y is downward like DOM.
                    -(appliedPosition[1] + threeJsPostAdjustment[1]),
                    appliedPosition[2] + threeJsPostAdjustment[2]
                )
            } else {
                // CSS objects that aren't direct child of a scene are
                // already centered on X and Y (not sure why, but maybe
                // CSS3DObjectNested has clues, which is based on
                // THREE.CSS3DObject)
                this.threeCSS.position.set(
                    appliedPosition[0],
                    -appliedPosition[1],
                    appliedPosition[2] + threeJsPostAdjustment[2] // only apply Z offset
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
                    origin.z * size.z - size.z / 2
                )
                ;(this.threeCSS as any).pivot.set(
                    origin.x * size.x - size.x / 2,
                    // THREE-COORDS-TO-DOM-COORDS negate the Y value so that
                    // positive Y means down instead of up (because Three,js Y
                    // values go up).
                    -(origin.y * size.y - size.y / 2),
                    origin.z * size.z - size.z / 2
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
            this.trigger('worldMatrixUpdate')
        }
    }

    return Transformable as MixinResult<typeof Transformable, T>
}

export const Transformable = Mixin(TransformableMixin)
export interface Transformable extends InstanceType<typeof Transformable> {}
export default Transformable

// const s: Transformable = new Transformable()
// s.asdfasdf
// s.calculatedSize = 123
// s.innerHTML = 123
// s.innerHTML = 'asdf'
// s.emit('asfasdf', 1, 2, 3)
// s.removeNode('asfasdf')
// s.updated(1, 2, 3, 4)
// s.blahblah
// s.sizeMode
// s._render(1, 2, 3)
// s.qwerqwer
// s.rotation
// s.three.sdf
// s.threeCSS.sdf

// const o = new (Transformable.mixin(
//     class {
//         test = 123
//     }
// ))()
// o.asdfasdf
// o.calculatedSize = 123
// o.innerHTML = 123
// o.innerHTML = 'asdf'
// o.emit('asfasdf', 1, 2, 3)
// o.removeNode('asfasdf')
// o.updated(1, 2, 3, 4)
// o.blahblah
// o.sizeMode
// o._render(1, 2, 3)
// o.qwerqwer
// o.rotation
// o.three.sdf
// o.threeCSS.sdf
// o.test = 'asdfasdf'
