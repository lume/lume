// forked from https://www.npmjs.com/package/skatejs v5.2.4
// MIT License: https://github.com/skatejs/skatejs/blob/412081535656416ac98b72e3f6088393729a86e5/LICENSE

import {Mixin, getInheritedDescriptor, MixinResult, Constructor} from 'lowclass'
import {dashCase, empty, identity, delay, singleLine} from './utils'

export interface PossibleCustomElement extends HTMLElement {
    connectedCallback?(): void
    disconnectedCallback?(): void
    adoptedCallback?(): void
    attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void
}

export interface PossibleCustomElementConstructor extends Constructor<HTMLElement> {
    observedAttributes?: string[]
}

export type Props = Record<string, PropDefinition> | Array<string>

export function WithUpdateMixin<T extends Constructor<HTMLElement>>(Base: T) {
    const Parent = Constructor<PossibleCustomElement, PossibleCustomElementConstructor>(Base)

    class WithUpdate extends Parent {
        // TODO better type.
        static props: Props = {}

        // prettier-ignore
        // @ts-ignore: unused private var is actually used by the prop() implementation
        private static __hasWithUpdate
            :true = true

        // prettier-ignore
        // @ts-ignore: unused private var is actually used by the prop() implementation
        private static __propNames
            :string[] = []

        // prettier-ignore
        // @ts-ignore: unused private var is actually used by the prop() implementation
        private static __propToAttributeMap
            :any = {}

        // prettier-ignore
        // @ts-ignore: unused private var is actually used by the prop() implementation
        private static _attributeToPropertyMap
            :any = {}

        // prettier-ignore
        // @ts-ignore: unused private var is actually used by the prop() implementation
        private static _propsNormalized
            :Record<string, NormalizedPropDefinition> = {}

        private static _observedAttributes: any = []

        static get observedAttributes(): string[] {
            // We have to define props here because observedAttributes are retrieved
            // only once when the custom element is defined. If we did this only in
            // the constructor, then props would not link to attributes.
            reactive(this)

            return this._observedAttributes.concat(super.observedAttributes || [])
        }

        private __modifiedProps?: any
        protected _props?: any

        // a jquery-like interfae for querying (grand)children could be cool.
        // $?: any
        // scene.$('.car')

        constructor(...args: any[]) {
            super(...args)

            // this._props extends from __existingPrototypeValues in case we
            // overwrote a prototype property that had an existing value during
            // definition of the props. This ensures we get the original
            // prototype value when we read from a prop that we haven't set yet.
            this._props = {
                ...((this.constructor as any).__existingPrototypeValues || {}),
                ...this.makeDefaultProps(),
            }

            // TODO (trusktr), I was thinking to make the protected _props
            // readonly. Should it be private only (requires refactoring
            // Sizeable and Transformable)? Or is convenient for subclasses to
            // read from the cache? I'm leaning towards protected readonly.
            // Protected(this)._props = new PropsReadonly(this)

            this.__modifiedProps = {}
        }

        attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
            const {__propToAttributeMap, _attributeToPropertyMap, _propsNormalized} = this.constructor as any

            if (super.attributeChangedCallback) {
                super.attributeChangedCallback(name, oldValue, newValue)
            }

            const propertyName = _attributeToPropertyMap[name]
            if (propertyName) {
                const propertyDefinition: NormalizedPropDefinition = _propsNormalized[propertyName] // TODO TS NormalizedPropDefinition type
                if (propertyDefinition) {
                    const {default: defaultValue, deserialize} = propertyDefinition
                    const propertyValue =
                        deserialize && newValue !== null ? deserialize.call(this, newValue, propertyName) : newValue
                    this._props[propertyName] =
                        propertyValue == null ? defaultValue.call(this, propertyName) : propertyValue
                    this.__modifiedProps[propertyName] = true
                    this.triggerUpdate()
                }
            }

            const targetAttribute = __propToAttributeMap[name]
            if (targetAttribute) {
                if (newValue == null) {
                    this.removeAttribute(targetAttribute)
                } else {
                    this.setAttribute(targetAttribute, newValue)
                }
            }
        }

        connectedCallback() {
            if (super.connectedCallback) {
                super.connectedCallback()
            }
            const propsList = (this.constructor as any).__propNames
            for (let i = 0, l = propsList.length; i < l; i += 1) this.__modifiedProps[propsList[i]] = true
            this.triggerUpdate()
        }

        /**
         * If a subclass implements this, then we only call `updated()` is
         * shouldUpdate returns true. If a subclass doesn't implement it, we
         * assume that `update()` should be called.
         */
        shouldUpdate?(modifiedProps: any): boolean

        updating?(modifiedProps: any): void
        updated?(modifiedProps: any): void

        private __updating?: boolean

        triggerUpdate() {
            if (this.__updating) {
                return
            }
            this.__updating = true
            delay(() => {
                const {__modifiedProps} = this
                if (this.updating) {
                    this.updating(__modifiedProps)
                }
                if (this.updated && (!this.shouldUpdate || (this.shouldUpdate && this.shouldUpdate(__modifiedProps)))) {
                    this.updated(__modifiedProps)
                }
                const {__propNames} = this.constructor as any
                for (let i = 0, l = __propNames.length; i < l; i += 1) this.__modifiedProps[__propNames[i]] = false
                this.__updating = false
            })
        }

        triggerUpdateForProp(prop: string) {
            this.__modifiedProps[prop] = true
            this.triggerUpdate()
        }

        triggerUpdateForProps(props: string[]) {
            for (const prop of props) this.__modifiedProps[prop] = true

            this.triggerUpdate()
        }

        triggerUpdateForAllProps() {
            const {__propNames} = this.constructor as any
            __propNames && this.triggerUpdateForProps(__propNames)
        }

        // subclasses should extend this method and assign default props values
        // to the returned object.
        makeDefaultProps() {
            return {}
        }
    }

    return WithUpdate as MixinResult<typeof WithUpdate, T>
}

