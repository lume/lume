import {createSignal, createEffect} from 'solid-js'
import {render} from 'solid-js/dom'
import {Constructor, Mixin, MixinResult} from 'lowclass'
import {HTMLAttributes, DetailedHTMLProps} from 'react'
import createEmotion, {Emotion} from 'create-emotion'
import {defer} from './Utility'

/////////////////////////////////////////////////////////////////////////////////
////////////////// BEGIN EXAMPLES {{
/////////////////////////////////////////////////////////////////////////////////

/**
 * An example that shows how to make a basic DOM element with a reactive
 * variable, that causes the DOM to be updated when its value changes. The
 * example shows how to dynamically update both an attribute and the text
 * content of an element.
 *
 * @example
 * import {variable} from "./Component"
 * import {div, section} from './element-type-helpers' // These are for casting JSX to certain DOM types, not needed in plain JS.
 *
 * const count = variable(0)
 *
 * setInterval(() => count(count() + 1), 1000)
 *
 * // prettier-ignore
 * const test = div(
 *   <div>
 *     <h1 data-count={(count())}>The count is: {(count())}</h1>
 *   </div>
 * )
 *
 * document.querySelector('#test')!.appendChild(test)
 */

/**
 * An example (continuing from the previous one) that shows how to compose DOM
 * elements using functional components.
 *
 * @example
 * // prettier-ignore
 * const Greeting = () => section(
 *   <section>
 *     <Label greeting={('hello ('+count()+')')}>
 *       <div>John</div>
 *     </Label>
 *   </section>
 * )
 *
 * interface LabelProps {
 *   greeting: string
 *   children: JSX.Element | JSX.Element[]
 * }
 *
 * const Label = (props: LabelProps) => {
 *   // prettier-ignore
 *   return (
 *     <>
 *       <div>{(props.greeting)}</div>
 *       {(props.children)}
 *     </>
 *   ) as any as HTMLElement[]
 * }
 *
 * // You only need to call this once, and you get an element reference. You do
 * // NOT need to call it over and over to render. The reactivity inside the
 * // template takes care of updating content of the DOM that was created.
 * const elem = Greeting()
 *
 * // It's just DOM! Use regular DOM APIs! Append the element to the body:
 * document.body.prepend(elem)
 */

/**
 * Simple class-base web component (custom element) example:
 *
 * @example
 * import {Component, attribute, reactive, autorun} from './Component'
 *
 * \@customElement('my-element') // defines the element tag name
 * class MyElement extends Component {
 *   // make the property a reaftive variable, and also map any value from an
 *   // attribute named 'name' back to this property (attribute is dash-case
 *   // instead of camelCase).
 *   @reactive @attribute name = 'Roger'
 *
 *   // connectedCallback fires once the element is connected into the web site's live DOM.
 *   connectedCallback() {
 *     // once the element is connected, update the `.name` prop after a second,
 *     // and you'll see the result on screen change.
 *     setTimeout(() => this.name = "Zaya", 5000)
 *   }
 *
 *   // define the structure that we want rendered on screen. This should simply
 *   // return an Element DOM node. Optionally use JSX to create the DOM
 *   // declaratively (as in this example).
 *   template() {
 *     // any time the `.name` reactive property's value changes, the DOM will be
 *     // updated, thanks how the JSX works (it comiles to reactive computations).
 *     return <div>Hello {( this.name )}</div>
 *   }
 * }
 */

/////////////////////////////////////////////////////////////////////////////////
////////////////// }} END EXAMPLES
/////////////////////////////////////////////////////////////////////////////////

export class Component extends HTMLElement {
    constructor() {
        super()
        this.__handleInitialPropertyValuesIfAny()
    }

    static observedAttributes?: string[]

    private __attributesToProps?: Record<string, {name: string; attributeHandler?: AttributeHandler}>

