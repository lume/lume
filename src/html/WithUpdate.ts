// forked from https://www.npmjs.com/package/skatejs v5.2.4
// MIT License: https://github.com/skatejs/skatejs/blob/412081535656416ac98b72e3f6088393729a86e5/LICENSE

import {Class, Mixin} from 'lowclass'
import {getInheritedDescriptor} from 'lowclass/utils'
import {dashCase, empty, keys, unique, pick} from './utils'

export function normalizeAttributeDefinition(name, prop) {
    const {attribute} = prop
    const obj = typeof attribute === 'object' ? {...attribute} : {source: attribute, target: attribute}
    if (obj.source === true) {
        obj.source = dashCase(name)
    }
    if (obj.target === true) {
        obj.target = dashCase(name)
    }
    return obj
}

function identity(v) {
    return v
}

export function normalizePropertyDefinition(name, prop) {
    const {coerce, default: def, deserialize, serialize} = prop
    return {
        attribute: normalizeAttributeDefinition(name, prop),
        coerce: coerce || identity,
        default: typeof def === 'function' ? def : () => def,
        deserialize: deserialize || identity,
        serialize: serialize || identity,
    }
}

const defaultTypesMap = new Map()

function defineProps(constructor) {
    if (constructor.hasOwnProperty('_propsNormalized')) return
    const {props} = constructor
    constructor._propNames = []
    keys(props).forEach(name => {
        let func = props[name] || props.any
        if (defaultTypesMap.has(func)) func = defaultTypesMap.get(func)
        if (typeof func !== 'function') func = prop(func)
        func({constructor}, name)
        constructor._propNames.push(name)
    })
}

function delay(fn) {
    if (window.Promise) {
        Promise.resolve().then(fn)
    } else {
        setTimeout(fn)
    }
}

export function prop(definition) {
    const propertyDefinition = definition || {}

    // Allows decorators, or imperative definitions.
    const func = function({constructor}, name) {
        const normalized = normalizePropertyDefinition(name, propertyDefinition)

        // Ensure that we can cache properties. We have to do this so the _props object literal doesn't modify parent
        // classes or share the instance anywhere where it's not intended to be shared explicitly in userland code.
        if (!constructor.hasOwnProperty('_propsNormalized')) {
            constructor._propsNormalized = {}
        }

        // Cache the value so we can reference when syncing the attribute to the property.
        constructor._propsNormalized[name] = normalized
        const {
            attribute: {source, target},
        } = normalized

        if (source) {
            constructor._observedAttributes.push(source)
            constructor._attributeToPropertyMap[source] = name
            if (source !== target) {
                constructor._attributeToAttributeMap[source] = target
            }
        }

        // the returned descriptor contains an "owner" property which is the
        // prototype object on which the descriptor was found.
        const existingDescriptor = getInheritedDescriptor(constructor.prototype, name)

        let existingDescriptorType
        let existingGetter
        let existingSetter

        // if the current constructor already inherits the prop accessor, we
        // don't need to re-define it.
        if (
            existingDescriptor &&
            existingDescriptor.owner.constructor &&
            existingDescriptor.owner.constructor._propsNormalized &&
            existingDescriptor.owner.constructor._propsNormalized[name]
        )
            return

        if (existingDescriptor) {
            if (!existingDescriptor.configurable) {
                console.error(
                    `Unable to create reactivity for prop "${name}" because existing descriptor is non-configurable.`
                )
                return
            }

            existingDescriptorType = 'value' in existingDescriptor ? 'data' : 'accessor'

            if (existingDescriptorType === 'data') {
                // in case there's existing properties on a contructor's prototype
                // before we overwrite the descriptor. we store those values in this
                // cache so we can use them as initial values.
                if (!constructor.__existingPrototypeValues) constructor.__existingPrototypeValues = {}

                constructor.__existingPrototypeValues[name] = existingDescriptor.value
            } else if (existingDescriptorType === 'accessor') {
                existingGetter = existingDescriptor.get
                existingSetter = existingDescriptor.set
            }
        } else {
            // if (name === 'texture') debugger

            // if there's no descriptor, we want to use the logic associaated
            // with data descriptors
            existingDescriptorType = 'data'
        }

        const newDescriptor = {
            enumerable: existingDescriptor ? existingDescriptor.enumerable : undefined,
            configurable: true,
            get: existingDescriptorType === 'accessor' && !existingGetter ? undefined : newGetter,
            set: existingDescriptorType === 'accessor' && !existingSetter ? undefined : newSetter,
        }

        Object.defineProperty(constructor.prototype, name, newDescriptor)

        function newGetter() {
            let val

            if (existingDescriptorType === 'accessor' && existingGetter) val = existingGetter.call(this)
            else if (existingDescriptorType === 'data') val = WithUpdateProtected(this)._props[name]

            if (val == null) {
                val = normalized.default.call(this, name)

                if (existingDescriptorType === 'accessor' && existingSetter) existingSetter.call(this, val)
                else if (existingDescriptorType === 'data') WithUpdateProtected(this)._props[name] = val
            }

            // if (name === 'texture') debugger
            return val
        }

        function newSetter(val) {
            const {
                attribute: {target},
                serialize,
                coerce,
            } = normalized

            if (target) {
                const serializedVal = serialize.call(this, val, name)

                if (serializedVal == null) {
                    this.removeAttribute(target)
                } else {
                    this.setAttribute(target, serializedVal)
                }
            }

            val = coerce.call(this, val, name)

            if (existingDescriptorType === 'accessor' && existingSetter) existingSetter.call(this, val)
            else if (existingDescriptorType === 'data') WithUpdateProtected(this)._props[name] = val

            WithUpdatePrivate(this).__modifiedProps[name] = true
            this.triggerUpdate()
        }
    }

    // Allows easy extension of pre-defined props, f.e. { ...props.number, default: 42 }.
    Object.keys(propertyDefinition).forEach(key => (func[key] = propertyDefinition[key]))

    return func
}