export const WithUpdate = Mixin(WithUpdateMixin)
export interface WithUpdate extends InstanceType<typeof WithUpdate> {}
export default WithUpdate

// const w: WithUpdate = new WithUpdate()
// w.innerHTML = 123
// w.innerHTML = 'asdf'
// w.asdfasdf = 123
// w.setAttribute
// w.setAttribute('asdfasf', 123123)
// w.updating && w.updating()

type AttributeDefinition =
    | string // manually supply the name of the corresponding attribute
    | boolean // or if true, then the attribute defaults to dash-case of the prop name with no reflection, and if false then there's no attribute.
    | undefined // same as 'true'
    | {
          source?: string
          reflect?: boolean
      }

type NormalizedAttributeDefinition =
    | false
    | {
          source: string
          reflect: boolean
      }

export type PropDefinitionObject<T = any> = {
    attribute?: AttributeDefinition
    coerce?<This>(this: This, val: any, propName: string): T
    default?: T | (<This>(this: This, propName: string) => T)
    deserialize?<This>(this: This, val: string, propName: string): T
    serialize?<This>(this: This, val: any, propName: string): string | null
}

export type PropDefinition<T = any> = PropDefinitionObject<T> | Constructor<T> | PropDecorator

type NormalizedPropDefinition<T = any> = {
    attribute: NormalizedAttributeDefinition
    coerce<This>(this: This, val: any, propName: string): T
    default<This>(this: This, propName: string): T
    deserialize<This>(this: This, val: string, propName: string): T
    serialize<This>(this: This, val: any, propName: string): string | null
}

function normalizeAttributeDefinition(name: string, attribute: AttributeDefinition): NormalizedAttributeDefinition {
    if (attribute === undefined || attribute === true) {
        return {
            source: dashCase(name),
            reflect: false,
        }
    }

    if (typeof attribute === 'object') {
        return {
            source: attribute.source ? attribute.source : dashCase(name),
            reflect: attribute.reflect === true ? true : false,
        }
    }

    if (typeof attribute === 'string') {
        return {
            source: attribute,
            reflect: false,
        }
    }

    return false
}

export function normalizePropertyDefinition(name: string, prop: any): NormalizedPropDefinition {
    const {attribute, coerce, default: def, deserialize, serialize} = prop

    return {
        attribute: normalizeAttributeDefinition(name, attribute),
        coerce: coerce || identity,
        default: typeof def === 'function' ? def : () => def,
        deserialize: deserialize || identity,
        serialize: serialize || identity,
    }
}

type PropDecorator = PropertyDecorator & PropDefinitionObject

