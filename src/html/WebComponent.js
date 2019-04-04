/* global customElements */

import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'
import {native} from 'lowclass/native'
import { observeChildren } from '../core/Utility'
import jss from '../lib/jss'
import DefaultBehaviors from './behaviors/DefaultBehaviors'
import WithChildren from './WithChildren'

// Very very stupid hack needed for Safari in order for us to be able to extend
// the HTMLElement class. See:
// https://github.com/google/traceur-compiler/issues/1709
if (typeof window.HTMLElement != 'function') {
    const _HTMLElement = function HTMLElement(){}
    _HTMLElement.prototype = window.HTMLElement.prototype
    window.HTMLElement = _HTMLElement
}

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
 * @param {Function} Base The class that the generated WebComponent
 * base class will extend from.
 */
export default
Mixin(Base => {

    // the extra `class extends` is necessary here so that
    // babel-plugin-transform-builtin-classes can work properly.
    Base = Base || native( HTMLElement )

    // XXX: In the future, possibly check for Element if other things besides
    // HTML are supported (f.e. SVGElements)
    if (!classExtendsHTMLElement(Base)) {
        throw new TypeError(
            'The argument to WebComponent.mixin must be a constructor that extends from or is HTMLElement.'
        )
    }

    // otherwise, create it.
    const WebComponent = Class('WebComponent').extends( WithChildren.mixin( DefaultBehaviors.mixin( Base ) ), ({ Super, Public, Private }) => ({

        constructor(...args) {
            // Throw an error if no Custom Elements v1 API exists.
            if (!('customElements' in window)) {

                // TODO: provide a link to the Docs.
                throw new Error(`
                    Your browser does not support the Custom Elements API. You'll
                    need to install a polyfill. See how at http://....
                `)

            }

            const self = Super(this).constructor(...args)
            return self
        },

        connectedCallback() {
            if (Super(this).connectedCallback) Super(this).connectedCallback()

            if (!Private(this).initialized) {
                this.init()
                Private(this).initialized = true
            }
        },

        async disconnectedCallback() {
            if (Super(this).disconnectedCallback) Super(this).disconnectedCallback()

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
            if (!this.isConnected && Private(this).initialized) {
                this.deinit()
                Private(this).initialized = false
            }
        },

        /**
         * This method can be overridden by extending classes, it should return
         * JSS-compatible styling. See http://github.com/cssinjs/jss for
         * documentation.
         * @abstract
         */
        getStyles() {
            return {}
        },


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
            if (!Private(this).style) Private(this).style = Private(this).createStyles()

            // fire this.attributeChangedCallback in case some attributes have
            // existed before the custom element was upgraded.
            if (!Private(this).initialAttributeChange && this.hasAttributes()) {

                const {attributes} = this
                for (let l=attributes.length, i=0; i<l; i+=1)
                    this.attributeChangedCallback(attributes[i].name, null, attributes[i].value)
            }
        },

        // TODO: when we make setAttribute accept non-strings, we need to move
        // logic from attributeChangedCallback
        attributeChangedCallback(...args) {
            if (Super(this).attributeChangedCallback) Super(this).attributeChangedCallback(...args)
            Private(this).initialAttributeChange = true
        },

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
            // Nothing at the moment, but subclasses can extend this to add
            // deintialization logic.
        },

        private: {
            style: null,
            initialized: false,
            initialAttributeChange: false,

            createStyles() {
                const rule = jss.createRule(Public(this).getStyles())

                rule.applyTo(Public(this))

                return rule
            },
        },
    }))

    return WebComponent
}, native( HTMLElement ))
