import { makeLowercaseSetterAliases } from './Utility'
import TreeNode from './TreeNode'
import XYZValues from './XYZValues'
import XYZNonNegativeValues from './XYZNonNegativeValues'
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
    // calculating proportional sizes. Also Transformable knows about it's parent
    // in order to calculate it's world matrix based on it's parent's.
    class Sizeable extends Observable.mixin(TreeNode.mixin(base)) {

        construct(options = {}) {
            super.construct(options)

            this._propertyFunctions = null
            this._calculatedSize = { x:0, y:0, z:0 }
            this._properties = {}
            this._setDefaultProperties()
            this._setPropertyObservers()
            this.properties = options
        }

        _setDefaultProperties() {
            Object.assign(this._properties, {
                sizeMode: new XYZValues('literal', 'literal', 'literal'),
                size:     new XYZNonNegativeValues(100, 100, 100),
            })
        }

        // TODO change all event values to objects. See here for reasoning:
        // https://github.com/airbnb/javascript#events
        _setPropertyObservers() {
            this._properties.sizeMode.on('valuechanged',
                () => this.triggerEvent('propertychange', 'sizeMode'))
            this._properties.size.on('valuechanged',
                () => this.triggerEvent('propertychange', 'size'))
        }

        _calcSize() {
            const calculatedSize = this._calculatedSize
            const previousSize = {...calculatedSize}
            const props = this._properties
            const parentSize = this._getParentSize()

            if (props.sizeMode._x == 'literal') {
                calculatedSize.x = props.size._x
            }
            else { // proportional
                calculatedSize.x = parentSize.x * props.size._x
            }

            if (props.sizeMode._y == 'literal') {
                calculatedSize.y = props.size._y
            }
            else { // proportional
                calculatedSize.y = parentSize.y * props.size._y
            }

            if (props.sizeMode._z == 'literal') {
                calculatedSize.z = props.size._z
            }
            else { // proportional
                calculatedSize.z = parentSize.z * props.size._z
            }

            if (
                previousSize.x !== calculatedSize.x
                || previousSize.y !== calculatedSize.y
                || previousSize.z !== calculatedSize.z
            ) {
                this.triggerEvent('sizechange', {...calculatedSize})
            }
        }

        _getParentSize() {
            return this._parent ? this._parent._calculatedSize : {x:0,y:0,z:0}
        }

        _setPropertyXYZ(Class, name, newValue) {
            if (newValue instanceof Array) {
                if (typeof newValue[0] != 'undefined') this._properties[name].x = newValue[0]
                if (typeof newValue[1] != 'undefined') this._properties[name].y = newValue[1]
                if (typeof newValue[2] != 'undefined') this._properties[name].z = newValue[2]
            }
            else if (typeof newValue == 'object') {
                if (typeof newValue.x != 'undefined') this._properties[name].x = newValue.x
                if (typeof newValue.y != 'undefined') this._properties[name].y = newValue.y
                if (typeof newValue.z != 'undefined') this._properties[name].z = newValue.z
            }
            else if (typeof newValue == 'function') {
                // remove previous task if any.
                if (!this._propertyFunctions) this._propertyFunctions = new Map

                if (this._propertyFunctions.has(name))
                    Motor.removeRenderTask(this._propertyFunctions.get(name))

                this._propertyFunctions.set(name,
                    Motor.addRenderTask(time => {
                        const result = newValue(
                            this._properties[name].x,
                            this._properties[name].y,
                            this._properties[name].z,
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
            else {
                throw new TypeError(`Invalid value for ${Class.name}#${name}.`)
            }
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

        _render() {
            // nothing yet, but needed because ImperativeBase calls
            // `super._render()`, which will call either Transformable's
            // _render or Sizeable's _render for Node and Scene classes,
            // respectively.
        }

        /**
         * Set the size mode for each axis. Possible size modes are "literal"
         * and "proportional". The default values are "literal" for all axes.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis sizeMode to apply. Default: `"literal"`
         * @param {number} [newValue.y] The y-axis sizeMode to apply. Default: `"literal"`
         * @param {number} [newValue.z] The z-axis sizeMode to apply. Default: `"literal"`
         */
        set sizeMode(newValue) {
            this._setPropertyXYZ(Sizeable, 'sizeMode', newValue)
        }
        get sizeMode() {
            return this._properties.sizeMode
        }

        // TODO: A "differential" size would be cool. Good for padding,
        // borders, etc. Inspired from Famous' differential sizing.
        //
        // TODO: A "target" size where sizing can be relative to another node.
        // This would be tricky though, because there could be circular size
        // dependencies. Maybe we'd throw an error in that case, because there'd be no original size to base off of.

        /**
         * Set the size of each axis. The size for each axis depends on the
         * sizeMode for each axis. For example, if node.sizeMode is set to
         * `sizeMode = ['literal', 'proportional', 'literal']`, then setting
         * `size = [20, 0.5, 30]` means that X size is a literal value of 20,
         * Y size is 0.5 of it's parent Y size, and Z size is a literal value
         * of 30. It is easy this way to mix literal and proportional sizes for
         * the different axes.
         *
         * Literal sizes can be any value (the literal size that you want) and
         * proportional sizes are a number between 0 and 1 representing a
         * proportion of the parent node size. 0 means 0% of the parent size,
         * and 1.0 means 100% of the parent size.
         *
         * All size values must be positive numbers.
         *
         * @param {Object} newValue
         * @param {number} [newValue.x] The x-axis size to apply.
         * @param {number} [newValue.y] The y-axis size to apply.
         * @param {number} [newValue.z] The z-axis size to apply.
         */
        set size(newValue) {
            this._setPropertyXYZ(Sizeable, 'size', newValue)
        }
        get size() {
            return this._properties.size
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
        get calculatedSize() {
            const {x,y,z} = this._calculatedSize
            return {x,y,z}
        }

        /**
         * Set all properties of a Sizeable in one method.
         *
         * @param {Object} properties Properties object - see example
         *
         * @example
         * node.properties = {
         *   sizeMode: {x:'literal', y:'proportional', z:'literal'},
         *   size: {x:300, y:0.2, z:200},
         * }
         */
        set properties(properties = {}) {
            if (properties.sizeMode)
                this.sizeMode = properties.sizeMode

            if (properties.size)
                this.size = properties.size
        }
        // no need for a properties getter?
        // TODO: maybe getting properties is a good way to serialize to JSON,
        // for people that might want that.
    }

    // for use by MotorHTML, convenient since HTMLElement attributes are all
    // converted to lowercase by default, so if we don't do this then we won't be
    // able to map attributes to Node setters as easily.
    makeLowercaseSetterAliases(Sizeable.prototype)

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

    return Sizeable
}

const Sizeable = SizeableMixin(class{})
Sizeable.mixin = SizeableMixin

export {Sizeable as default}