const defaultTypesMap = new Map<Constructor, PropDecorator>()

type WithUpdateClass = Omit<typeof WithUpdate, 'mixin'>

function reactive<T extends WithUpdateClass>(constructor: T): T {
    if (!(constructor as any).__hasWithUpdate)
        throw new TypeError('The @reactive decorator should be called on a class that extends from WithUpdate')

    // TODO TS no any
    let ctors: any[] = []

    for (
        let currentConstructor = constructor;
        currentConstructor;
        currentConstructor = Object.getPrototypeOf(currentConstructor)
    ) {
        ctors.unshift(currentConstructor)
    }

    // make props reactive starting from the base-most class
    for (let i = 0, l = ctors.length; i < l; i += 1) {
        makePropsReactive(ctors[i])
    }

    return constructor
}

function makePropsReactive<T extends WithUpdateClass>(constructor: T) {
    // return early if there's no props to make reactiveb
    if (!constructor.hasOwnProperty('props')) return

    // return early if props have already been made reactive on the current constructor
    if (constructor.hasOwnProperty('__propNames')) return

    const {props: propDefinitions} = constructor

    const propsToMakeReactive = Array.isArray(propDefinitions) ? propDefinitions : Object.keys(propDefinitions)

    let name: string = ''

    for (let i = 0, l = propsToMakeReactive.length; i < l; i += 1) {
        name = propsToMakeReactive[i]

        let decorator: PropertyDecorator | PropDefinition | Constructor

        if (!Array.isArray(propDefinitions)) decorator = propDefinitions[name] || props.any
        else decorator = props.any

        if (defaultTypesMap.has(decorator as Constructor)) decorator = defaultTypesMap.get(decorator as Constructor)!

        if (typeof decorator !== 'function') decorator = prop(decorator)

        // We must have a PropertyDecorator at this point.
        const _decorator = decorator as PropertyDecorator

        // The decorator is assumed to be used only on non-static instance
        // properties, and in that case it is passed the class prototype.
        _decorator(constructor.prototype, name)
    }
}

