/* global customElements */

import jss from '../jss'

// Very very stupid hack needed for Safari in order for us to be able to extend
// the HTMLElement class. See:
// https://github.com/google/traceur-compiler/issues/1709
//if (typeof window.HTMLElement != 'function') {
    //const _HTMLElement = function HTMLElement(){}
    //_HTMLElement.prototype = window.HTMLElement.prototype
    //window.HTMLElement = _HTMLElement
//}

// XXX: we can improve by clearing items after X amount of time.
const classCache = new Map

let stylesheets = new WeakMap
let instanceCountByConstructor = new WeakMap

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
 * const WebComponent = makeWebComponentBaseClass(HTMLButtonElement)
 * class AwesomeButton extends WebComponent { ... }
 *
 * @param {Function} elementClass The class to that the generated WebComponent
 * base class will extend from.
 */
export default
function makeWebComponentBaseClass(elementClass) {
    if (!elementClass) elementClass = HTMLElement

    if (!hasHTMLElementPrototype(elementClass)) {
        throw new TypeError(
            'The argument to makeWebComponentBaseClass must be a constructor that extends from or is HTMLElement.'
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
            if (document.registerElement && !customElements.define) {

                // TODO: link to docs.
                throw new Error(`
                    You cannot call this class directly without first registering it
                    with \`document.registerElement(...)\`. See an example at http://....
                `)

            }

            if (!document.registerElement && !customElements.define) {

                throw new Error(`
                    Your browser does not support the Custom Elements API. You'll
                    need to install a polyfill. See how at http://....
                `)

            }

            // otherwise the V1 API exists, so call the createdCallback, which
            // is what Custom Elements v0 would call, and we're putting
            // instantiation logic there instead of here in the constructor so
            // that the API is backwards compatible.
            this.createdCallback()
        }

        createdCallback() {
            this._attached = false
            this._initialized = false

            //this.root....addEventListener('slotchange', function() {
                //let slot = ...
                //for (el in slot) {
                    //el.slottedCallback(slot)
                //}
            //})
        }

        //slottedCallback(slot) {
        //}

        connectedCallback() {
            this._attached = true

            if (!this._initialized) {
                this._init()
                this._initialized = true
            }
        }
        attachedCallback() { this.connectedCallback() } // back-compat

        _createStylesheet() {

            if (!instanceCountByConstructor.get(this.constructor))
                instanceCountByConstructor.set(this.constructor, 0)

            instanceCountByConstructor.set(this.constructor,
                instanceCountByConstructor.get(this.constructor) + 1)

            if (instanceCountByConstructor.get(this.constructor) === 1) {

                // XXX create stylesheet inside animation frame?
                stylesheets.set(this.constructor,
                    jss.createStyleSheet(this.getStyles()).attach())
            }
        }

        get stylesheet() {
            return stylesheets.get(this.constructor)
        }

        async disconnectedCallback() {
            this._attached = false

            // XXX Deferr to the next tick before cleaning up in case the
            // element is actually being re-attached somewhere else within this
            // same tick (detaching and attaching is synchronous, so by
            // deferring to the next tick we'll be able to know if the element
            // was re-attached or not in order to clean up or not). Note that
            // appendChild can be used to move an element to another parent
            // element, in which case attachedCallback and detachedCallback
            // both get called, and in which case we don't necessarily want to
            // clean up. If the element gets re-attached before the next tick
            // (for example, gets moved), then we want to preserve the
            // associated stylesheet and other stuff that would be cleaned up
            // by an extending class' _cleanUp method by not running the
            // following this._deinit() call.
            await Promise.resolve() // deferr to the next tick.

            // As mentioned in the previous comment, if the element was not
            // re-attached in the last tick (for example, it was moved to
            // another element), then clean up.
            //
            // XXX (performance): Should we coordinate this._deinit() with the
            // animation loop to prevent jank?
            if (!this._attached && this._initialized) {
                this._deinit()
            }
        }
        detachedCallback() { this.disconnectedCallback() } // back-compat

        _destroyStylesheet() {
            instanceCountByConstructor.set(this.constructor,
                instanceCountByConstructor.get(this.constructor) - 1)
            if (instanceCountByConstructor.get(this.constructor) === 0) {
                stylesheets.get(this.constructor).detach()
                stylesheets.delete(this.constructor)
                instanceCountByConstructor.delete(this.constructor)
            }
        }

        /**
         * This method should be implemented by extending classes.
         * @abstract
         */
        getStyles() {
            throw new Error('Your component must define a getStyles method, which returns the JSS-compatible JSON-formatted styling of your component.')
        }

        _init() {
            this._createStylesheet()

            // TODO: Find a better pattern that doesn't rely on the class name.
            this.classList.add(this.stylesheet.classes[this.constructor.name])

            this.init()
        }
        init() { /* to be defined by child class */ }

        _deinit() {
            // XXX: We can clean up the style after some time, for example like 1
            // minute, or something, instead of instantly.
            this._destroyStylesheet()
            this._initialized = false
            this.deinit()
        }
        deinit() { /* to be defined by child class */ }
    }

    classCache.set(elementClass, WebComponent)
    return WebComponent
}
