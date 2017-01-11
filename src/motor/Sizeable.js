import { makeLowercaseSetterAliases, makeAccessorsEnumerable } from './Utility'
import XYZValues from './XYZValues'
import Observable from './Observable'

// fallback to experimental CSS transform if browser doesn't have it (fix for Safari 9)
if (typeof document.createElement('div').style.transform == 'undefined') {
    Object.defineProperty(CSSStyleDeclaration.prototype, 'transform', {
        set(value) {
            // XXX Might need to proxy to ms for IE11.
            this.webkitTransform = value
        },
        get() {
            return this.webkitTransform
        },
        enumerable: true,
    })
}

let instanceofSymbol = Symbol('instanceofSymbol')

const SizeableMixin = base => {
    class Sizeable extends Observable.mixin(base) {

        constructor(options = {}) {
            super(options)

            this._calculatedSize = { x:0, y:0, z:0 }

            // Property Cache, with default values
            this._properties = {
                sizeMode: new XYZValues('absolute', 'absolute', 'absolute'),
                absoluteSize: new XYZValues(0, 0, 0),
                proportionalSize: new XYZValues(1, 1, 1),
            };

            // TODO: move this observation in Node. I don't think it belongs here.
            this._properties.sizeMode.on('valuechanged',
                () => this.triggerEvent('propertychange', 'sizeMode'))
            this._properties.absoluteSize.on('valuechanged',
                () => this.triggerEvent('propertychange', 'absoluteSize'))
            this._properties.proportionalSize.on('valuechanged',
                () => this.triggerEvent('propertychange', 'proportionalSize'))

            // This line calls the leaf-class `properties` setter, but we want
            // to use the current prototype's `properties` setter, which
            // requires the super long line after this one. XXX Maybe there's a
            // better way to manage this?
            //
            //this.properties = options
            Object.getOwnPropertyDescriptor(Sizeable.prototype, 'properties').set.call(this, options)
        }

        /**
         * Set the size mode for each axis. Possible size modes are "absolute" and "proportional".
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis sizeMode to apply.
         * @param {number} [newValue.y] The y-axis sizeMode to apply.
         * @param {number} [newValue.z] The z-axis sizeMode to apply.
         */
        set sizeMode(newValue) {
            if (!(newValue instanceof Object))
                throw new TypeError('Invalid value for Node#sizeMode.')

            if (typeof newValue.x != 'undefined') this._properties.sizeMode._x = newValue.x
            if (typeof newValue.y != 'undefined') this._properties.sizeMode._y = newValue.y
            if (typeof newValue.z != 'undefined') this._properties.sizeMode._z = newValue.z

            this.triggerEvent('propertychange', 'sizeMode')
        }
        get sizeMode() {
            return this._properties.sizeMode
        }

        // XXX: We handle all axes at the same time. Would it be better to
        // handle each axis in separate methods, and call those separately in
        // the accessors?
        // TODO: This is called in ImperativeBase on propertychange. Maybe we
        // can refactor so it is called inside an animation frame like
        // Transform#_calculateMatrix?
        _calcSize() {
            const previousSize = Object.assign({}, this._calculatedSize)

            if (this._properties.sizeMode._x == 'absolute') {
                this._calculatedSize.x = this._properties.absoluteSize._x
            }
            else { // proportional
                this._parent?
                    this._calculatedSize.x = Math.round(this._parent._calculatedSize.x * this._properties.proportionalSize._x):
                    this._calculatedSize.x = 0
            }

            if (this._properties.sizeMode._y == 'absolute') {
                this._calculatedSize.y = this._properties.absoluteSize._y
            }
            else { // proportional
                this._parent?
                    this._calculatedSize.y = Math.round(this._parent._calculatedSize.y * this._properties.proportionalSize._y):
                    this._calculatedSize.y = 0
            }

            if (this._properties.sizeMode._z == 'absolute') {
                this._calculatedSize.z = this._properties.absoluteSize._z
            }
            else { // proportional
                this._parent?
                    this._calculatedSize.z = Math.round(this._parent._calculatedSize.z * this._properties.proportionalSize._z):
                    this._calculatedSize.z = 0
            }

            if (
                previousSize.x !== this._calculatedSize.x
                || previousSize.y !== this._calculatedSize.y
                || previousSize.z !== this._calculatedSize.z
            ) {
                this.triggerEvent('sizechange', Object.assign({}, this._calculatedSize))
            }
        }

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis absoluteSize to apply.
         * @param {number} [newValue.y] The y-axis absoluteSize to apply.
         * @param {number} [newValue.z] The z-axis absoluteSize to apply.
         */
        set absoluteSize(newValue) {
            if (!(newValue instanceof Object))
                throw new TypeError('Invalid value for Node#absoluteSize.')

            // XXX: We use Math.round because it's the same behavior as the CSS
            // engine when setting `px` values. Our WebGL items will be sized
            // the same way. Maybe we can abstract this by scaling things down
            // in the DOM, and upscaling our number values. For example, we can
            // apply a scale of 0.01 and then a size value of 1.56 would
            // actually mean 156px, etc.
            if (typeof newValue.x != 'undefined') this._properties.absoluteSize._x = Math.round(newValue.x)
            if (typeof newValue.y != 'undefined') this._properties.absoluteSize._y = Math.round(newValue.y)
            if (typeof newValue.z != 'undefined') this._properties.absoluteSize._z = Math.round(newValue.z)

            this.triggerEvent('propertychange', 'absoluteSize')
        }
        get absoluteSize() {
            return this._properties.absoluteSize
        }

        /**
         * Get the actual size of the Node. This can be useful when size is
         * proportional, as the actual size of the Node depends on the size of
         * it's parent.
         *
         * @readonly
         *
         * @return {Array.number} An Oject with x, y, and z properties, each
         * property representing the computed size of the x, y, and z axes
         * respectively.
         */
        get actualSize() {
            const {x,y,z} = this._calculatedSize
            return {x,y,z}
        }

        /**
         * Set the size of a Node proportional to the size of it's parent Node. The
         * values are a real number between 0 and 1 inclusive where 0 means 0% of
         * the parent size and 1 means 100% of the parent size.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis proportionalSize to apply.
         * @param {number} [newValue.y] The y-axis proportionalSize to apply.
         * @param {number} [newValue.z] The z-axis proportionalSize to apply.
         */
        set proportionalSize(newValue) {
            if (!(newValue instanceof Object))
                throw new TypeError('Invalid value for Node#proportionalSize.')

            if (typeof newValue.x != 'undefined') this._properties.proportionalSize._x = newValue.x
            if (typeof newValue.y != 'undefined') this._properties.proportionalSize._y = newValue.y
            if (typeof newValue.z != 'undefined') this._properties.proportionalSize._z = newValue.z

            this.triggerEvent('propertychange', 'proportionalSize')
        }
        get proportionalSize() {
            return this._properties.proportionalSize
        }

        /**
         * Set all properties of the Node in one method.
         *
         * XXX: Should we change size so it matches structure here and on the node?
         *
         * @param {Object} properties Properties object - see example
         *
         * @example
         * node.properties = {
         *   classes: ['open'],
         *   position: [200, 300, 0],
         *   rotation: [3, 0, 0],
         *   scale: [1, 1, 1],
         *   size: {
         *     mode: ['absolute', 'proportional'],
         *     absolute: [300, null],
         *     proportional: [null, .5]
         *   },
         *   opacity: .9
         * }
         */
        set properties (properties = {}) {
            // Classes
            // TODO: _el reference needs to be moved out.
            if (properties.classes)
                this._el.setClasses(properties.classes);

            // Size Modes
            if (properties.sizeMode)
                this.sizeMode = properties.sizeMode

            // Absolute Size
            if (properties.absoluteSize)
                this.absoluteSize = properties.absoluteSize

            // Proportional Size
            if (properties.proportionalSize)
                this.proportionalSize = properties.proportionalSize
        }
        // no need for a properties getter.
    }

    Object.defineProperty(Sizeable, Symbol.hasInstance, {
        value: function(obj) {
            if (this !== Sizeable) return Object.getPrototypeOf(Sizeable)[Symbol.hasInstance].call(this, obj)

            let currentProto = obj

            while (currentProto) {
                let desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                if (desc && desc.value && desc.value.hasOwnProperty(instanceofSymbol))
                    return true

                currentProto = Object.getPrototypeOf(currentProto)
            }

            return false
        }
    })

    Sizeable[instanceofSymbol] = true

    // for use by MotorHTML, convenient since HTMLElement attributes are all
    // converted to lowercase by default, so if we don't do this then we won't be
    // able to map attributes to Node setters as easily.
    //
    // TODO: move this call out of here, run it in a motor-specific class so
    // that Transformable and related classes are not necessarily
    // motor-scpecific and can be used anywhere.
    makeLowercaseSetterAliases(Sizeable.prototype)

    makeAccessorsEnumerable(Sizeable.prototype)

    return Sizeable
}

const Sizeable = SizeableMixin(class{})
Sizeable.mixin = SizeableMixin

export {Sizeable as default}
