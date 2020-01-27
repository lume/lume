import 'element-behaviors'
import WithUpdate from '../WithUpdate'
import ForwardProps from './ForwardProps'
import Node from '../../core/Node'

/**
 * Base class for all behaviors
 */
export default abstract class Behavior extends WithUpdate.mixin(ForwardProps) {
    element: Node

    constructor(element: Element) {
        super()

        // Unsafe cast here because the __checkElementIsLibraryElement method
        // does a runtime check to ensure that element is of type Node. We have
        // to do it this way because it it an asynchronous process that needs to
        // wait for element to be upgraded in some cases. An error is thrown to
        // console if element is not a Node.
        this.element = element as Node
        this.__checkElementIsLibraryElement(element)
    }

    // use a getter because Mesh is undefined at module evaluation time due
    // to a circular dependency.
    get requiredElementType() {
        return Node
    }

    // This could be useful, but at the moment it is only used by SkateJS in
    // triggerUpdate, expecting `this` to be a DOM node.
    get parentNode() {
        // seems to be a bug in the `get`ter, as this.element works fine in regular methods
        return this.element.parentNode
    }

    // proxy setAttribute to this.element so that WithUpdate works in certain cases
    setAttribute(name: string, value: string) {
        this.element.setAttribute(name, value)
    }

    // We use __elementDefined in the following methods so we can delay prop
    // handling until the elements are upgraded and their APIs exist.
    //
    // NOTE, another way we could've achieved this is to let elements emit an
    // event in connectedCallback, at which point the element is guaranteed to
    // be upgraded. We currently do emit the GL_LOAD event. Which can only
    // happen when the element is upgrade AND has loaded GL objects (and these
    // behaviors only care about GL obbjects at the moment) so it'd be possible
    // to rely only on that event for the GL behaviors (which they all currently
    // are). If we have behaviors that work with CSS, not GL, then we could rely
    // on the CSS_LOAD event. In any case, the current solution is more generic,
    // for use with any type of custom elements.

    async attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (!this.__elementDefined) await this.__whenDefined

        super.attributeChangedCallback(name, oldValue, newValue)
    }

    async connectedCallback() {
        if (!this.__elementDefined) await this.__whenDefined

        super.connectedCallback()

        this._listenToElement()
    }

    async disconnectedCallback() {
        if (!this.__elementDefined) await this.__whenDefined

        super.disconnectedCallback()

        this._unlistenToElement()
    }

    // used by ForwardProps. See ForwardProps.js
    protected get _observedObject() {
        return this.element
    }

    protected _listenToElement() {
        // subclasses: add event listeners
    }

    protected _unlistenToElement() {
        // subclasses: remove event listeners
    }

    // a promise resolved when an element is upgraded
    private __whenDefined: Promise<void> = null! as Promise<void>

    // we need to wait for __elementDefined to be true because running the
    // superclass logic, otherwise `updated()` calls can happen before the
    // element is upgraded (i.e. before any APIs are available).
    private __elementDefined = false

    // TODO add a test to make sure this check works
    private async __checkElementIsLibraryElement(element: Element) {
        const BaseClass = this.requiredElementType

        if (element.nodeName.includes('-')) {
            this.__whenDefined = customElements.whenDefined(element.nodeName.toLowerCase())

            // We use `.then` here on purpose, so that setting
            // __elementDefined happens in the very first microtask after
            // __whenDefined is resolved. Otherwise if we set
            // __elementDefined after awaiting the following Promise.race,
            // then it will happen on the second microtask after
            // __whenDefined is resolved. Our goal is to have APIs ready as
            // soon as possible in the methods above that wait for
            // __whenDefined.
            this.__whenDefined.then(() => {
                this.__elementDefined = element instanceof BaseClass
            })

            await Promise.race([this.__whenDefined, new Promise(r => setTimeout(r, 1000))])

            if (!this.__elementDefined)
                throw new Error(`
                    Either the element you're using the behavior on is not an
                    instance of ${BaseClass.name}, or there was a 1-second
                    timeout waiting for the element to be defined. Please make
                    sure all elements you intend to use are defined.
                `)
        } else {
            throw new Error(`
                    The element you're using the mesh behavior on (<${element.tagName.toLowerCase()}>)
                    is not an instance of ${BaseClass.name}.
                `)
        }
    }
}

export {Behavior}
