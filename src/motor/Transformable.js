import XYZValues from './XYZValues'
import Sizeable from './Sizeable'
import { makeLowercaseSetterAliases, makeAccessorsEnumerable } from './Utility'

const instanceofSymbol = Symbol('instanceofSymbol')

// Transformable doesn't need to extend from a class, but there isn't multiple
// inheritance in JavaSript out of the box, and Node needs to have the
// properties of Transformable and other classes, while Scene will branch from
// an ancestor class of Node.
//
// TODO: Is this the best name? Maybe Renderable? How to organize the DOM and
// WebGL components?
const TransformableMixin = base => {

    // Transformable extends TreeNode (indirectly through Sizeable) because it
    // needs to be aware of its _parent when calculating align adjustments.
    class Transformable extends Sizeable.mixin(base) {

        constructor(options = {}) {
            super(options)

            // Property Cache, with default values
            Object.assign(this._properties, {

                // XXX: remove these in favor of storing them directly in the
                // DOMMatrix?
                position: new XYZValues(0, 0, 0),
                rotation: new XYZValues(0, 0, 0),

                // TODO: handle scale
                scale: new XYZValues(1, 1, 1),

                // TODO, handle origin, needs a setter/getter pair.
                origin: new XYZValues(0.5, 0.5, 0.5),

                align: new XYZValues(0, 0, 0),
                mountPoint: new XYZValues(0, 0, 0),

                opacity: 1,

                transform: new window.DOMMatrix,
            })

            // TODO: opacity needs onChanged handler like all the other
            // properties.
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

            this.properties = options
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
            if (!(newValue instanceof Object))
                throw new TypeError('Invalid value for Transformable#position.')

            if (typeof newValue.x != 'undefined') this._properties.position._x = newValue.x
            if (typeof newValue.y != 'undefined') this._properties.position._y = newValue.y
            if (typeof newValue.z != 'undefined') this._properties.position._z = newValue.z

            this.triggerEvent('propertychange', 'position')
        }
        get position() {
            return this._properties.position
        }

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis rotation to apply.
         * @param {number} [newValue.y] The y-axis rotation to apply.
         * @param {number} [newValue.z] The z-axis rotation to apply.
         *
         * XXX: We should we also provide a setRotationAxis method to rotate about
         * a particular axis? Or, maybe if a fourth `w` property is specified then
         * x, y, and z can define a rotation axis and w be the angle.
         */
        set rotation(newValue) {
            if (!(newValue instanceof Object))
                throw new TypeError('Invalid value for Node#rotation.')

            if (typeof newValue.x != 'undefined') this._properties.rotation._x = newValue.x
            if (typeof newValue.y != 'undefined') this._properties.rotation._y = newValue.y
            if (typeof newValue.z != 'undefined') this._properties.rotation._z = newValue.z

            this.triggerEvent('propertychange', 'rotation')
        }
        get rotation() {
            return this._properties.rotation
        }

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis scale to apply.
         * @param {number} [newValue.y] The y-axis scale to apply.
         * @param {number} [newValue.z] The z-axis scale to apply.
         *
         * TODO: scale is not handled yet.
         */
        set scale(newValue) {
            if (!(newValue instanceof Object))
                throw new TypeError('Invalid value for Node#scale.')

            if (typeof newValue.x != 'undefined') this._properties.scale._x = newValue.x
            if (typeof newValue.y != 'undefined') this._properties.scale._y = newValue.y
            if (typeof newValue.z != 'undefined') this._properties.scale._z = newValue.z

            this.triggerEvent('propertychange', 'scale')
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
        set opacity(opacity) {
            if (!isRealNumber(opacity)) throw new Error('Expected a real number for Node#opacity.')
            this._properties.opacity = opacity;
            this.triggerEvent('propertychange', 'opacity')
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
            if (!(newValue instanceof Object))
                throw new TypeError('Invalid value for Node#align.')

            if (typeof newValue.x != 'undefined') this._properties.align._x = newValue.x
            if (typeof newValue.y != 'undefined') this._properties.align._y = newValue.y
            if (typeof newValue.z != 'undefined') this._properties.align._z = newValue.z

            this.triggerEvent('propertychange', 'align')
        }
        get align() {
            return this._properties.align
        }

        /**
         * Set the mount point of the Node. TODO: put "mount point" into words.
         *
         * XXX possibly rename to "anchor" to avoid confusion with Scene.mount?
         * Could also segway to anchors system like Qt QML.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis mountPoint to apply.
         * @param {number} [newValue.y] The y-axis mountPoint to apply.
         * @param {number} [newValue.z] The z-axis mountPoint to apply.
         */
        set mountPoint(newValue) {
            if (!(newValue instanceof Object))
                throw new TypeError('Invalid value for Node#mountPoint.')

            if (typeof newValue.x != 'undefined') this._properties.mountPoint._x = newValue.x
            if (typeof newValue.y != 'undefined') this._properties.mountPoint._y = newValue.y
            if (typeof newValue.z != 'undefined') this._properties.mountPoint._z = newValue.z

            this.triggerEvent('propertychange', 'mountPoint')
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
        set properties (properties = {}) {
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
        // no need for a properties getter.

        /**
         * Takes all the current component values (position, rotation, etc) and
         * calculates a transformation DOMMatrix from them. See "W3C Geometry
         * Interfaces" to learn about DOMMatrix.
         *
         * @method
         * @private
         * @memberOf Node
         *
         * TODO: instead of calculating the whole matrix here all at once (which
         * gets called each _render()), apply rotation, translation, etc, directly
         * to the matrix individually when the user gives us those values. It might be
         * more performant. It will also let the user apply x,y,z rotation in their
         * order of choice instead of always x,y,z order as we do here.
         *
         * TODO PERFORMANCE: What's faster? Setting a new DOMMatrix (as we do
         * here currently) or applying all transform values to the existing
         * DOMMatrix?
         */
        _calculateMatrix () {
            const matrix = new window.DOMMatrix
            const properties = this._properties

            const alignAdjustment = [0,0,0]
            if (this._parent) { // The root Scene doesn't have a parent, for example.
                const parentSize = this._parent._calculatedSize
                const {align} = properties
                alignAdjustment[0] = parentSize.x * align.x
                alignAdjustment[1] = parentSize.y * align.y
                alignAdjustment[2] = parentSize.z * align.z
            }

            const mountPointAdjustment = [0,0,0]
            const thisSize = this._calculatedSize
            const {mountPoint} = properties
            mountPointAdjustment[0] = thisSize.x * mountPoint.x
            mountPointAdjustment[1] = thisSize.y * mountPoint.y
            mountPointAdjustment[2] = thisSize.z * mountPoint.z

            const appliedPosition = []
            const {position} = properties
            appliedPosition[0] = position.x + alignAdjustment[0] - mountPointAdjustment[0]
            appliedPosition[1] = position.y + alignAdjustment[1] - mountPointAdjustment[1]
            appliedPosition[2] = position.z + alignAdjustment[2] - mountPointAdjustment[2]

            matrix.translateSelf(appliedPosition[0], appliedPosition[1], appliedPosition[2])

            // TODO: move by negative origin before rotating.
            // XXX Should we calculate origin here, or should we leave that to the
            // DOM renderer (in the style property)? WebGL renderer will need
            // manual calculations. Maybe we don't do it here, and delegate it to
            // DOM and WebGL renderers.

            // apply each axis rotation, in the x,y,z order.
            // XXX: Does order in which axis rotations are applied matter? If so,
            // which order is best? Maybe we let the user decide (with our
            // recommendation)?
            const {rotation} = properties
            matrix.rotateAxisAngleSelf(1,0,0, rotation.x)
            matrix.rotateAxisAngleSelf(0,1,0, rotation.y)
            matrix.rotateAxisAngleSelf(0,0,1, rotation.z)

            // TODO: move by positive origin after rotating.

            return matrix
        }
    }

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

    // for use by MotorHTML, convenient since HTMLElement attributes are all
    // converted to lowercase by default, so if we don't do this then we won't be
    // able to map attributes to Node setters as easily.
    //
    // TODO: move this call out of here, run it in a motor-specific class so
    // that Transformable and related classes are not necessarily
    // motor-scpecific and can be used anywhere.
    makeLowercaseSetterAliases(Transformable.prototype)

    // So Tween.js can animate Transformable properties that are accessors.
    // Note, this makes all accessors enumerable even though we don't need to
    // animate them all, but it's not a big deal.
    makeAccessorsEnumerable(Transformable.prototype)

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
