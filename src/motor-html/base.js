import 'document-register-element'
import makeWebComponentBaseClass from './web-component'
import Node from '../motor/Node'

const WebComponent = makeWebComponentBaseClass(window.HTMLElement)

export default
class MotorHTMLBase extends WebComponent {
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
     * @param {Node} imperativeMotorNode The Node to associate with this
     * MotorHTMLNode. This parameter is only used in Node#constructor, and this
     * happens when using the imperative form infamous instead of the HTML
     * interface of infamous. When the HTML interface is used, this gets called
     * first without an imperativeMotorNode argument and the call to this in
     * Node#constructor will then be a noop. Basically, either this gets called
     * first by MotorHTMLNode, or first by Node, depending on which API is used
     * first.
     */
    _associateImperativeNode(imperativeMotorNode) {
        // console.log(' -- associating imperative node')
        if (!this.node) {
            if (imperativeMotorNode && imperativeMotorNode instanceof Node)
                this.node = imperativeMotorNode
            else
                this.node = this._makeImperativeNode()

            this._signalWhenReady()
        }
    }

    // This method should be overriden by child classes. It should return the
    // imperative-side instance that the HTML-side class (this) corresponds to.
    _makeImperativeNode() {
        throw new TypeError('This method should be implemented by class extening MotorHTMLBase.')
    }

    async _signalWhenReady() {
        await this.node.mountPromise
        this._resolveReadyPromise()
    }
}
