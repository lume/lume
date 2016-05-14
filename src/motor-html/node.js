// TODO Make a Node pool and re-use Nodes instead of creating new ones when
// possible. This is good, for example, when using React and switching
// motor-html nodes in and out of view because React may destroy the motor-html
// instances and instantiate new ones, in which case we can re-use Node
// instances. We'd have to reset the Node properties.

import 'document-register-element'
import Node from '../motor/Node'
import stylesheet from './node-style'

let attachedNodeCount = 0

// Very very stupid hack needed for Safari in order for us to be able to extend
// the HTMLElement class. See:
// https://github.com/google/traceur-compiler/issues/1709
if (typeof window.HTMLElement != 'function') {
    const _HTMLElement = function HTMLElement(){}
    _HTMLElement.prototype = window.HTMLElement.prototype
    window.HTMLElement = _HTMLElement
}

class MotorHTMLNode extends window.HTMLElement {
    createdCallback() {

        // true if motor-node is mounted improperly (not mounted in motor-node or motor-scene)
        this._mountError = false

        this._attached = false
        this._cleanedUp = true
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

    _makeImperativeNode() {
        return new Node({}, this)
    }

    /**
     * Either this gets called by the imperative API when the imperative API
     * makes one of these elements, or it gets called when this element gets
     * appended to another motor-node in attachedCallback.
     * @private
     */
    _init(imperativeMotorNode) {
        if (imperativeMotorNode && imperativeMotorNode instanceof Node)
            this.node = imperativeMotorNode
        else
            this.node = this._makeImperativeNode()

        this._signalWhenReady()
    }

    async _signalWhenReady() {
        await this.node.mountPromise
        this._resolveReadyPromise()
    }

    attachedCallback() {

        // Check that motor-nodes are mounted to motor-scenes or motor-nodes.
        // Scene can be mounted to any element. In the future we could inspect
        // the scene mount point, and advise about posisble styling issues
        // (f.e. making the scene container have a height).
        // TODO: different check needed when using is="" attributes.
        if (this.nodeName == 'MOTOR-NODE') {
            if (! (this.parentNode.nodeName == 'MOTOR-NODE' || this.parentNode.nodeName == 'MOTOR-SCENE') || this.parentNode._mountError) {
                this._mountError = true
                throw new Error('<motor-node> elements must be appended only to <motor-scene> or other <motor-node> elements.')
            }
        }

        attachedNodeCount += 1
        if (attachedNodeCount === 1) this._attachStyle()
        this.classList.add(stylesheet.classes.motorNodeElement)

        if (!this.node)
            this._init()

        this._attached = true

        if (this._cleanedUp) {
            this._cleanedUp = false

            // make stuff here if needed.
        }

        // Attach this motor-node's Node to the parent motor-node's
        // Node (doesn't apply to motor-scene, which doesn't have a
        // parent to attach to).
        // TODO: prevent this call if attachedCallback happened to to call to
        // addChild on the imperative side.
        if (this.nodeName != 'MOTOR-SCENE')
            this.parentNode.node.addChild(this.node)
    }

    _attachStyle() {
        // XXX create stylesheet inside animation frame?
        stylesheet.attach()
    }

    // TODO XXX: remove corresponding imperative Node from it's parent.
    async detachedCallback() {
        if (this.nodeName == 'MOTOR-NODE' && this._mountError) {
            this._mountError = false
            return
        }

        this._attached = false

        // XXX Deferr to the next tick before cleaning up in case the element
        // is actually being re-attached somewhere else within this same tick
        // (detaching and attaching is synchronous, so by deferring to the next
        // tick we'll be able to know if the element was re-attached or not in
        // order to clean up or not). If the element gets re-attached before
        // the next tick, then we want to preserve the style sheet, preserve
        // the animation frame, and keep the scene in the sceneList by not
        // running the following this._cleanUp() call. {{
        await Promise.resolve() // deferr to the next tick.

        // If the scene wasn't re-attached in the last tick, clean up.
        // TODO (performance): Should we coordinate this._cleanUp() with
        // animation loop to prevent jank?
        if (!this._attached && !this._cleanedUp) {
            this._cleanUp()
        }

        // }}
    }

    _cleanUp() {

        // TODO: We can clean up the style after some time, for example like 1
        // minute, or something, instead of instantly.
        attachedNodeCount -= 1
        if (attachedNodeCount === 0) {
            stylesheet.detach()
        }

        this._cleanedUp = true
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        this._updateNodeProperty(attribute, oldValue, newValue)
    }

    async _updateNodeProperty(attribute, oldValue, newValue) {
        // TODO: Handle actual values (not just string property values as
        // follows) for performance; especially when DOMMatrix is supported
        // by browsers.

        // if not initialized yet, wait.
        if (!this.node) await this.ready

        // attributes on our HTML elements are the same name as those on
        // the Node class (the setters).
        // TODO: make a list of the properties (or get them dynamically) then
        // assign them dynamically.
        if (newValue !== oldValue) {
            if (attribute.match(/opacity/i))
                this.node[attribute] = parseFloat(newValue)
            else if (attribute.match(/sizemode/i))
                this.node[attribute] = parseStringArray(newValue)
            else if (
                attribute.match(/rotation/i)
                || attribute.match(/scale/i)
                || attribute.match(/position/i)
                || attribute.match(/absoluteSize/i)
                || attribute.match(/proportionalSize/i)
                || attribute.match(/align/i)
                || attribute.match(/mountPoint/i)
                || attribute.match(/origin/i) // origin is TODO on imperative side.
            ) {
                this.node[attribute] = parseNumberArray(newValue)
            }
            else {
                /* nothing, ignore other attributes */
            }
        }
    }
}
MotorHTMLNode = document.registerElement('motor-node', MotorHTMLNode)

// Node methods not to proxy (private underscored methods are detected and
// ignored).
const methodProxyBlacklist = [
    'constructor',
    'parent',
    'children', // proxying this one would really break stuff (f.e. React)
    'element',
    'scene',
    'addChild',
    'addChildren',
    'removeChild',
    'removeChildren',
]

function proxyNodeMethods() {
    const nodeProps = Object.getOwnPropertyNames(Node.prototype)

    for (let prop of nodeProps) {
        // skip the blacklisted properties
        if (methodProxyBlacklist.includes(prop)) continue

        // skip the private underscored properties
        if (prop.indexOf('_') == 0) continue

        const proxyDescriptor = {}
        const actualDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, prop)

        // if the property has a setter
        if (actualDescriptor.set) {
            Object.assign(proxyDescriptor, {
                set(value) {
                    this.node[prop] = value
                }
            })
        }

        // if the property has a getter
        if (actualDescriptor.get) {
            Object.assign(proxyDescriptor, {
                get() {
                    return this.node[prop]
                }
            })
        }

        Object.defineProperty(MotorHTMLNode.prototype, prop, proxyDescriptor)
    }
}

proxyNodeMethods()

export default MotorHTMLNode

function parseNumberArray(str) {
    checkIsNumberArrayString(str)

    let numbers = str.split(',')

    numbers = numbers.map(num => window.parseFloat(num))
    return numbers
}

function parseStringArray(str) {
    let strings = str.split(',')
    strings = strings.map(str => str.trim())
    return strings
}

function checkIsNumberArrayString(str) {
    if (!str.match(/^\s*(-?((\d+\.\d+)|(\d+))(\s*,\s*)?){3}\s*$/g))
        throw new Error(`Invalid array. Must be an array of numbers of length 3, for example "1, 2.5,3" without brackets. Yours was ${str}.`)
}
