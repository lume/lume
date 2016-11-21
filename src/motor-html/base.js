/* global HTMLSlotElement */

import WebComponent from './web-component'
import MotorHTMLNode from './node'
import { observeChildren } from '../motor/Utility'

var DeclarativeBase

// Override HTMLElement.prototype.attachShadow in v1, and
// HTMLElement.prototype.createShadowRoot in v0, so that we can make a Map of
// motor- elements to their shadow roots, so we can always get a reference to
// the element's shadow root even if it is closed.
const observers = new WeakMap
function hijack(original) {
    return function(...args) {
        // In v0, shadow roots can be replaced, but in v1 calling attachShadow
        // on an element that already has a root throws. So, we can set this to
        // true, and if the try-catch passes then we know we have a v0 root and
        // that the root was just replaced.
        const oldRoot = this.shadowRoot
        let root = null
        try {
            root = original.call(this, ...args)
        }
        catch (e) { throw e }
        if (this instanceof DeclarativeBase) {
            this.hasShadowRoot = true
            if (oldRoot) {
                onV0ShadowRootReplaced.call(this, oldRoot)
            }
            const observer = observeChildren(root, shadowRootChildAdded.bind(this), shadowRootChildRemoved.bind(this))
            observers.set(root, observer)

            for (const child of this.children) {
                if (child instanceof DeclarativeBase) {
                    child.isPossiblyDistributed = true
                }
            }
        }
        return root
    }
}
function shadowRootChildAdded(child) {
    if (!(child instanceof DeclarativeBase)) return
    this.imperativeCounterpart.addChild(child.imperativeCounterpart)
    console.log('added:', child)
    console.log(this.shadowRoot.children)
}
function shadowRootChildRemoved(child) {
    if (!(child instanceof DeclarativeBase)) return
    this.imperativeCounterpart.removeChild(child.imperativeCounterpart)
    console.log('removed:', child)
    console.log(this.shadowRoot.children)
}
function onV0ShadowRootReplaced(oldRoot) {
    observers.get(oldRoot).disconnect()
    observers.delete(oldRoot)
    let i = 0
    for (let child of oldRoot.childNodes) {
        if (child instanceof DeclarativeBase) {
            // We should disconnect the imperative connection (f.e. so it is
            // not rendered in WebGL)...
            this.imperativeCounterpart.removeChild(child.imperativeCounterpart)
            // ...but we should place the element back where it was so there's
            // no surprises to the HTML-API user who might go looking for the
            // element. Due to the fact that the observer on the oldRoot was
            // removed, adding the element back to the oldRoot won't cause it
            // to be reconnected on the imperative side.
            oldRoot.insertBefore(child, oldRoot.childNodes[i])
        }
        i += 1
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

            // true if this node has a shadow root (even if it is "closed", see
            // hijack function above). Once true always true because shadow
            // roots cannot be removed.
            this.hasShadowRoot = false

            // True when this node has a parent that has a shadow root. When
            // using the HTML API, Imperative API can look at this to determine
            // whether to render this node or not, in the case of WebGL.
            this.isPossiblyDistributed = false

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

            // XXX: we call this._associateImperativeNode() before super.init() because
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
                if (this.hasShadowRoot) child.isPossiblyDistributed = true
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
                child.isPossiblyDistributed = false
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