export function prop(definition: PropDefinition = {}) {
    let decorator: PropDecorator

    // f.e. if definition is `String`, `Number`, etc.
    if (typeof definition === 'function' && defaultTypesMap.has(definition as any)) {
        decorator = defaultTypesMap.get(definition as Constructor)!
    }

    // Allows decorators, or imperative definitions.
    else {
        // we know better than TS here, definition must be a prop defition object
        const def = definition as PropDefinitionObject

        const _decorator: PropertyDecorator = function WithUpdatePropertyDecorator(prototype: any, name: PropertyKey) {
            // we only work with string properties, at least for now.
            if (typeof name !== 'string') return

            const {constructor} = prototype

            if (!constructor.__hasWithUpdate)
                throw new TypeError('The @prop() decorator should be used on a class that extends from WithUpdate.')

            // the returned descriptor contains an "owner" property which is the
            // prototype object on which the descriptor was found.
            const existingDescriptor = getInheritedDescriptor(prototype, name)

            const {__propNames: existingProps} = constructor

            if (existingProps.includes(name)) {
                const Owner = existingDescriptor && existingDescriptor.owner.constructor

                // @prune-prod
                console.warn(
                    singleLine(`
                        Warning: Overriding property "${name}" from super
                        class "${Owner.name}" in class "${constructor.name}".
                    `)
                )
            }

            const normalized = normalizePropertyDefinition(name, def)

            if (!constructor.hasOwnProperty('_propsNormalized'))
                constructor._propsNormalized = Object.create(constructor._propsNormalized || null)

            // Cache the value so we can reference when syncing the attribute to the property.
            constructor._propsNormalized[name] = normalized

            const {attribute} = normalized

            if (attribute) {
                const {source, reflect} = attribute
                // we need to create one per constructor, otherwise the base
                // WithUpdate class will accumulate values for all subclasses that
                // define props, which means all subclasses will have the same set
                // of reactive props, but each subclass should have its own
                // specified set (including any that are inherited but not from
                // sibling classes)
                if (!constructor.hasOwnProperty('_observedAttributes'))
                    constructor._observedAttributes = [...(constructor._observedAttributes || [])]

                if (!constructor._observedAttributes.includes(source)) constructor._observedAttributes.push(source)

                if (!constructor.hasOwnProperty('_attributeToPropertyMap'))
                    constructor._attributeToPropertyMap = Object.create(constructor._attributeToPropertyMap || null)

                constructor._attributeToPropertyMap[source] = name

                if (reflect) {
                    if (!constructor.hasOwnProperty('__propToAttributeMap'))
                        constructor.__propToAttributeMap = Object.create(constructor.__propToAttributeMap || null)

                    constructor.__propToAttributeMap[name] = source
                }
            }

            let existingDescriptorType: any
            let existingGetter: any
            let existingSetter: any

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
                // if there's no descriptor, we want to use the logic associaated
                // with data descriptors
                existingDescriptorType = 'data'
            }

            // although WithUpdate already defines a static __propNames, we need to
            // define it on any subclass so that there is a list of reactive
            // properties per subclass. If we don't do this, then WithUpdate will
            // accumulate the names of reactive properties for all subclasses,
            // meaning that subclasses will effectively contain the property names
            // of all their sibling classes, which we don't want.
            if (!constructor.hasOwnProperty('__propNames'))
                constructor.__propNames = [...(constructor.__propNames || [])]

            if (!constructor.__propNames.includes(name)) constructor.__propNames.push(name)

            const newDescriptor = {
                enumerable: existingDescriptor ? existingDescriptor.enumerable : undefined,
                configurable: true,
                get: existingDescriptorType === 'accessor' && !existingGetter ? undefined : newGetter,
                set: existingDescriptorType === 'accessor' && !existingSetter ? undefined : newSetter,
            }

            Object.defineProperty(prototype, name, newDescriptor)

            // trick: tells TypeScript that name is a string inside the following functions
            const _name = name

            function newGetter(this: any) {
                let val: any

                if (existingDescriptorType === 'accessor' && existingGetter) val = existingGetter.call(this)
                else if (existingDescriptorType === 'data') val = this._props[_name]

                if (val == null) {
                    val = normalized.default.call(this, _name)

                    if (existingDescriptorType === 'accessor' && existingSetter) existingSetter.call(this, val)
                    else if (existingDescriptorType === 'data') this._props[_name] = val
                }

                return val
            }

            function newSetter(this: any, val: any) {
                const {attribute, serialize, coerce} = normalized

                if (attribute && attribute.reflect) {
                    const serializedVal = serialize.call(this, val, _name)

                    if (serializedVal == null) {
                        this.removeAttribute(attribute.source)
                    } else {
                        this.setAttribute(attribute.source, serializedVal)
                    }
                }

                val = coerce.call(this, val, _name)

                if (existingDescriptorType === 'accessor' && existingSetter) existingSetter.call(this, val)
                else if (existingDescriptorType === 'data') this._props[_name] = val

                this.__modifiedProps[_name] = true
                this.triggerUpdate()
            }
        }

        // Allows easy extension of pre-defined props, f.e.
        // static props: Props = {
        //   foo: { ...props.number, default: 42 }
        // }
        decorator = Object.assign(_decorator, def)
    }

    return decorator
}

const {parse: _parse, stringify} = JSON
const parse = (txt: string) => _parse(txt)
const attribute = true
const zeroOrNumber = (val: any) => (empty(val) ? 0 : Number(val))

const any = prop({
    attribute,
})

const array = prop({
    attribute,
    coerce: (val: any) => (Array.isArray(val) ? val : empty(val) ? null : [val]),
    default: Object.freeze([]),
    deserialize: parse,
    serialize: (val: any) => (val == null ? null : stringify(val)),
})

const boolean = prop({
    attribute,
    coerce: Boolean,
    default: false,
    deserialize: (val: any) => !empty(val),
    serialize: (val: any) => (val ? '' : null),
})

const number = prop({
    attribute,
    default: 0,
    coerce: zeroOrNumber,
    deserialize: zeroOrNumber,
    serialize: (val: any) => (empty(val) ? null : String(Number(val))),
})

const object = prop({
    attribute,
    default: Object.freeze({}),
    deserialize: parse,
    serialize: (val: any) => (val == null ? null : stringify(val)),
})

const string = prop({
    attribute,
    default: '',
    coerce: (val: any) => (empty(val) ? '' : String(val)),
    serialize: (val: any) => (empty(val) ? null : String(val)),
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
