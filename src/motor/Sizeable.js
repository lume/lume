import { makeLowercaseSetterAliases, makeAccessorsEnumerable } from './Utility'
import TreeNode from './TreeNode'
import XYZValues from './XYZValues'
import Observable from './Observable'
import Motor from './Motor'

// fallback to experimental CSS transform if browser doesn't have it (fix for Safari 9)
if (typeof document.createElement('div').style.transform == 'undefined') {
    Object.defineProperty(CSSStyleDeclaration.prototype, 'transform', {
        set(value) {
            this.webkitTransform = value
        },
        get() {
            return this.webkitTransform
        },
        enumerable: true,
    })
}

const instanceofSymbol = Symbol('instanceofSymbol')

const SizeableMixin = base => {

    // Sizeable extends TreeNode because Sizeable knows about its _parent when
    // calculating proportionalSize.
    class Sizeable extends TreeNode.mixin(Observable.mixin(base)) {

        constructor(options = {}) {
            super(options)

            this._propertyFunctions = null
            this._calculatedSize = { x:0, y:0, z:0 }
            this._properties = {}
            this._setDefaultProperties()
            this._setPropertyObservers()
            this.properties = options
        }

        _setDefaultProperties() {
            Object.assign(this._properties, {
                sizeMode:         new XYZValues('absolute', 'absolute', 'absolute'),
                absoluteSize:     new XYZValues(0, 0, 0),
                proportionalSize: new XYZValues(1, 1, 1),
            })
        }

        _setPropertyObservers() {
            this._properties.sizeMode.on('valuechanged',
                () => this.triggerEvent('propertychange', 'sizeMode'))
            this._properties.absoluteSize.on('valuechanged',
                () => this.triggerEvent('propertychange', 'absoluteSize'))
            this._properties.proportionalSize.on('valuechanged',
                () => this.triggerEvent('propertychange', 'proportionalSize'))
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
            this._setPropertyXYZ(Sizeable, 'sizeMode', newValue)
        }
        get sizeMode() {
            return this._properties.sizeMode
        }

        _calcSize() {
            const calculatedSize = this._calculatedSize
            const {...previousSize} = calculatedSize
            const props = this._properties
            const parentSize = this._getParentSize()

            if (props.sizeMode._x == 'absolute') {
                calculatedSize.x = props.absoluteSize._x
            }
            else { // proportional
                calculatedSize.x = parentSize.x * props.proportionalSize._x
            }

            if (props.sizeMode._y == 'absolute') {
                calculatedSize.y = props.absoluteSize._y
            }
            else { // proportional
                calculatedSize.y = parentSize.y * props.proportionalSize._y
            }

            if (props.sizeMode._z == 'absolute') {
                calculatedSize.z = props.absoluteSize._z
            }
            else { // proportional
                calculatedSize.z = parentSize.z * props.proportionalSize._z
            }

            if (
                previousSize.x !== calculatedSize.x
                || previousSize.y !== calculatedSize.y
                || previousSize.z !== calculatedSize.z
            ) {
                this.triggerEvent('sizechange', Object.assign({}, calculatedSize))
            }
        }

        _getParentSize() {
            return this._parent ? this._parent._calculatedSize : {x:0,y:0,z:0}
        }

        /**
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis absoluteSize to apply.
         * @param {number} [newValue.y] The y-axis absoluteSize to apply.
         * @param {number} [newValue.z] The z-axis absoluteSize to apply.
         */
        set absoluteSize(newValue) {
            this._setPropertyXYZ(Sizeable, 'absoluteSize', newValue)
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
            this._setPropertyXYZ(Sizeable, 'proportionalSize', newValue)
        }
        get proportionalSize() {
            return this._properties.proportionalSize
        }

        /**
         * Set all properties of a Sizeable in one method.
         *
         * @param {Object} properties Properties object - see example
         *
         * @example
         * node.properties = {
         *   sizeMode: {x:'absolute', y:'proportional', z:'absolute'},
         *   absoluteSize: {x:300, y:100, z:200},
         *   proportionalSize: {x:1, z:0.5}
         * }
         */
        set properties (properties = {}) {
            if (properties.sizeMode)
                this.sizeMode = properties.sizeMode

            if (properties.absoluteSize)
                this.absoluteSize = properties.absoluteSize

            if (properties.proportionalSize)
                this.proportionalSize = properties.proportionalSize
        }
        // no need for a properties getter.

        _setPropertyXYZ(Class, name, newValue) {
            if (!(
                newValue instanceof Object ||
                newValue instanceof Array ||
                newValue instanceof Function
            )) {
                throw new TypeError(`Invalid value for ${Class.name}#${name}.`)
            }

            let change = false

            if (newValue instanceof Function) {
                // remove previous task if any.
                if (!this._propertyFunctions) this._propertyFunctions = new Map

                if (this._propertyFunctions.has(name))
                    Motor.removeRenderTask(this._propertyFunctions.get(name))

                this._propertyFunctions.set(name,
                    Motor.addRenderTask(time => {
                        const result = newValue(
                            this._properties[name]._x,
                            this._properties[name]._y,
                            this._properties[name]._z,
                            time
                        )

                        if (result === false) {
                            this._propertyFunctions.delete(name)
                            return false
                        }

                        this[name] = result
                    })
                )
            }
            else if (newValue instanceof Array) {
                if (typeof newValue[0] != 'undefined') { this._properties[name]._x = newValue[0]; change = true }
                if (typeof newValue[1] != 'undefined') { this._properties[name]._y = newValue[1]; change = true }
                if (typeof newValue[2] != 'undefined') { this._properties[name]._z = newValue[2]; change = true }
            }
            else {
                if (typeof newValue.x != 'undefined') { this._properties[name]._x = newValue.x; change = true }
                if (typeof newValue.y != 'undefined') { this._properties[name]._y = newValue.y; change = true }
                if (typeof newValue.z != 'undefined') { this._properties[name]._z = newValue.z; change = true }
            }

            if (change) this.triggerEvent('propertychange', name)
        }

        _setPropertySingle(Class, name, newValue, type) {
            if (!(typeof newValue == type || newValue instanceof Function))
                throw new TypeError(`Invalid value for ${Class.name}#${name}.`)

            if (newValue instanceof Function) {
                // remove previous task if any.
                Motor.addRenderTask(time => {
                    const result = newValue(
                        this._properties[name],
                        time
                    )

                    if (result === false) return false

                    this[name] = result
                })
            }
            else {
                this._properties[name] = newValue
                this.triggerEvent('propertychange', name)
            }
        }
    }

    Object.defineProperty(Sizeable, Symbol.hasInstance, {
        value: function(obj) {
            if (this !== Sizeable) return Object.getPrototypeOf(Sizeable)[Symbol.hasInstance].call(this, obj)

            let currentProto = obj

            while (currentProto) {
                const desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

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
    makeLowercaseSetterAliases(Sizeable.prototype)

    makeAccessorsEnumerable(Sizeable.prototype)

    return Sizeable
}

const Sizeable = SizeableMixin(class{})
Sizeable.mixin = SizeableMixin

export {Sizeable as default}
