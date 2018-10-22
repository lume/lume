import Class from 'lowclass'
import Mixin from './Mixin'
import XYZNumberValues from './XYZNumberValues'
import Sizeable from './Sizeable'
import {isInstanceof} from './Utility'
import { props } from './props'

export default
Mixin(Base => {

    const Parent = Sizeable.mixin(Base)

    // Transformable extends TreeNode (indirectly through Sizeable) because it
    // needs to be aware of its `parent` when calculating align adjustments.
    const Transformable = Class('Transformable').extends( Parent, ({ Super }) => ({

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
                transform:  new window.DOMMatrix, // untracked by SkateJS
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
        _calculateMatrix () {
            // NOTE The only way to get an identity matrix with DOMMatrix API
            // in the current spec is to make a new DOMMatrix. This is wasteful
            // because it creates new memory. It'd be nice to have an
            // identity() method or similar.
            const matrix = new window.DOMMatrix

            // TODO FIXME For some reason, the root node (i.e. the Scene)
            // should not be translated or else the WebGL rendering glitches
            // out (this happened with my vanilla WebGL implementation as well
            // as with Three.js), so we return Identity if there's no parent.
            if (!this.parent) return matrix

            const properties = this._properties
            const thisSize = this._calculatedSize

            // THREE-COORDS-TO-DOM-COORDS
            // translate the "mount point" back to the top/left of the element.
            // We offset this in ElementOperations#applyTransform. The Y value
            // is inverted because we invert it below.
            const threeJsPostAdjustment = [ thisSize.x/2, thisSize.y/2, 0 ]

            const alignAdjustment = [0,0,0]

            // TODO If a Scene has a `parent`, it is not mounted directly into a
            // regular DOM element but rather it is child of a Node. In this
            // case we don't want the scene size to be based on observed size
            // of a regular DOM element, but relative to a parent Node just
            // like for all other Nodes.
            const parentSize = this.parent._calculatedSize

            // THREE-COORDS-TO-DOM-COORDS
            // translate the "align" back to the top/left of the parent element.
            // We offset this in ElementOperations#applyTransform. The Y
            // value is inverted because we invert it below.
            threeJsPostAdjustment[0] += -parentSize.x/2
            threeJsPostAdjustment[1] += -parentSize.y/2

            const {align} = properties
            alignAdjustment[0] = parentSize.x * align.x
            alignAdjustment[1] = parentSize.y * align.y
            alignAdjustment[2] = parentSize.z * align.z

            const mountPointAdjustment = [0,0,0]
            const {mountPoint} = properties
            mountPointAdjustment[0] = thisSize.x * mountPoint.x
            mountPointAdjustment[1] = thisSize.y * mountPoint.y
            mountPointAdjustment[2] = thisSize.z * mountPoint.z

            const appliedPosition = []
            const {position} = properties
            appliedPosition[0] = position.x + alignAdjustment[0] - mountPointAdjustment[0]
            appliedPosition[1] = position.y + alignAdjustment[1] - mountPointAdjustment[1]
            appliedPosition[2] = position.z + alignAdjustment[2] - mountPointAdjustment[2]

            matrix.translateSelf(
                appliedPosition[0] + threeJsPostAdjustment[0],
                // THREE-COORDS-TO-DOM-COORDS negate the Y value so that
                // Three.js' positive Y is downward.
                -(appliedPosition[1] + threeJsPostAdjustment[1]),
                appliedPosition[2] + threeJsPostAdjustment[2]
            )

            // origin calculation will go here:
            // - move by negative origin before rotating.

            // apply each axis rotation, in the x,y,z order.
            // THREE-COORDS-TO-DOM-COORDS: X rotation is negated here so that
            // Three rotates on X in the same direction as CSS 3D. It is
            // negated again when applied to DOM elements so they rotate as
            // expected in CSS 3D.
            // TODO #151: make rotation order configurable
            const {rotation} = properties
            matrix.rotateAxisAngleSelf(1,0,0, rotation.x)
            matrix.rotateAxisAngleSelf(0,1,0, rotation.y)
            matrix.rotateAxisAngleSelf(0,0,1, rotation.z)

            // origin calculation will go here:
            // - move by positive origin after rotating.

            return matrix
        },

        // TODO: fix _isIdentity in DOMMatrix, it is returning true even if false.
        _calculateWorldMatricesInSubtree() {
            this._calculateWorldMatrixFromParent()

            const children = this.subnodes
            for (let i=0, l=children.length; i<l; i+=1) {
                children[i]._calculateWorldMatricesInSubtree()
            }
        },

        _calculateWorldMatrixFromParent() {
            const parent = this.parent

            if (parent)
                //this._worldMatrix = parent._worldMatrix.multiply(this._properties.transform)
                this._worldMatrix = this._properties.transform.multiply(parent._worldMatrix)
            else
                this._worldMatrix = this._properties.transform

            this.trigger('worldMatrixUpdate')
        },

        // TODO rename "render" to "update".
        _render() {
            if ( Super(this)._render ) Super(this)._render()

            // TODO: only run this when necessary (f.e. not if only opacity
            // changed)
            this._properties.transform = this._calculateMatrix()
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
            return Super(this).position
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
            return Super(this).rotation
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
            return Super(this).scale
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
            return Super(this).opacity
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
            return Super(this).align
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
            return Super(this).mountPoint
        },
    }))

    return Transformable
})
