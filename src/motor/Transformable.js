import XYZValues from './XYZValues'
import Sizeable from './Sizeable'
import { makeLowercaseSetterAliases } from './Utility'

// Transformable doesn't need to extend from a class, but there isn't multiple
// inheritance in JavaSript out of the box, and Node needs to have the
// properties of Transformable and other classes, while Scene will branch from
// an ancestor class of Node.
//
// TODO: Is this the best name? Maybe Renderable? How to organize the DOM and
// WebGL components?
const TransformableMixin = base => {
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

                transform: new window.DOMMatrix,

                style: {
                    opacity: 1,
                },
            })

            // TODO: opacity needs onChanged handler like all the other
            // properties.
            const propertyChange = () => this._needsToBeRendered()
            this._properties.position.onChanged = propertyChange
            this._properties.rotation.onChanged = propertyChange
            this._properties.scale.onChanged = propertyChange
            this._properties.origin.onChanged = propertyChange
            this._properties.align.onChanged = propertyChange
            this._properties.mountPoint.onChanged = propertyChange

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

            this._needsToBeRendered()
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

            this._needsToBeRendered()
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

            this._needsToBeRendered()
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
            this._properties.style.opacity = opacity;
            this._needsToBeRendered()
        }
        get opacity() {
            return this._properties.style.opacity
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

            this._needsToBeRendered()
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

            this._needsToBeRendered()
        }
        get mountPoint() {
            return this._properties.mountPoint
        }

        /**
         * Set all properties of the Node in one method.
         *
         * @param {Object} properties Properties object - see example
         *
         * @example
         * node.properties = {
         *   classes: ['open'],
         *   position: [200, 300, 0],
         *   rotation: [3, 0, 0],
         *   scale: [1, 1, 1],
         *   opacity: .9
         * }
         */
        set properties (properties = {}) {
            super.properties = properties

            // Position
            if (properties.position)
                this.position = properties.position

            // Rotation
            if (properties.rotation)
                this.rotation = properties.rotation

            // Scale
            if (properties.scale)
                this.scale = properties.scale

            // Align
            if (properties.align)
                this.align = properties.align

            // Opacity
            if (properties.style) {
                if (typeof properties.style.opacity != 'undefined')
                    this.opacity = properties.opacity
            }

            this._needsToBeRendered()
        }
        // no need for a properties getter.

        // TODO Where does _render belong? Probably in the DOMRenderer?
        _render(timestamp) {
            // applies the transform matrix to the element's style property.
            // TODO: We shouldn't need to re-calculate the whole matrix every render?
            this._setMatrix3d(this._calculateMatrix());

            super._render()

            // TODO move to DOMRenderer
            this._applyStyles()

            return this
        }

        /**
         * [applyTransform description]
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
         */
        _calculateMatrix () {
            let matrix = new window.DOMMatrix

            let alignAdjustment = [0,0,0]
            if (this._parent) { // The root Scene doesn't have a parent, for example.
                let parentSize = this._parent.actualSize
                alignAdjustment[0] = parentSize.x * this._properties.align.x
                alignAdjustment[1] = parentSize.y * this._properties.align.y
                alignAdjustment[2] = parentSize.z * this._properties.align.z
            }

            let mountPointAdjustment = [0,0,0]
            let thisSize = this.actualSize
            mountPointAdjustment[0] = thisSize.x * this._properties.mountPoint.x
            mountPointAdjustment[1] = thisSize.y * this._properties.mountPoint.y
            mountPointAdjustment[2] = thisSize.z * this._properties.mountPoint.z

            let appliedPosition = []
            appliedPosition[0] = this._properties.position.x + alignAdjustment[0] - mountPointAdjustment[0]
            appliedPosition[1] = this._properties.position.y + alignAdjustment[1] - mountPointAdjustment[1]
            appliedPosition[2] = this._properties.position.z + alignAdjustment[2] - mountPointAdjustment[2]

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
            let rotation = this._properties.rotation
            matrix.rotateAxisAngleSelf(1,0,0, rotation.x)
            matrix.rotateAxisAngleSelf(0,1,0, rotation.y)
            matrix.rotateAxisAngleSelf(0,0,1, rotation.z)

            // TODO: move by positive origin after rotating.

            return matrix
        }

        /**
         * [setMatrix3d description]
         *
         * @private
         * @param {DOMMatrix} matrix A DOMMatrix instance to set as this node's
         * transform. See "W3C Geometry Interfaces".
         */
        _setMatrix3d (matrix) {
            this._properties.transform = matrix
            // ^ TODO PERFORMANCE: What's faster? Setting a new DOMMatrix (as we do here
            // currently, the result of _calculateMatrix) or applying all
            // transform values to the existing DOMMatrix?

            this._applyTransform();
        }

        /**
         * Apply the DOMMatrix value to the style of this Node's element.
         *
         * @private
         *
         * TODO We'll eventually apply the DOMMatrix directly instead of
         * converting to a string here.
         *
         * TODO move to DOMRenderer
         */
        _applyTransform () {
            var matrix = this._properties.transform;

            // XXX: is this in the right order? UPDATE: It is.
            // TODO: Apply DOMMatrix directly to the Element once browser APIs
            // support it. Maybe we can polyfill this?
            var cssMatrixString = `matrix3d(
                ${ matrix.m11 },
                ${ matrix.m12 },
                ${ matrix.m13 },
                ${ matrix.m14 },
                ${ matrix.m21 },
                ${ matrix.m22 },
                ${ matrix.m23 },
                ${ matrix.m24 },
                ${ matrix.m31 },
                ${ matrix.m32 },
                ${ matrix.m33 },
                ${ matrix.m34 },
                ${ matrix.m41 },
                ${ matrix.m42 },
                ${ matrix.m43 },
                ${ matrix.m44 }
            )`;

            this._applyStyle('transform', cssMatrixString);
        }

        /**
         * @private
         */
        _applyStyles () {
            for (let key of Object.keys(this._properties.style)) {
                this._applyStyle(key, this._properties.style[key]);
            }
        }
    }

    // for use by MotorHTML, convenient since HTMLElement attributes are all
    // converted to lowercase by default, so if we don't do this then we won't be
    // able to map attributes to Node setters as easily.
    //
    // TODO: move this call out of here, run it in a motor-specific class so
    // that Transformable and related classes are not necessarily
    // motor-scpecific and can be used anywhere.
    makeLowercaseSetterAliases(Transformable.prototype)

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
