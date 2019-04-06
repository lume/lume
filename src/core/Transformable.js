import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'
import '../lib/three/global'
import XYZNumberValues from './XYZNumberValues'
import Sizeable from './Sizeable'
import { props } from './props'

// This patches Object3D to have a `.pivot` property of type THREE.Vector3 that
// allows the origin (pivot) of rotation and scale to be specified in local
// coordinate space. For more info:
// https://github.com/mrdoob/three.js/issues/15965
THREE.Object3D.prototype.updateMatrix = function () {

    this.matrix.compose(this.position, this.quaternion, this.scale)

    var pivot = this.pivot

    if ( pivot && ( pivot.x !== 0 || pivot.y !== 0 || pivot.z !== 0 ) ) {

        var px = pivot.x, py = pivot.y,  pz = pivot.z
        var te = this.matrix.elements

        te[ 12 ] += px - te[ 0 ] * px - te[ 4 ] * py - te[ 8 ] * pz
        te[ 13 ] += py - te[ 1 ] * px - te[ 5 ] * py - te[ 9 ] * pz
        te[ 14 ] += pz - te[ 2 ] * px - te[ 6 ] * py - te[ 10 ] * pz

    }

    this.matrixWorldNeedsUpdate = true

}

const Brand = {}

export default
Mixin(Base => {

    const Parent = Sizeable.mixin(Base)

    // Transformable extends TreeNode (indirectly through Sizeable) because it
    // needs to be aware of its `parent` when calculating align adjustments.
    const Transformable = Class('Transformable').extends( Parent, ({ Super, Public, Protected }) => ({

        static: {
            props: {
                ...Parent.props,
                position:   props.XYZNumberValues,
                rotation:   props.XYZNumberValues,
                scale:      props.XYZNumberValues,
                origin:     props.XYZNumberValues,
                align:      props.XYZNumberValues,
                mountPoint: props.XYZNumberValues,
                opacity:    props.number,
            },
        },

        constructor(options = {}) {
            const self = Super(this).constructor(options)
            self._worldMatrix = null
            return self
        },

        _setDefaultProperties() {
            Super(this)._setDefaultProperties()

            Object.assign(this._properties, {
                position:   new XYZNumberValues(0, 0, 0),
                rotation:   new XYZNumberValues(0, 0, 0),
                scale:      new XYZNumberValues(1, 1, 1),
                origin:     new XYZNumberValues(0.5, 0.5, 0.5),
                align:      new XYZNumberValues(0, 0, 0),
                mountPoint: new XYZNumberValues(0, 0, 0),
                opacity:    1,
            })
        },

        _setPropertyObservers() {
            Super(this)._setPropertyObservers()

            this._properties.position.on('valuechanged',
                () => this.trigger('propertychange', 'position'))
            this._properties.rotation.on('valuechanged',
                () => this.trigger('propertychange', 'rotation'))
            this._properties.scale.on('valuechanged',
                () => this.trigger('propertychange', 'scale'))
            this._properties.origin.on('valuechanged',
                () => this.trigger('propertychange', 'origin'))
            this._properties.align.on('valuechanged',
                () => this.trigger('propertychange', 'align'))
            this._properties.mountPoint.on('valuechanged',
                () => this.trigger('propertychange', 'mountPoint'))

            // this is also triggered by Sizeable.updated, besides the above lines
            this.on('propertychange', prop => this._onPropChange(prop))
        },

        _onPropChange(prop) {
            if (
                // position not handled here because it is handled in _calculateMatrix
                // prop === 'position' ||
                prop === 'rotation' ||
                prop === 'scale'
            ) {
                Protected(this)['_update_' + prop]()
            }
        },

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
        _calculateMatrix: (function() {
            const threeJsPostAdjustment = [0, 0, 0]
            const alignAdjustment = [0, 0, 0]
            const mountPointAdjustment = [0, 0, 0]
            const appliedPosition = [0, 0, 0]

            return function _calculateMatrix() {
                const {align, mountPoint, position, origin} = this._properties
                const size = this._calculatedSize

                // THREE-COORDS-TO-DOM-COORDS
                // translate the "mount point" back to the top/left/back of the object
                // (in Three.js it is in the center of the object).
                threeJsPostAdjustment[0] = size.x/2
                threeJsPostAdjustment[1] = size.y/2
                threeJsPostAdjustment[2] = size.z/2

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
                threeJsPostAdjustment[0] += -parentSize.x/2
                threeJsPostAdjustment[1] += -parentSize.y/2
                threeJsPostAdjustment[2] += -parentSize.z/2

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

                const childOfScene =
                    this.threeCSS.parent &&
                    this.threeCSS.parent.type === 'Scene'

                if (childOfScene) {
                    this.threeCSS.position.set(
                        appliedPosition[0] + threeJsPostAdjustment[0],
                        // THREE-COORDS-TO-DOM-COORDS negate the Y value so that
                        // Three.js' positive Y is downward like DOM.
                        -(appliedPosition[1] + threeJsPostAdjustment[1]),
                        appliedPosition[2] + threeJsPostAdjustment[2]
                    )
                }
                else {
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

                    this.three.pivot.set(
                        origin.x * size.x - size.x/2,
                        // THREE-COORDS-TO-DOM-COORDS negate the Y value so that
                        // positive Y means down instead of up (because Three,js Y
                        // values go up).
                        -(origin.y * size.y - size.y/2),
                        origin.z * size.z - size.z/2
                    )

                    this.threeCSS.pivot.set(
                        origin.x * size.x - size.x/2,
                        // THREE-COORDS-TO-DOM-COORDS negate the Y value so that
                        // positive Y means down instead of up (because Three,js Y
                        // values go up).
                        -(origin.y * size.y - size.y/2),
                        origin.z * size.z - size.z/2
                    )
                }
                // otherwise, use default Three.js origin of (0,0,0) which is
                // equivalent to our (0.5,0.5,0.5), by removing the pivot value.
                else {
                    this.three.pivot.set(0, 0, 0)
                    this.threeCSS.pivot.set(0, 0, 0)
                }

                this.three.updateMatrix()
                this.threeCSS.updateMatrix()
            }
        })(),

        _calculateWorldMatricesInSubtree() {
            this.three.updateMatrixWorld()
            this.threeCSS.updateMatrixWorld()
            this.trigger('worldMatrixUpdate')
        },

        /**
         * Set the position of the Transformable.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis position to apply.
         * @param {number} [newValue.y] The y-axis position to apply.
         * @param {number} [newValue.z] The z-axis position to apply.
         */
        set position(newValue) {
            this._setPropertyXYZ(Transformable, 'position', newValue)
        },
        get position() {
            return this._props.position
        },

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis rotation to apply.
         * @param {number} [newValue.y] The y-axis rotation to apply.
         * @param {number} [newValue.z] The z-axis rotation to apply.
         */
        set rotation(newValue) {
            this._setPropertyXYZ(Transformable, 'rotation', newValue)
        },
        get rotation() {
            return this._props.rotation
        },

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis scale to apply.
         * @param {number} [newValue.y] The y-axis scale to apply.
         * @param {number} [newValue.z] The z-axis scale to apply.
         */
        set scale(newValue) {
            this._setPropertyXYZ(Transformable, 'scale', newValue)
        },
        get scale() {
            return this._props.scale
        },

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis origin to apply.
         * @param {number} [newValue.y] The y-axis origin to apply.
         * @param {number} [newValue.z] The z-axis origin to apply.
         */
        set origin(newValue) {
            this._setPropertyXYZ(Transformable, 'origin', newValue)
        },
        get origin() {
            return this._props.origin
        },

        /**
         * Set this Node's opacity.
         *
         * @param {number} opacity A floating point number between 0 and 1
         * (inclusive). 0 is fully transparent, 1 is fully opaque.
         */
        set opacity(newValue) {
            this._setPropertySingle('opacity', newValue)
        },
        get opacity() {
            return this._props.opacity
        },

        /**
         * Set the alignment of the Node. This determines at which point in this
         * Node's parent that this Node is mounted.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis align to apply.
         * @param {number} [newValue.y] The y-axis align to apply.
         * @param {number} [newValue.z] The z-axis align to apply.
         */
        set align(newValue) {
            this._setPropertyXYZ(Transformable, 'align', newValue)
        },
        get align() {
            return this._props.align
        },

        /**
         * Set the mount point of the Node.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis mountPoint to apply.
         * @param {number} [newValue.y] The y-axis mountPoint to apply.
         * @param {number} [newValue.z] The z-axis mountPoint to apply.
         */
        set mountPoint(newValue) {
            this._setPropertyXYZ(Transformable, 'mountPoint', newValue)
        },
        get mountPoint() {
            return this._props.mountPoint
        },

        protected: {
            // TODO rename "render" to "update".
            _render() {
                Super(this)._render && Super(this)._render()

                // TODO: only run this when necessary (f.e. not if only opacity
                // changed, only if position/align/mountPoint changed, etc)
                Public(this)._calculateMatrix()
            },

            _update_rotation() {
                const pub = Public(this)

                // TODO make the rotation unit configurable (f.e. use degrees or
                // radians)
                pub.three.rotation.set(
                    toRadians(pub.rotation.x),
                    toRadians(pub.rotation.y),
                    toRadians(pub.rotation.z),
                )

                const childOfScene =
                    pub.threeCSS.parent &&
                    pub.threeCSS.parent.type === 'Scene'

                pub.threeCSS.rotation.set(
                    (childOfScene ? 1 : -1 ) * toRadians(pub.rotation.x),
                    toRadians(pub.rotation.y),
                    (childOfScene ? 1 : -1 ) * toRadians(pub.rotation.z),
                )
            },

            _update_scale() {
                const pub = Public(this)

                pub.three.scale.set(
                    pub.scale.x,
                    pub.scale.y,
                    pub.scale.z,
                )

                pub.threeCSS.scale.set(
                    pub.scale.x,
                    pub.scale.y,
                    pub.scale.z,
                )
            },
        },

    }), Brand)

    return Transformable
})

function toRadians(degrees) {
    return degrees / 180 * Math.PI
}
