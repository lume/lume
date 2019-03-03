import Class from 'lowclass'
import Mixin from './Mixin'
import Observable from './Observable'
import TreeNode from './TreeNode'
import XYZSizeModeValues from './XYZSizeModeValues'
import XYZNonNegativeValues from './XYZNonNegativeValues'
import Motor from './Motor'
import { props } from './props'

// working variables (used synchronously only, to avoid making new variables in
// repeatedly-called methods)
let propFunction = null

export default
Mixin(Base => {

    const Parent = Observable.mixin(TreeNode.mixin(Base))

    // Sizeable extends TreeNode because Sizeable knows about its `parent` when
    // calculating proportional sizes. Also Transformable knows about it's parent
    // in order to calculate it's world matrix based on it's parent's.
    const Sizeable = Class('Sizeable').extends( Parent, ({ Super }) => ({

        static: {
            props: {
                ...(Parent.props ? Parent.props : {}),
                size: props.XYZNonNegativeValues, // FIXME the whole app breaks on a negative value. Handle the error.
                sizeMode: props.XYZSizeModeValues,
            },
        },

        constructor(options = {}) {
            const self = Super(this).constructor(options)

            self._propertyFunctions = null
            self._calculatedSize = { x:0, y:0, z:0 }
            self._properties = self._props // alias to WithUpdate._props
            self._setDefaultProperties()
            self._setPropertyObservers()
            self.properties = options

            return self
        },

        _setDefaultProperties() {
            Object.assign(this._properties, {
                sizeMode: new XYZSizeModeValues('literal', 'literal', 'literal'),
                size:     new XYZNonNegativeValues(100, 100, 100),
            })
        },

        // TODO change all event values to objects. See here for reasoning:
        // https://github.com/airbnb/javascript#events
        _setPropertyObservers() {
            this._properties.sizeMode.on('valuechanged',
                () => this.trigger('propertychange', 'sizeMode'))
            this._properties.size.on('valuechanged',
                () => this.trigger('propertychange', 'size'))
        },

        updated(oldProps, oldState, modifiedProps) {
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

        _calcSize() {
            const calculatedSize = this._calculatedSize
            const previousSize = {...calculatedSize}
            const props = this._properties
            const parentSize = this._getParentSize()

            if (props.sizeMode.x == 'literal') {
                calculatedSize.x = props.size.x
            }
            else { // proportional
                calculatedSize.x = parentSize.x * props.size.x
            }

            if (props.sizeMode.y == 'literal') {
                calculatedSize.y = props.size.y
            }
            else { // proportional
                calculatedSize.y = parentSize.y * props.size.y
            }

            if (props.sizeMode.z == 'literal') {
                calculatedSize.z = props.size.z
            }
            else { // proportional
                calculatedSize.z = parentSize.z * props.size.z
            }

            if (
                previousSize.x !== calculatedSize.x
                || previousSize.y !== calculatedSize.y
                || previousSize.z !== calculatedSize.z
            ) {
                this.trigger('sizechange', {...calculatedSize})
            }
        },

        _getParentSize() {
            return this.parent ? this.parent._calculatedSize : {x:0,y:0,z:0}
        },

        _handleXYZPropertyFunction(fn, name) {
            if (!this._propertyFunctions) this._propertyFunctions = new Map

            if (propFunction = this._propertyFunctions.get(name)) {
                Motor.removeRenderTask(propFunction)
                propFunction = null
            }

            this._propertyFunctions.set(name,
                Motor.addRenderTask(time => {
                    const result = fn(
                        this._properties[name].x,
                        this._properties[name].y,
                        this._properties[name].z,
                        time
                    )

                    if (result === false) {
                        this._propertyFunctions.delete(name)
                        return false
                    }

                    // mark this true, so that the following set of this[name]
                    // doesn't override the prop function (normally a
                    // user can set this[name] to a value that isn't a function
                    // to disable the prop function).
                    this._settingValueFromPropFunction = true

                    this[name] = result
                })
            )
        },

        _handleSinglePropertyFunction(fn, name) {
            if (!this._propertyFunctions) this._propertyFunctions = new Map

            if (propFunction = this._propertyFunctions.get(name)) {
                Motor.removeRenderTask(propFunction)
                propFunction = null
            }

            this._propertyFunctions.set(name,
                Motor.addRenderTask(time => {
                    const result = fn(
                        this._properties[name],
                        time
                    )

                    if (result === false) {
                        this._propertyFunctions.delete(name)
                        return false
                    }

                    this._settingValueFromPropFunction = true
                    this[name] = result
                })
            )
        },

        // remove property function (render task) if any.
        _removePropertyFunction(name) {
            if (this._propertyFunctions && (propFunction = this._propertyFunctions.get(name))) {
                Motor.removeRenderTask(propFunction)
                this._propertyFunctions.delete(name)
                propFunction = null
            }
        },

        _setPropertyXYZ(Class, name, newValue) {
            if (typeof newValue === 'function') {
                this._handleXYZPropertyFunction(newValue, name)
            }
            else {
                if (!this._settingValueFromPropFunction) this._removePropertyFunction(name)
                else this._settingValueFromPropFunction = false

                Super(this)[name] = newValue
            }
        },

        _setPropertySingle(name, newValue) {
            if (typeof newValue === 'function') {
                this._handleSinglePropertyFunction(newValue, name)
            }
            else {
                if (!this._settingValueFromPropFunction) this._removePropertyFunction(name)
                else this._settingValueFromPropFunction = false

                Super(this)[name] = newValue
            }
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
            this._setPropertyXYZ(null, 'sizeMode', newValue)
        },
        get sizeMode() {
            return Super(this).sizeMode
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
            this._setPropertyXYZ(Sizeable, 'size', newValue)
        },
        get size() {
            return Super(this).size
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
            return {...this._calculatedSize}
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
    }))

    return Sizeable
})
