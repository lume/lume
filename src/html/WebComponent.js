/* global customElements */

import { observeChildren } from '../core/Utility'
import jss from '../lib/jss'
import documentReady from '@awaitbox/document-ready'
import DefaultBehaviorsMixin from './behaviors/DefaultBehaviors'

// Very very stupid hack needed for Safari in order for us to be able to extend
// the HTMLElement class. See:
// https://github.com/google/traceur-compiler/issues/1709
if (typeof window.HTMLElement != 'function') {
    const _HTMLElement = function HTMLElement(){}
    _HTMLElement.prototype = window.HTMLElement.prototype
    window.HTMLElement = _HTMLElement
}

const classCache = new Map

function classExtendsHTMLElement(constructor) {
    if (!constructor) return false
    if (constructor === HTMLElement) return true
    else return classExtendsHTMLElement( constructor.__proto__ )
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
    // the extra `class extends` is necessary here so that
    // babel-plugin-transform-builtin-classes can work properly.
    if (!elementClass) elementClass = class extends HTMLElement {}

    // XXX: In the future, possibly check for Element if other things besides
    // HTML are supported (f.e. SVGElements)
    if (!classExtendsHTMLElement(elementClass)) {
        throw new TypeError(
            'The argument to WebComponentMixin must be a constructor that extends from or is HTMLElement.'
        )
    }

    // if a base class that extends the given `elementClass` has already been
    // created, return it.
    if (classCache.has(elementClass))
        return classCache.get(elementClass)

    // otherwise, create it.
    class WebComponent extends DefaultBehaviorsMixin(elementClass) {

        constructor(...args) {
            // Throw an error if no Custom Elements v1 API exists.
            if (!('customElements' in window)) {

                // TODO: provide a link to the Docs.
                throw new Error(`
                    Your browser does not support the Custom Elements API. You'll
                    need to install a polyfill. See how at http://....
                `)

            }

            // we are using `construct` because we were previously using the
            // document-register-element Custom Elements v1 polyfill.
            super(...args)
            this.construct(...args)
        }

        // subclasses extend this, and they should not use `constructor`
        // directly.
        construct() {
            super.construct()
            this._connected = false
            this._initialized = false
            this._initialAttributeChange = false
            this._childObserver = null
            this._style = null
        }

        // Subclasses can implement these.
        childConnectedCallback(child) { }
        childDisconnectedCallback(child) { }

        connectedCallback() {
            if (super.connectedCallback) super.connectedCallback()
            this._connected = true

            if (!this._initialized) {
                this.init()
                this._initialized = true
            }
        }

        _createStyles() {
            const rule = jss.createRule(this.getStyles())

            rule.applyTo(this)

            return rule
        }

        async disconnectedCallback() {
            if (super.disconnectedCallback) super.disconnectedCallback()
            this._connected = false

            // Deferr to the next tick before cleaning up in case the
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
            if (!this._connected && this._initialized) {
                this.deinit()
            }
        }

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
         * Init is called exactly once, the first time this element is
         * connected into the DOM. When an element is disconnected then
         * connected right away within the same synchronous tick, init() is not
         * fired again. However, if an element is disconnected and the current
         * tick completes before the element is connected again, then deinit()
         * will be called (i.e. the element was not simply moved to a new
         * location, it was actually removed), then the next time that the
         * element is connected back into DOM init() will be called again.
         *
         * This is in contrast to connectedCallback and disconnectedCallback:
         * connectedCallback is guaranteed to always fire even if the elemet
         * was previously disconnected in the same synchronous tick.
         *
         * For example, ...
         *
         * Subclasses should extend this to add such logic.
         */
        init() {
            if (!this._style) this._style = this._createStyles()

            // Timeout needed in case the Custom Element classes are
            // registered after the elements are already defined in the
            // DOM but not yet upgraded. This means that the `node` arg
            // might be a `<motor-node>` but if it isn't upgraded then
            // its API won't be available to the logic inside the
            // childConnectedCallback. The reason this happens is
            // because parents are upgraded first and their
            // connectedCallbacks fired before their children are
            // upgraded.
            //
            //setTimeout(() => {
            //Promise.resolve().then(() => {
            documentReady().then(() => {

                // Handle any nodes that may have been connected before `this` node
                // was created (f.e. child nodes that were connected before the
                // custom elements were registered and which would therefore not be
                // detected by the following MutationObserver).
                if (!this._childObserver) {

                    const children = this.childNodes
                    for (let l=children.length, i=0; i<l; i+=1) {
                        this.childConnectedCallback(children[i])
                    }

                    this._childObserver = observeChildren(this, this.childConnectedCallback, this.childDisconnectedCallback)
                }
            })
            //}, 0)

            // fire this.attributeChangedCallback in case some attributes have
            // existed before the custom element was upgraded.
            if (!this._initialAttributeChange && this.hasAttributes()) {

                // HTMLElement#attributes is a NamedNodeMap which is not an
                // iterable, so we use Array.from. See:
                // https://github.com/zloirock/core-js/issues/234
                const {attributes} = this
                for (let l=attributes.length, i=0; i<l; i+=1)
                    this.attributeChangedCallback(attributes[i].name, null, attributes[i].value)
            }
        }

        static get observedAttributes() {
            console.warn(`WebComponent: Your custom element (${ this.name }) should specify observed attributes or attributeChangedCallback won't be called`)
        }

        // TODO: when we make setAttribute accept non-strings, we need to move
        // logic from attributeChangedCallback
        attributeChangedCallback(...args) {
            if (super.attributeChangedCallback) super.attributeChangedCallback(...args)
            this._initialAttributeChange = true
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
