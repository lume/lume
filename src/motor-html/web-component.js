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

let stylesheets = {}
let instanceCountByConstructor = {}

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
        constructor() { super(); this.createdCallback() }
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

        connectedCallback() { this.attachedCallback() }
        attachedCallback() {
            this._attached = true

            if (!this._initialized) {
                this._init()
                this._initialized = true
            }
        }

        _createStylesheet() {

            if (!instanceCountByConstructor[this.constructor.name])
                instanceCountByConstructor[this.constructor.name] = 0

            instanceCountByConstructor[this.constructor.name] += 1

            if (instanceCountByConstructor[this.constructor.name] === 1) {

                // XXX create stylesheet inside animation frame?
                stylesheets[this.constructor.name] =
                    jss.createStyleSheet(this.getStyles()).attach()
            }
        }

        get stylesheet() {
            return stylesheets[this.constructor.name]
        }

        disconnectedCallback() { this.detachedCallback() }
        async detachedCallback() {
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

        _destroyStylesheet() {
            instanceCountByConstructor[this.constructor.name] -= 1
            if (instanceCountByConstructor[this.constructor.name] === 0) {
                stylesheets[this.constructor.name].detach()
                delete stylesheets[this.constructor.name]
                delete instanceCountByConstructor[this.constructor.name]
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