// TODO This class is currently unused. We'll see about refactoring to make
// _props private instead of protected, in which case this will be a protected
// read-only interface (_props) to the private cache (__props).
// const PropsReadonly = Class('PropsReadonly', ({ Private }) => ({
//     constructor(withUpdateInstance) {
//         this.__instance = withUpdateInstance
//
//         for (const prop in withUpdateInstance.constructor.props) {
//             Object.defineProperty(this, prop, {
//                 get: function get() {
//                     return WithUpdatePrivate(this).__props[prop]
//                 },
//             })
//         }
//
//         // Object.freeze(this)
//     },
// }))

let WithUpdatePrivate
let WithUpdateProtected

const Brand = {}

// function WithUpdateMixin<T extends Constructor>(Base: T/* = HTMLElement*/) {
function WithUpdateMixin<T extends typeof HTMLElement>(Base: T /* = HTMLElement*/) {
    const WithUpdate = Class('WithUpdate').extends(
        Base as typeof HTMLElement,
        ({Super, Protected, Private}) => (
            (WithUpdateProtected = Protected),
            (WithUpdatePrivate = Private),
            {
                static: {
                    _staticProps: undefined! as any,
                    _attributeToAttributeMap: undefined! as any,
                    _attributeToPropertyMap: undefined! as any,
                    _observedAttributes: undefined! as string[],

                    get props(): any {
                        if (!this._staticProps) this._staticProps = {}
                        return this._staticProps
                    },

                    set props(props: any) {
                        this._staticProps = props
                    },

                    get observedAttributes(): string[] {
                        // make sure to create a new instance of these static props per constructor.
                        // TODO TS why does it not work without (this as any) here?
                        if (!('_attributeToAttributeMap' in (this as any))) this._attributeToAttributeMap = {}
                        if (!('_attributeToPropertyMap' in (this as any))) this._attributeToPropertyMap = {}
                        if (!('_observedAttributes' in (this as any))) this._observedAttributes = []

                        // We have to define props here because observedAttributes are retrieved
                        // only once when the custom element is defined. If we did this only in
                        // the constructor, then props would not link to attributes.
                        defineProps(this)
                        return unique(this._observedAttributes.concat((Base as any).observedAttributes || []))
                    },
                },

                constructor(...args) {
                    const self = super(...args)

                    this.__prevProps = {}

                    // self._props extends from __existingPrototypeValues in case we
                    // overwrote a prototype property that had an existing value during
                    // definition of the props. This ensures we get the original
                    // prototype value when we read from a prop that we haven't set yet.
                    this._props = {
                        ...(self.constructor.__existingPrototypeValues || {}),
                        ...self.makeDefaultProps(),
                    }

                    // TODO (trusktr), I was thinking to make the protected _props
                    // readonly. Should it be private only (requires refactoring
                    // Sizeable and Transformable)? Or is convenient for subclasses to
                    // read from the cache? I'm leaning towards protected readonly.
                    // this._props = new PropsReadonly(self)

                    this.__modifiedProps = {}

                    return self
                },

                get props(): any {
                    return pick(this, keys((this as any).constructor.props))
                },

                set props(props: any) {
                    // const ctorProps = (this as any).constructor.props
                    keys(props).forEach(k => /*k in ctorProps && */ (this[k] = props[k]))
                },

                attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
                    // TODO TS this.constructor
                    const {
                        _attributeToAttributeMap,
                        _attributeToPropertyMap,
                        _propsNormalized,
                    } = (this as any).constructor

                    if (super.attributeChangedCallback) {
                        super.attributeChangedCallback(name, oldValue, newValue)
                    }

                    const propertyName = _attributeToPropertyMap[name]
                    if (propertyName) {
                        const propertyDefinition = _propsNormalized[propertyName]
                        if (propertyDefinition) {
                            const {default: defaultValue, deserialize} = propertyDefinition
                            const propertyValue = deserialize
                                ? deserialize.call(this, newValue, propertyName)
                                : newValue
                            this._props[propertyName] = propertyValue == null ? defaultValue.call(this) : propertyValue
                            this.__modifiedProps[propertyName] = true
                            this.triggerUpdate()
                        }
                    }

                    const targetAttributeName = _attributeToAttributeMap[name]
                    if (targetAttributeName) {
                        if (newValue == null) {
                            // TODO TS we specified above that T extends typeof HTMLElement.
                            // How can we make it know that removeAttribute exists?
                            this.removeAttribute(targetAttributeName)
                        } else {
                            this.setAttribute(targetAttributeName, newValue)
                        }
                    }
                },

                connectedCallback() {
                    if (super.connectedCallback) {
                        super.connectedCallback()
                    }
                    // TODO TS this.constructor
                    const propsList = this.constructor._propNames
                    for (let i = 0, l = propsList.length; i < l; i += 1) this.__modifiedProps[propsList[i]] = true
                    this.triggerUpdate()
                },

                shouldUpdate(_prevProps, _modifiedProps) {
                    return true
                },

                updating(_prevProps, _modifiedProps) {},

                updated(_prevProps, _modifiedProps) {},

                triggerUpdate() {
                    if (this.__updating) {
                        return
                    }
                    this.__updating = true
                    delay(() => {
                        const {__prevProps, __modifiedProps} = this
                        this.updating && this.updating(__prevProps, __modifiedProps)
                        this.updated &&
                            this.shouldUpdate(__prevProps, __modifiedProps) &&
                            this.updated(__prevProps, __modifiedProps)
                        this.__prevProps = this.props
                        const {_propNames} = this.constructor
                        for (let i = 0, l = _propNames.length; i < l; i += 1)
                            this.__modifiedProps[_propNames[i]] = false
                        this.__updating = false
                    })
                },

                triggerUpdateForProp(prop) {
                    this.__modifiedProps[prop] = true
                    this.triggerUpdate()
                },

                triggerUpdateForProps(props) {
                    for (const prop of props) this.__modifiedProps[prop] = true

                    this.triggerUpdate()
                },

                triggerUpdateForAllProps() {
                    const {_propNames} = this.constructor
                    _propNames && this.triggerUpdateForProps(_propNames)
                },

                // subclasses should extend this method and assign default props values
                // to the returned object.
                makeDefaultProps() {
                    return {}
                },
            }
        ),
        Brand
    )

    return WithUpdate as InstanceType<typeof WithUpdate>
}

