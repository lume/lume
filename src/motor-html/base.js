import 'document-register-element'
import makeWebComponentBaseClass from './web-component'

// ... Little did I know that the `makeWebComponentBaseClass` function I made is
// considered a form of mixin. ...
// TODO: follow the mixin pattern as with Node and Scene classes.

class MotorHTMLBase extends makeWebComponentBaseClass(window.HTMLElement) {
    createdCallback() {
        super.createdCallback()

        this.node = null // to hold the imperative API Node instance.

        // XXX: "this.mountPromise" vs "this.ready":
        // "ready" seems to be more intuitive on the HTML side because
        // if the user has a reference to a motor-node or a motor-scene
        // and it exists in DOM, then it is already "mounted" from the
        // HTML API perspective. Maybe we can use "mountPromise" for
        // the imperative API, and "ready" for the HTML API. For example:
        //
        // await $('motor-scene')[0].ready // When using the HTML API
        // await node.mountPromise // When using the imperative API
        //
        // Or, maybe we can just use ".ready" in both APIs?...
        this._resolveReadyPromise = null
        this.ready = new Promise(r => this._resolveReadyPromise = r)
    }

    init() {
        this._associateImperativeNode()
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
     * @param {Object} imperativeCounterPart The imperative counterpart to
     * associate with this MotorHTML element. This parameter is only used in the
     * imperative API constructors, and this happens when using the imperative
     * form of infamous instead of the HTML interface to infamous. When the HTML
     * interface is used, this gets called first without an
     * imperativeCounterPart argument and the call to this in an imperative
     * constructor will be a noop. Basically, either this gets called first by a
     * MotorHTML element, or first by an imperative instance, depending on which
     * API is used first.
     */
    _associateImperativeNode(imperativeCounterPart) {
        // if the association is made already, noop
        if (this.node) return

        // if called from an imperative-side class' constructor, associate
        // the passed instance.
        if (imperativeCounterPart) this.node = imperativeCounterPart

        // otherwise if called from a MotorHTML class without an argument
        else this.node = this._makeImperativeCounterpart()

        this._signalWhenReady()
    }

    // This method should be overriden by child classes. It should return the
    // imperative-side instance that the HTML-side class (this) corresponds to.
    _makeImperativeCounterpart() {
        throw new TypeError('This method should be implemented by classes extending MotorHTMLBase.')
    }

    async _signalWhenReady() {
        await this.node.mountPromise
        this._resolveReadyPromise()
    }
}

export {MotorHTMLBase as default}
