import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'
import Observable from './Observable'
import TreeNode from './TreeNode'
import XYZSizeModeValues from './XYZSizeModeValues'
import XYZNonNegativeValues from './XYZNonNegativeValues'
import Motor from './Motor'
import { props } from './props'

// working variables (used synchronously only, to avoid making new variables in
// repeatedly-called methods)
let propFunction = null

const Brand = {}

export default
Mixin(Base => {

    const Parent = Observable.mixin(TreeNode.mixin(Base))

    // Sizeable extends TreeNode because Sizeable knows about its `parent` when
    // calculating proportional sizes. Also Transformable knows about it's parent
    // in order to calculate it's world matrix based on it's parent's.
    const Sizeable = Class('Sizeable').extends( Parent, ({ Super, Public, Protected, Private }) => ({

        static: {
            props: {
                ...(Parent.props ? Parent.props : {}),
                size: props.XYZNonNegativeValues, // FIXME the whole app breaks on a negative value. Handle the error.
                sizeMode: props.XYZSizeModeValues,
            },
        },

        constructor(options = {}) {
            const self = Super(this).constructor(options)

            Private(self).__calculatedSize = { x:0, y:0, z:0 }
            Protected(self)._properties = Protected(self)._props // alias to WithUpdate._props
            Protected(self)._setPropertyObservers()
            self.properties = options

            return self
        },

        updated(oldProps, modifiedProps) {
            if (!this.isConnected) return

            // this covers single-valued properties like opacity, but has the
            // sideeffect of trigger propertychange more than needed for
            // XYZValues (here, and in the above valuechanged handlers).
            //
            // TODO FIXME we want to batch Observable updates so that this doesn't
            // happen. Maybe we'll do it by batching events that have the same
            // name. We should make it possible to choose to have sync or async
            // events, and whether they should batch or not.
            for (const [prop, modified] of Object.entries(modifiedProps))
                if (modified) this.trigger('propertychange', prop)
        },

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
            if (typeof newValue === 'function')
                throw new TypeError('property functions are not allowed for sizeMode')
            Protected(this)._setPropertyXYZ(null, 'sizeMode', newValue)
        },
        get sizeMode() {
            return Protected(this)._props.sizeMode
        },

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
            Protected(this)._setPropertyXYZ(Sizeable, 'size', newValue)
        },
        get size() {
            return Protected(this)._props.size
        },

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
            return {...Private(this).__calculatedSize}
        },

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
        set properties(properties) {
            this.props = properties
        },
        get properties() {
            return this.props
        },

        makeDefaultProps() {
            return Object.assign(Super(this).makeDefaultProps(), {
                sizeMode: new XYZSizeModeValues('literal', 'literal', 'literal'),
                size:     new XYZNonNegativeValues(100, 100, 100),
            })
        },

        protected: {
            // TODO change all event values to objects. See here for reasoning:
            // https://github.com/airbnb/javascript#events
            _setPropertyObservers() {
                Protected(this)._properties.sizeMode.on('valuechanged',
                    () => Public(this).trigger('propertychange', 'sizeMode'))
                Protected(this)._properties.size.on('valuechanged',
                    () => Public(this).trigger('propertychange', 'size'))
            },

            _getParentSize() {
                const parent = Public(this).parent
                return parent ? Private(parent).__calculatedSize : {x:0,y:0,z:0}
            },

            _calcSize: (function() {
                const previousSize = {}

                return function _calcSize() {
                    const calculatedSize = Private(this).__calculatedSize
                    Object.assign(previousSize, calculatedSize)
                    const {sizeMode, size} = Protected(this)._properties
                    const parentSize = this._getParentSize()

                    if (sizeMode.x == 'literal') {
                        calculatedSize.x = size.x
                    }
                    else { // proportional
                        calculatedSize.x = parentSize.x * size.x
                    }

                    if (sizeMode.y == 'literal') {
                        calculatedSize.y = size.y
                    }
                    else { // proportional
                        calculatedSize.y = parentSize.y * size.y
                    }

                    if (sizeMode.z == 'literal') {
                        calculatedSize.z = size.z
                    }
                    else { // proportional
                        calculatedSize.z = parentSize.z * size.z
                    }

                    if (
                        previousSize.x !== calculatedSize.x
                        || previousSize.y !== calculatedSize.y
                        || previousSize.z !== calculatedSize.z
                    ) {
                        Public(this).trigger('sizechange', {...calculatedSize})
                    }
                }
            })(),

            _setPropertyXYZ(Class, name, newValue) {
                if (typeof newValue === 'function') {
                    Private(this).__handleXYZPropertyFunction(newValue, name)
                }
                else {
                    if (!Private(this).__settingValueFromPropFunction) Private(this).__removePropertyFunction(name)
                    else Private(this).__settingValueFromPropFunction = false

                    Protected(this)._props[name] = newValue
                }
            },

            _setPropertySingle(name, newValue) {
                if (typeof newValue === 'function') {
                    Private(this).__handleSinglePropertyFunction(newValue, name)
                }
                else {
                    if (!Private(this).__settingValueFromPropFunction) Private(this).__removePropertyFunction(name)
                    else Private(this).__settingValueFromPropFunction = false

                    Protected(this)._props[name] = newValue
                }
            },
        },

        private: {
            __calculatedSize: null, // {x: number, y: number, z: number}
            __propertyFunctions: null,
            __settingValueFromPropFunction: false,

            __handleXYZPropertyFunction(fn, name) {
                if (!this.__propertyFunctions) this.__propertyFunctions = new Map

                if (propFunction = this.__propertyFunctions.get(name)) {
                    Motor.removeRenderTask(propFunction)
                    propFunction = null
                }

                this.__propertyFunctions.set(name,
                    Motor.addRenderTask(time => {
                        const result = fn(
                            Protected(this)._properties[name].x,
                            Protected(this)._properties[name].y,
                            Protected(this)._properties[name].z,
                            time
                        )

                        if (result === false) {
                            this.__propertyFunctions.delete(name)
                            return false
                        }

                        // mark this true, so that the following set of this[name]
                        // doesn't override the prop function (normally a
                        // user can set this[name] to a value that isn't a function
                        // to disable the prop function).
                        this.__settingValueFromPropFunction = true

                        Public(this)[name] = result
                    })
                )
            },

            __handleSinglePropertyFunction(fn, name) {
                if (!this.__propertyFunctions) this.__propertyFunctions = new Map

                if (propFunction = this.__propertyFunctions.get(name)) {
                    Motor.removeRenderTask(propFunction)
                    propFunction = null
                }

                this.__propertyFunctions.set(name,
                    Motor.addRenderTask(time => {
                        const result = fn(
                            Protected(this)._properties[name],
                            time
                        )

                        if (result === false) {
                            this.__propertyFunctions.delete(name)
                            return false
                        }

                        this.__settingValueFromPropFunction = true
                        this[name] = result
                    })
                )
            },

            // remove property function (render task) if any.
            __removePropertyFunction(name) {
                if (this.__propertyFunctions && (propFunction = this.__propertyFunctions.get(name))) {
                    Motor.removeRenderTask(propFunction)
                    this.__propertyFunctions.delete(name)
                    propFunction = null
                }
            },
        },

    }), Brand)

    return Sizeable
})