const WithUpdate = Mixin(WithUpdateMixin)

export default WithUpdate

const {parse, stringify} = JSON
const attribute = Object.freeze({source: true})
const zeroOrNumber = val => (empty(val) ? 0 : Number(val))

const any = prop({
    attribute,
})

const array = prop({
    attribute,
    coerce: val => (Array.isArray(val) ? val : empty(val) ? null : [val]),
    default: Object.freeze([]),
    deserialize: parse,
    serialize: val => (val == null ? null : stringify(val)),
})

const boolean = prop({
    attribute,
    coerce: Boolean,
    default: false,
    deserialize: val => !empty(val),
    serialize: val => (val ? '' : null),
})

const number = prop({
    attribute,
    default: 0,
    coerce: zeroOrNumber,
    deserialize: zeroOrNumber,
    serialize: val => (empty(val) ? null : String(Number(val))),
})

const object = prop({
    attribute,
    default: Object.freeze({}),
    deserialize: parse,
    serialize: val => (val == null ? null : stringify(val)),
})

const string = prop({
    attribute,
    default: '',
    coerce: val => (empty(val) ? '' : String(val)),
    // coerce: (v, n) => {if (n === 'texture') debugger; return String(v)},
    serialize: val => (empty(val) ? null : String(val)),
})

defaultTypesMap.set(Array, array)
defaultTypesMap.set(Boolean, boolean)
defaultTypesMap.set(Number, number)
defaultTypesMap.set(Object, object)
defaultTypesMap.set(String, string)

export const props = {
    any,
    array,
    boolean,
    number,
    object,
    string,
}