    private __handleInitialPropertyValuesIfAny() {
        // We need to delete value-descriptor properties and store the initial
        // values in the storage for our reactive variable accessors.
        //
        // If we don't do this, then DOM APIs like cloneNode will create our node
        // without first upgrading it and set property values, which means those
        // values will be set as value descriptor properties on the instance instead
        // of interacting with our accessors (i.e. overriding our accessors that the
        // instance will gain once the upgrade process places our prototype in the
        // instance's prototype chain).
        //
        // This can also happen if you set properties on an element that isn't
        // upgraded into a custom element yet, and thus will not yet have our
        // accessors.

        if (this.__attributesToProps) {
            for (const attr in this.__attributesToProps) {
                const prop = this.__attributesToProps[attr]
                const propName = prop.name as keyof this

                if (this.hasOwnProperty(propName)) {
                    // override only value descriptors (we assume a getter/setter descriptor is intentional and meant to override or extend our getter/setter)
                    const descriptor = Object.getOwnPropertyDescriptor(this, propName)!

                    if (descriptor.value) {
                        // delete the value descriptor...
                        delete this[propName]

                        // ...and re-assign the value so that it goes through an inherited accessor
                        //
                        // NOTE, deferring allows preexisting preupgrade values to be
                        // handled *after* default constructor values are have been set
                        // during Custom Element upgrade.
                        defer(() => (this[propName] = descriptor.value))
                    }
                }
            }
        }
    }

    protected makeStyle?(): string
    protected elementStyle?(): string
    protected template?(): Element

    /**
     * Subclasses can override this to provide an alternate Node to render into
     * (f.e. a subclass can `return this` to render into itself instead of making a root)
     */
    protected get root(): Node {
        if (this.shadowRoot) return this.shadowRoot
        return this.attachShadow({mode: 'open'})
    }

    private __dispose?: () => void
    private __hasShadow = true

    protected connectedCallback() {
        this.__hasShadow = this.root instanceof ShadowRoot

        this.__setStyle()

        if (this.template) this.__dispose = render(this.template.bind(this), this.root)
    }

    protected disconnectedCallback() {
        this.__dispose && this.__dispose()

        this.__cleanupStyle()
    }

    private static __rootNodeRefCountPerTagName = new WeakMap<Node, Record<string, number>>()

    private __setStyle() {
        const hostSelector = this.__hasShadow ? ':host' : this.tagName.toLowerCase()

        const style = document.createElement('style')

        style.innerHTML = `
      ${hostSelector} {
        display: block;
        ${this.elementStyle ? this.elementStyle() : ''}
      }

      ${this.makeStyle ? this.makeStyle() : ''}
    `

        if (this.__hasShadow) {
            // If this element has a shadow root, put the style there. This is the
            // standard way to scope styles to a component.

            this.root.appendChild(style)
        } else {
            // If this element doesn't have a shadow root, then we want to append the
            // style only once to the rootNode where it lives (a ShadoowRoot or
            // Document). If there are multiple of this same element in the rootNode,
            // then the style will be added only once and will style all the elements
            // in the same rootNode.

            const _rootNode = this.getRootNode()
            const rootNode = _rootNode === document ? document.head : _rootNode

            let refCountPerTagName = Component.__rootNodeRefCountPerTagName.get(rootNode)
            if (!refCountPerTagName) Component.__rootNodeRefCountPerTagName.set(rootNode, (refCountPerTagName = {}))
            const refCount = refCountPerTagName[this.tagName] || 0
            refCountPerTagName[this.tagName] = refCount + 1

            if (refCount === 0) {
                style.id = this.tagName
                rootNode.appendChild(style)
            }
        }
    }

    private __cleanupStyle() {
        if (this.__hasShadow) return

        const rootNode = this.getRootNode()
        const refCountPerTagName = Component.__rootNodeRefCountPerTagName.get(rootNode)

        if (!refCountPerTagName) return

        const refCount = refCountPerTagName[this.tagName]

        if (refCount === undefined) return

        refCountPerTagName[this.tagName] = refCount - 1

        if (refCount === 0) {
            const style = (rootNode as Element).querySelector('#' + this.tagName)
            if (style) rootNode.removeChild(style)
        }
    }

    // not used currently, but we'll leave this hear so that child classes can call super,
    // and that way we can always add an implementation later when needed.
    protected adoptedCallback() {}

    protected attributeChangedCallback(attr: string, _oldVal: string, newVal: string) {
        // map attribute to property
        const prop = this.__attributesToProps && this.__attributesToProps[attr]
        if (prop) {
            const handler = prop.attributeHandler
            this[prop.name as keyof this] = (handler && handler.from ? handler.from(newVal) : newVal) as any
        }
    }
}

// prettier-ignore
const base26Chars = [
  'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
]

/**
 * Given an array of characters `baseChars` with length X, convert an int
 * `value` to base X, using the chars in the array for the digit representation.
 */
