import XYZValues from './XYZValues'
import Sizeable from './Sizeable'
import { makeLowercaseSetterAliases } from './Utility'
import {isInstanceof} from './Utility'

const instanceofSymbol = Symbol('instanceofSymbol')

const TransformableMixin = base => {

    // Transformable extends TreeNode (indirectly through Sizeable) because it
    // needs to be aware of its _parent when calculating align adjustments.
    class Transformable extends Sizeable.mixin(base) {

        construct(options = {}) {
            super.construct(options)

            this._worldMatrix = null
        }

        _setDefaultProperties() {
            super._setDefaultProperties()

            Object.assign(this._properties, {
                position:   new XYZValues(0, 0, 0),
                rotation:   new XYZValues(0, 0, 0),
                scale:      new XYZValues(1, 1, 1),
                origin:     new XYZValues(0.5, 0.5, 0.5),
                align:      new XYZValues(0, 0, 0),
                mountPoint: new XYZValues(0, 0, 0),
                opacity:    1,
                transform:  new window.DOMMatrix,
            })
        }

        _setPropertyObservers() {
            super._setPropertyObservers()

            this._properties.position.on('valuechanged',
                () => this.triggerEvent('propertychange', 'position'))
            this._properties.rotation.on('valuechanged',
                () => this.triggerEvent('propertychange', 'rotation'))
            this._properties.scale.on('valuechanged',
                () => this.triggerEvent('propertychange', 'scale'))
            this._properties.origin.on('valuechanged',
                () => this.triggerEvent('propertychange', 'origin'))
            this._properties.align.on('valuechanged',
                () => this.triggerEvent('propertychange', 'align'))
            this._properties.mountPoint.on('valuechanged',
                () => this.triggerEvent('propertychange', 'mountPoint'))
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
        _calculateMatrix () {
            const matrix = new window.DOMMatrix
            const properties = this._properties
            const thisSize = this._calculatedSize

            // THREE-COORDS-TO-DOM-COORDS
            // translate the "mount point" back to the top/left of the element.
            // We offset this in ElementOperations#applyTransform. The Y value
            // is inverted because we invert it below.
            matrix.translateSelf( thisSize.x/2, -thisSize.y/2, 0 )

            const alignAdjustment = [0,0,0]

            // TODO If a Scene has a _parent, it is not mounted directly into a
            // regular DOM element but rather it is child of a Node. In this
            // case we don't want the scene size to be based on observed size
            // of a regular DOM element, but relative to a parent Node just
            // like for all other Nodes.
            if (this._parent) {
                const parentSize = this._parent._calculatedSize

                // THREE-COORDS-TO-DOM-COORDS
                // translate the "align" back to the top/left of the parent element.
                // We offset this in ElementOperations#applyTransform. The Y
                // value is inverted because we invert it below.
                matrix.translateSelf( -parentSize.x/2, parentSize.y/2, 0 )

                const {align} = properties
                alignAdjustment[0] = parentSize.x * align.x
                alignAdjustment[1] = parentSize.y * align.y
                alignAdjustment[2] = parentSize.z * align.z
            }

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

            // THREE-COORDS-TO-DOM-COORDS
            // negate the Y value so that Three.js' positive Y is
            // downward.
            matrix.translateSelf(appliedPosition[0], -appliedPosition[1], appliedPosition[2])

            // origin calculation will go here:
            // - move by negative origin before rotating.

            // apply each axis rotation, in the x,y,z order.
            // TODO #151: make rotation order configurable
            const {rotation} = properties
            matrix.rotateAxisAngleSelf(1,0,0, rotation.x)
            matrix.rotateAxisAngleSelf(0,1,0, rotation.y)
            matrix.rotateAxisAngleSelf(0,0,1, rotation.z)

            // origin calculation will go here:
            // - move by positive origin after rotating.

            return matrix
        }

        // TODO: fix _isIdentity in DOMMatrix, it is returning true even if false.
        _calculateWorldMatricesInSubtree() {
            this._calculateWorldMatrixFromParent()

            const children = this._children
            for (let i=0, l=children.length; i<l; i+=1) {
                children[i]._calculateWorldMatricesInSubtree()
            }
        }

        _calculateWorldMatrixFromParent() {
            const parent = this._parent

            if (parent)
                //this._worldMatrix = parent._worldMatrix.multiply(this._properties.transform)
                this._worldMatrix = this._properties.transform.multiply(parent._worldMatrix)
            else
                this._worldMatrix = this._properties.transform
        }

        // TODO rename "render" to "update".
        _render() {
            super._render()

            // TODO: only run this when necessary (f.e. not if only opacity
            // changed)
            this._properties.transform = this._calculateMatrix()
        }

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
        }
        get position() {
            return this._properties.position
        }

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis rotation to apply.
         * @param {number} [newValue.y] The y-axis rotation to apply.
         * @param {number} [newValue.z] The z-axis rotation to apply.
         */
        set rotation(newValue) {
            this._setPropertyXYZ(Transformable, 'rotation', newValue)
        }
        get rotation() {
            return this._properties.rotation
        }

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis scale to apply.
         * @param {number} [newValue.y] The y-axis scale to apply.
         * @param {number} [newValue.z] The z-axis scale to apply.
         */
        set scale(newValue) {
            this._setPropertyXYZ(Transformable, 'scale', newValue)
        }
        get scale() {
            return this._properties.scale
        }

        /**
         * Set this Node's opacity.
         *
         * @param {number} opacity A floating point number between 0 and 1
         * (inclusive). 0 is fully transparent, 1 is fully opaque.
         */
        set opacity(newValue) {
            if (!isRealNumber(newValue)) newValue = undefined
            this._setPropertySingle(Transformable, 'opacity', newValue, 'number')
        }
        get opacity() {
            return this._properties.opacity
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
        set align(newValue) {
            this._setPropertyXYZ(Transformable, 'align', newValue)
        }
        get align() {
            return this._properties.align
        }

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
        }
        get mountPoint() {
            return this._properties.mountPoint
        }

        /**
         * Set all properties of a Transformable in one method.
         *
         * @param {Object} properties Properties object - see example.
         *
         * @example
         * node.properties = {
         *   position: {x:200, y:300, z:100},
         *   rotation: {z:35},
         *   scale: {y:2},
         *   opacity: .9,
         * }
         */
        set properties(properties = {}) {
            super.properties = properties

            if (properties.position)
                this.position = properties.position

            if (properties.rotation)
                this.rotation = properties.rotation

            if (properties.scale)
                this.scale = properties.scale

            if (properties.origin)
                this.origin = properties.origin

            if (properties.align)
                this.align = properties.align

            if (properties.mountPoint)
                this.mountPoint = properties.mountPoint

            if (properties.opacity)
                this.opacity = properties.opacity
        }
        // no need for a properties getter?
    }

    // for use by MotorHTML, convenient since HTMLElement attributes are all
    // converted to lowercase by default, so if we don't do this then we won't be
    // able to map attributes to Node setters as easily.
    makeLowercaseSetterAliases(Transformable.prototype)

    Object.defineProperty(Transformable, Symbol.hasInstance, {
        value: function(obj) {
            if (this !== Transformable) return Object.getPrototypeOf(Transformable)[Symbol.hasInstance].call(this, obj)

            let currentProto = obj

            while(currentProto) {
                const desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                if (desc && desc.value && desc.value.hasOwnProperty(instanceofSymbol))
                    return true

                currentProto = Object.getPrototypeOf(currentProto)
            }

            return false
        }
    })

    Transformable[instanceofSymbol] = true

    return Transformable
}

function isRealNumber(num) {
    if (
        typeof num != 'number'
        || Object.is(num, NaN)
        || Object.is(num, Infinity)
    ) return false
    return true
}

const Transformable = TransformableMixin(class{})
Transformable.mixin = TransformableMixin

export {Transformable as default}
