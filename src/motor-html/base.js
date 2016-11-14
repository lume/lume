/* global HTMLSlotElement */

import WebComponent from './web-component'
import MotorHTMLNode from './node'

var DeclarativeBase

// Override HTMLElement.prototype.attachShadow in v1, and
// HTMLElement.prototype.createShadowRoot in v0, so that we can make a Map of
// motor- elements to their shadow roots, so we can always get a reference to
// the element's shadow root even if it is closed.
const elementsWithRoots = new Set
function hijack(original) {
    return function(...args) {
        console.log(' --- hijacked!!!!!')
        let root = null
        try {
            root = original.call(this, ...args)
        }
        catch (e) { throw e }
        if (this instanceof DeclarativeBase)
            elementsWithRoots.add(this)
        return root
    }
}
if (HTMLElement.prototype.createShadowRoot instanceof Function)
    HTMLElement.prototype.createShadowRoot = hijack(HTMLElement.prototype.createShadowRoot)
if (HTMLElement.prototype.attachShadow instanceof Function)
    HTMLElement.prototype.attachShadow = hijack(HTMLElement.prototype.attachShadow)

// ... Little did I know that the `WebComponent` function I made is
// considered a form of mixin. ...
// TODO: follow the mixin pattern as with Node and Scene classes.

initMotorHTMLBase()
export function initMotorHTMLBase() {
    if (DeclarativeBase) return

    DeclarativeBase = class DeclarativeBase extends WebComponent(window.HTMLElement) {
        createdCallback() {
            super.createdCallback()

            this.imperativeCounterpart = null // to hold the imperative API Node instance.

            // XXX: "this.ready" seems to be more intuitive on the HTML side than
            // "this.mountPromise" because if the user has a reference to a
            // motor-node or a motor-scene and it exists in DOM, then it is already
            // "mounted" from the HTML API perspective although not necessarily
            // ready because `connectedCallback`. Maybe we can use "mountPromise"
            // for the imperative API, and "ready" for the HTML API. For example:
            //
            // await $('motor-scene')[0].ready // When using the HTML API
            // await node.mountPromise // When using the imperative API
            //
            // Or, maybe we can just use ".ready" in both APIs?...
            this._resolveReadyPromise = null
            this.ready = new Promise(r => this._resolveReadyPromise = r)
        }

        // called by WebComponent#connectedCallback()
        init() {

            // call this._associateImperativeNode() before super.init() because
            // super.init() may call this.childConnectedCallback() which depends
            // on the imperative counterpart existing.
            this._associateImperativeNode()

            super.init()
        }

        /**
         * This method creates the association between this MotorHTMLNode instance
         * and the imperative Node instance.
         *
         * This method may get called by this.init, but can also be called by
         * the Node class if Node is used imperatively. See Node#constructor.
         *
         * @private
         *
         * @param {Object} imperativeCounterpart The imperative counterpart to
         * associate with this MotorHTML element. This parameter is only used in the
         * imperative API constructors, and this happens when using the imperative
         * form of infamous instead of the HTML interface to infamous. When the HTML
         * interface is used, this gets called first without an
         * imperativeCounterpart argument and the call to this in an imperative
         * constructor will be a noop. Basically, either this gets called first by a
         * MotorHTML element, or first by an imperative instance, depending on which
         * API is used first.
         */
        _associateImperativeNode(imperativeCounterpart) {
            // if the association is made already, noop
            if (this.imperativeCounterpart) return

            // if called from an imperative-side class' constructor, associate
            // the passed instance.
            if (imperativeCounterpart) this.imperativeCounterpart = imperativeCounterpart

            // otherwise if called from a MotorHTML class without an argument
            else this.imperativeCounterpart = this._makeImperativeCounterpart()

            this._signalWhenReady()
        }

        /**
         * This method should be overriden by child classes. It should return the
         * imperative-side instance that the HTML-side class (this) corresponds to.
         * @abstract
         */
        _makeImperativeCounterpart() {
            throw new TypeError('This method should be implemented by classes extending DeclarativeBase.')
        }

        async _signalWhenReady() {
            await this.imperativeCounterpart.mountPromise
            this._resolveReadyPromise()
        }

        childConnectedCallback(child) {
            // mirror the DOM connections in the imperative API's virtual scene graph.
            if (child instanceof MotorHTMLNode) {
                this.imperativeCounterpart.addChild(child.imperativeCounterpart)
            }
            else if (typeof HTMLSlotElement != 'undefined' && child instanceof HTMLSlotElement) {
                console.log(' -- a slot child connected!')
            }
            else if (typeof HTMLContentElement != 'undefined' && child instanceof HTMLContentElement) {
                console.log(' -- a content child connected!')
            }
        }

        childDisconnectedCallback(child) {
            // mirror the connection in the imperative API's virtual scene graph.
            if (child instanceof MotorHTMLNode) {
                this.imperativeCounterpart.removeChild(child.imperativeCounterpart)
            }
            else if (typeof HTMLSlotElement != 'undefined' && child instanceof HTMLSlotElement) {
                console.log(' -- a slot child disconnected!')
            }
            else if (typeof HTMLContentElement != 'undefined' && child instanceof HTMLContentElement) {
                console.log(' -- a content child disconnected!')
            }
        }
    }
}

export {DeclarativeBase as default}