// We need this because Emotion.js accepts only letters in the createEmotion key
// option.
// Based on https://stackoverflow.com/a/923814/454780
function integerToString(value: number, baseChars: string[]): string {
    value = Math.floor(value)

    let result = ''
    const targetBase = baseChars.length

    do {
        result = baseChars[value % targetBase] + result
        value = value / targetBase
    } while (value > 1)

    return result
}

let emotionCount = 0

const emotions = new WeakMap<WithEmotion, Emotion>()

// eslint-disable-next-line typescript/explicit-function-return-type
function WithEmotionMixin<T extends Constructor<Component>>(Base?: T) {
    if (!Base) Base = Constructor(Component)

    class WithEmotion extends Constructor<Component>(Base) {
        get emotion(): ReturnType<typeof createEmotion> {
            let emotion = emotions.get(this)

            if (!emotion) {
                emotions.set(
                    this,
                    (emotion = createEmotion({
                        // The key option is required when there will be multiple instances
                        // of Emotion in a single app, and we need one instance of Emotion
                        // per element instance, for now.
                        key: this.tagName.toLowerCase() + '-' + integerToString(++emotionCount, base26Chars),

                        // The `as HTMLElement` cast is needed because the type def for
                        // `createEmotion` is too specific, and does not accept just Node
                        // (f.e. shadow roots are Node, but not HTMLElement, and we may want
                        // to attach the generated <style> elements to this element's shadow
                        // root)
                        container: this.root as HTMLElement,
                    }))
                )
            }

            return emotion
        }

        get css(): ReturnType<typeof createEmotion>['css'] {
            return this.emotion.css
        }
    }

    return WithEmotion as MixinResult<typeof WithEmotion, T>
}

export const WithEmotion = Mixin(WithEmotionMixin, Component)
export interface WithEmotion extends InstanceType<typeof WithEmotion> {}

/*
 * Helper for taking Solid.js signals and making them have the form foo() for
 * reading and foo(123) for setting.
 */
// eslint-disable-next-line typescript/explicit-function-return-type
export function variable<T>(value: T) {
    const [get, set] = createSignal<T>(value)

    function variable(value?: undefined): T
    function variable(value: T): void
    function variable(value?: T): void | T {
        if (typeof value === 'undefined') return get()
        set(value)
    }

    return variable
}

export function autorun(f: (v?: unknown) => unknown): void {
    createEffect(f)
}

// eslint-disable-next-line typescript/explicit-function-return-type
export function customElement(tagName: string) {
    return function<C extends Constructor<HTMLElement>>(Ctor: C): C {
        customElements.define(tagName, Ctor)
        return Ctor
    }
}

type AttributeHandler = {
    to?: (prop: unknown) => string
    from?: (v: string) => unknown
}

export function attribute(prototype: any /*CustomElementPrototype*/, propName: string): any
export function attribute(handler?: AttributeHandler): (proto: any, propName: string) => any
export function attribute(handlerOrProto: any, propName?: string): any {
    if (handlerOrProto && propName) {
        // if being used as a decorator directly
        _attribute(handlerOrProto, propName)
    } else {
        // if being used as a decorator factory
        return (proto: any, propName: string) => {
            _attribute(proto, propName, handlerOrProto)
        }
    }
}

function _attribute({constructor}: any /*CustomElementPrototype*/, propName: string, handler?: AttributeHandler): void {
    const ctor = constructor as typeof Component

    if (!ctor.hasOwnProperty('observedAttributes')) {
        Object.defineProperty(ctor, 'observedAttributes', {
            writable: true,
            configurable: true,
            enumerable: true,
            value: [...(Object.getPrototypeOf(ctor).observedAttributes || [])],
        })
    }

    const attrName = camelCaseToDash(propName)

    if (!ctor.observedAttributes!.includes(attrName)) ctor.observedAttributes!.push(attrName)

    mapAttributeToProp(ctor, attrName, propName, handler)
}

// type CustomElementPrototype = {
//   constructor: CustomElementCtor
// }

