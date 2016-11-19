/* global customElements */

import { observeChildren } from '../motor/Utility'
import jss from '../jss'

// Very very stupid hack needed for Safari in order for us to be able to extend
// the HTMLElement class. See:
// https://github.com/google/traceur-compiler/issues/1709
if (typeof window.HTMLElement != 'function') {
    const _HTMLElement = function HTMLElement(){}
    _HTMLElement.prototype = window.HTMLElement.prototype
    window.HTMLElement = _HTMLElement
}

// XXX: Maybe we can improve by clearing items after X amount of time?
const classCache = new Map

function hasHTMLElementPrototype(constructor) {
    if (!constructor) return false
    if (constructor === HTMLElement) return true
    else return hasHTMLElementPrototype(constructor.prototype)
}

/**
 * Creates a WebComponent base class dynamically, depending on which
 * HTMLElement class you want it to extend from. Extend from WebComponent when
 * making a new Custom Element class.
 *
 * @example
 * const WebComponent = WebComponentMixin(HTMLButtonElement)
 * class AwesomeButton extends WebComponent { ... }
 *
 * @param {Function} elementClass The class that the generated WebComponent
 * base class will extend from.
 */
export default
function WebComponentMixin(elementClass) {
    if (!elementClass) elementClass = HTMLElement

    if (!hasHTMLElementPrototype(elementClass)) {
        throw new TypeError(
            'The argument to WebComponentMixin must be a constructor that extends from or is HTMLElement.'
        )
    }

    // if a base class that extends the given `elementClass` has already been
    // created, return it.
    if (classCache.has(elementClass))
        return classCache.get(elementClass)

    // otherwise, create it.
    class WebComponent extends elementClass {

        // constructor() is used in v1 Custom Elements instead of
        // createdCallback() as in v0.
        constructor() {
            super()

            // If the following is true, then we know the user should be using
            // `document.registerElement()` to define an element from this class.
            // `document.registerElement()` creates a new constructor, so if the
            // constructor here is being called then that means the user is not
            // instantiating a DOM HTMLElement as expected because it is required
            // that the constructor returned from `document.registerElement` be used
            // instead (this is a flaw of Custom Elements v0 which is fixed in v1
            // where class constructors can be used directly).
            if ('registerElement' in document && !('customElements' in window)) {

                // TODO: link to docs.
                throw new Error(`
                    You cannot instantiate this class directly without first registering it
                    with \`document.registerElement(...)\`. See an example at http://....
                `)

            }

            // Throw an error if no Custom Elements API exists.
            if (!('registerElement' in document) && !('customElements' in window)) {

                // TODO: link to docs.
                throw new Error(`
                    Your browser does not support the Custom Elements API. You'll
                    need to install a polyfill. See how at http://....
                `)

            }

            // otherwise the V1 API exists, so call the createdCallback, which
            // is what Custom Elements v0 would call by default. Subclasses of
            // WebComponent should put instantiation logic in createdCallback
            // instead of in a custom constructor if backwards compatibility is
            // to be maintained.
            this.createdCallback()
        }

        createdCallback() {
            this._attached = false
            this._initialized = false
        }

        // Subclasses can implement these.
        childConnectedCallback(child) {}
        childDisconnectedCallback(child) {}

        connectedCallback() {
            this._attached = true

            if (!this._initialized) {
                this.init()
                this._initialized = true
            }
        }
        attachedCallback() { this.connectedCallback() } // back-compat

        _createStyles() {
            // TODO: Create styles inside of an animation frame?

            // XXX This creates a new rule per instance. Would it be better to
            // create a single rule per class instead?
            const rule = jss.createRule(this.getStyles())

            rule.applyTo(this)
        }

        async disconnectedCallback() {
            this._attached = false

            // XXX Deferr to the next tick before cleaning up in case the
            // element is actually being re-attached somewhere else within this
            // same tick (detaching and attaching is synchronous, so by
            // deferring to the next tick we'll be able to know if the element
            // was re-attached or not in order to clean up or not). Note that
            // appendChild can be used to move an element to another parent
            // element, in which case connectedCallback and disconnectedCallback
            // both get called, and in which case we don't necessarily want to
            // clean up. If the element gets re-attached before the next tick
            // (for example, gets moved), then we want to preserve the
            // stuff that would be cleaned up by an extending class' deinit
            // method by not running the following this.deinit() call.
            await Promise.resolve() // deferr to the next tick.

            // As mentioned in the previous comment, if the element was not
            // re-attached in the last tick (for example, it was moved to
            // another element), then clean up.
            //
            // XXX (performance): Should we coordinate this.deinit() with the
            // animation loop to prevent jank?
            if (!this._attached && this._initialized) {
                this.deinit()
            }
        }
        detachedCallback() { this.disconnectedCallback() } // back-compat

        /**
         * This method can be overridden by extending classes, it should return
         * JSS-compatible styling. See http://github.com/cssinjs/jss for
         * documentation.
         * @abstract
         */
        getStyles() {
            return {}
        }


        /**
         * Init is called exactly once, the first time this element is connected
         * into the DOM. When an element is disconnected then connected right
         * away within the same tick, init() is not fired again. However, if an
         * element is disconnected and then some time passes and the current
         * tick completes, then deinit() will be called, and the next time that
         * the element is connected back into DOM init() will be called again.
         *
         * Subclasses should extend this to add such logic.
         */
        init() {
            this._createStyles()

            // Handle any nodes that may have been connected before `this` node
            // was created (f.e. child nodes that were connected before the
            // custom elements were registered and which would therefore not be
            // detected by the following MutationObserver).
            if (this.childNodes.length) {

                // Timeout needed in case the Custom Elements classes are
                // registered after the elements are already defined in the DOM
                // but not yet upgraded.
                setTimeout(() => {
                    for (let node of this.childNodes) {
                        this.childConnectedCallback(node)
                    }
                }, 5)
            }

            observeChildren(this, this.childConnectedCallback, this.childDisconnectedCallback)

            // fire this.attributeChangedCallback in case some attributes have
            // existed before the custom element was upgraded.
            if (this.hasAttributes()) {

                // HTMLElement#attributes is a NamedNodeMap which is not an
                // iterable, so we use Array.from. See:
                // https://github.com/zloirock/core-js/issues/234
                for (let attr of Array.from(this.attributes))
                    if ('attributeChangedCallback' in this)
                        this.attributeChangedCallback(attr.name, null, attr.value)
            }
        }

        /**
         * This is the reciprocal of init(). It will be called when an element
         * has been disconnected but not re-connected within the same tick.
         *
         * The reason that init() and deinit() exist is so that if an element is
         * moved from one place to another within the same synchronous tick,
         * that deinit and init logic will not fire unnecessarily. If logic is
         * needed in that case, then connectedCallback and disconnectedCallback
         * can be used directly instead.
         */
        deinit() {
            // Nothing much at the moment, but extending classes can extend
            // this to add deintialization logic.

            this._initialized = false
        }
    }

    classCache.set(elementClass, WebComponent)
    return WebComponent
}
