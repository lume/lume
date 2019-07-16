import {Mixin, MixinResult, Constructor} from 'lowclass'
import jss from '../lib/jss'
import DefaultBehaviors from './behaviors/DefaultBehaviors'
import WithChildren from './WithChildren'
import {PossibleCustomElement} from './WithUpdate'

// Very very bad hack needed for Safari in order for us to be able to extend
// the HTMLElement class. See:
// https://github.com/google/traceur-compiler/issues/1709
if (typeof (window as any).HTMLElement != 'function') {
    const _HTMLElement = function HTMLElement() {}
    _HTMLElement.prototype = (window as any).HTMLElement.prototype(window as any).HTMLElement = _HTMLElement
}

function classExtendsHTMLElement(constructor: any): boolean {
    if (!constructor) return false
    if (constructor === HTMLElement) return true
    else return classExtendsHTMLElement(constructor.__proto__)
}

/**
 * Creates a WebComponent base class dynamically, depending on which
 * HTMLElement class you want it to extend from. Extend from WebComponent when
 * making a new Custom Element class.
 *
 * @param {Constructor} Base The class that the generated WebComponent
 * base class will extend from.
 *
 * @example
 * class AwesomeButton extends WebComponentMixin(HTMLButtonElement) { ... }
 */
function WebComponentMixin<T extends Constructor<HTMLElement>>(Base: T) {
    Base = Base || HTMLElement

    // XXX: In the future, possibly check for Element if other things besides
    // HTML are supported (f.e. SVGElements)
    if (!classExtendsHTMLElement(Base)) {
        throw new TypeError(
            'The argument to WebComponent.mixin must be a constructor that extends from or is HTMLElement.'
        )
    }

    // const Parent = WithChildren.mixin(DefaultBehaviors.mixin(Base))

    class WebComponent extends WithChildren.mixin(DefaultBehaviors.mixin(Constructor<PossibleCustomElement>(Base))) {
        constructor(...args: any[]) {
            super(...args)

            // Throw an error if no Custom Elements v1 API exists.
            // TODO this should go before the super call, but TypeScript doesn't
            // support it yet. Othewise users may get an "illegal constructor"
            // error without helpful information.
            if (!('customElements' in window)) {
                // TODO: provide a link to the Docs.
                throw new Error(`
                    Your browser does not support the Custom Elements API. You'll
                    need to install a Custom Elements polyfill.
                `)
            }
        }

        connectedCallback() {
            if (super.connectedCallback) super.connectedCallback()

            if (!this.__initialized) {
                this._init()
                this.__initialized = true
            }
        }

        async disconnectedCallback() {
            if (super.disconnectedCallback) super.disconnectedCallback()

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
            // stuff that would be cleaned up by an extending class' _deinit
            // method by not running the following this._deinit() call.
            await Promise.resolve() // deferr to the next tick.

            // As mentioned in the previous comment, if the element was not
            // re-attached in the last tick (for example, it was moved to
            // another element), then clean up.
            if (!this.isConnected && this.__initialized) {
                this._deinit()
                this.__initialized = false
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

        // TODO: when we make setAttribute accept non-strings, we need to move
        // logic from attributeChangedCallback
        attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
            if (super.attributeChangedCallback) super.attributeChangedCallback(name, oldVal, newVal)
            this.__initialAttributeChange = true
        }

        /**
         * Init is called when this element is connected into the DOM. When
         * an element is disconnected then connected right away within the
         * same synchronous tick, _init() is not fired again. However, if an
         * element is disconnected and the current tick completes before the
         * element is connected again, then _deinit() will be called (i.e.
         * the element was not simply moved to a new location, it was
         * actually removed), then the next time that the element is
         * connected back into DOM _init() will be called again.
         *
         * This is in contrast to connectedCallback and disconnectedCallback:
         * connectedCallback is guaranteed to always fire even if the elemet
         * was previously disconnected in the same synchronous tick.
         *
         * For example, ...
         *
         * Subclasses should extend this to add such logic.
         *
         * TODO ensure that for every _init call there is a reciprocal
         * preceding _deinit call. At the moment there isn't, so running
         * logic that depends a parent node won't work, and it should only
         * have logic that doesn't depend on tree structure changing.
         */
        protected _init() {
            if (!this.__style) this.__style = this.__createStyles()

            // fire this.attributeChangedCallback in case some attributes have
            // existed before the custom element was upgraded.
            if (!this.__initialAttributeChange && this.hasAttributes()) {
                const {attributes} = this
                for (let l = attributes.length, i = 0; i < l; i += 1)
                    this.attributeChangedCallback(attributes[i].name, null, attributes[i].value)
            }
        }

        /**
         * This is the reciprocal of _init(). It will be called when an element
         * has been disconnected but not re-connected within the same tick.
         *
         * The reason that _init() and _deinit() exist is so that if an element is
         * moved from one place to another within the same synchronous tick,
         * that _deinit and _init logic will not fire unnecessarily. If logic is
         * needed in that case, then connectedCallback and disconnectedCallback
         * can be used directly instead.
         */
        protected _deinit() {
            // Nothing at the moment, but subclasses can extend this to add
            // deintialization logic.
        }

        private __style: object | null = null
        private __initialized = false
        private __initialAttributeChange = false

        private __createStyles(): object {
            const rule = jss.createRule(this.getStyles())

            rule.applyTo(this)

            return rule
        }
    }

    return WebComponent as MixinResult<typeof WebComponent, T>
}

export const WebComponent = Mixin(WebComponentMixin, HTMLElement)
export interface WebComponent extends InstanceType<typeof WebComponent> {}
export default WebComponent