// TODO this stores attributes as an inheritance chain on the constructor. It'd
// be more fool-proof (not publicly exposed) to store attribute-prop mappings in
// WeakMaps, but then we'd need to implement our own inheritance
// (prototype-like) lookup for the attributes.
function mapAttributeToProp(ctor: typeof Component, attr: string, prop: string, handler?: AttributeHandler): void {
    if (!ctor.prototype.hasOwnProperty('__attributesToProps')) {
        // using defineProperty so that it is non-writable, non-enumerable, non-configurable
        Object.defineProperty(ctor.prototype, '__attributesToProps', {
            value: {
                __proto__:
                    // prettier-ignore
                    ctor.prototype.
            // @ts-ignore, private access
            __attributesToProps ||
            Object.prototype,
            },
        })
    }

    // TODO throw helpful warning if overriding an already-existing attribute-prop mapping
    if (
        // prettier-ignore
        ctor.prototype.
      // @ts-ignore, private access
      __attributesToProps!
      [attr]
    ) {
        console.warn(
            'The `@attribute` decorator is overriding an already-existing attribute-to-property mapping for the "' +
                attr +
                '" attribute.'
        )
    }

    // prettier-ignore
    ctor.prototype.
    // @ts-ignore, private access
    __attributesToProps!
    [attr] = {name: prop, attributeHandler: handler}
}

function camelCaseToDash(str: string): string {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

interface ReactiveVariable<T> {
    (value?: undefined): T
    (value: T): void
}

function __getReactiveVar<T>(
    instance: Record<string, any>,
    vName: string,
    initialValue: T = undefined!
): ReactiveVariable<T> {
    // NOTE alternatively, we could use a WeakMap instead of exposing the variable on the instance.
    let v: ReactiveVariable<T> = instance[vName]

    if (v) return v

    // defineProperty to make it non-enumerable, non-writable, non-configurable
    Object.defineProperty(instance, vName, {value: v = variable<T>(initialValue)})

    return v
}

export function reactive<T>(prototype: any, name: string, descriptor?: PropertyDescriptor): any {
    const vName = 'v_' + name

    // property decorators are not passed a prototype (unlike decorators on accessors or methods)
    let calledAsPropertyDecorator = false

    if (!descriptor) {
        calledAsPropertyDecorator = true
        descriptor = Object.getOwnPropertyDescriptor(prototype, name)
    }

    let originalGet: (() => any) | undefined
    let originalSet: ((v: any) => void) | undefined
    let initialValue: T
    let writable: boolean | undefined

    if (descriptor) {
        if (descriptor.get || descriptor.set) {
            originalGet = descriptor.get
            originalSet = descriptor.set

            // reactivity requires both
            if (!originalGet || !originalSet) {
                console.warn(
                    'The `@reactive` decorator was used on an accessor named ' +
                        name +
                        ' which had a getter or a setter, but not both. Reactivity on accessors works only when accessors have both get and set.'
                )
                return
            }

            delete descriptor.get
            delete descriptor.set
        } else {
            initialValue = descriptor.value
            writable = descriptor.writable

            // if it isn't writable, we don't need to make a reactive variable because
            // the value won't change
            if (!writable) {
                console.warn(
                    'The `@reactive` decorator was used on a property named ' +
                        name +
                        ' that is not writable. Reactivity is not enabled for non-writable properties.'
                )
                return
            }

            delete descriptor.value
            delete descriptor.writable
        }
    }

    descriptor = {
        ...descriptor,
        get(): T {
            // initialValue could be undefined
            const v = __getReactiveVar<T>(this, vName, initialValue)

            if (originalGet) {
                // track reactivity, but get the value from the original getter
                v()
                return originalGet.call(this)
            }

            return v()
        },
        set(newValue: T) {
            const v = __getReactiveVar<T>(this, vName, initialValue)

            if (originalSet) originalSet.call(this, newValue)

            v(newValue)
        },
    }

    // If a decorator is called on a property, then returning a descriptor does
    // nothing, so we need to set the descriptor manually.
    if (calledAsPropertyDecorator) Object.defineProperty(prototype, name, descriptor)
    // If a decorator is called on an accessor or method, then we must return a
    // descriptor in order to modify it, and doing it manually won't work.
    else return descriptor
    // Weird, huh?
    // This will change with updates to the ES decorators proposal, https://github.com/tc39/proposal-decorators
}

// define the slot element type, for use with ShadowDOM
export interface HTMLSlotElementAttributes extends HTMLAttributes<HTMLSlotElement> {
    name?: string
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            slot: DetailedHTMLProps<HTMLSlotElementAttributes, HTMLSlotElement>
        }
    }
}
