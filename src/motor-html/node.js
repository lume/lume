import 'document-register-element'

import Node from '../motor/Node'

import jss from '../jss'

class MotorHTMLNode extends HTMLElement {
    createdCallback() {
        console.log('<motor-node> createdCallback()')
        this._attached = false
        this._attachPromise = null
        this._cleanedUp = true

        this.node = this.makeNode()
        this.createChildObserver()

        this.childObserver.observe(this, { childList: true })

        // XXX: "this.mountPromise" vs "this.ready":
        //
        // "ready" seems to be more intuitive on the HTML side because
        // if the user has a reference to a motor-node or a motor-scene
        // and it exists in DOM, then it is already "mounted" from the
        // HTML API perspective. Maybe we can use "mountPromise" for
        // the imperative API, and "ready" for the HTML API. For example:
        //
        // await $('motor-scene')[0].ready // When using the HTML API
        // await node.mountPromise // When using the imperative API
        //
        // Or, maybe we can just use ".ready" for in both APIs?...
        this.ready = this.node.mountPromise
        //console.log(' -- mount promise?', this.node.constructor.name, this.ready)

        console.log(' -- node scene?', this.node.constructor.name, this.node.scene)
        setTimeout(() => console.log(' -- node scene (after timeout)?', this.node.constructor.name, this.node.scene), 5000)
    }

    makeNode() {
        return new Node
    }

    createChildObserver() {
        this.childObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                let domNodes = Array.from(mutation.addedNodes)

                domNodes = domNodes.filter(domNode => {
                    let keep = true

                    if (
                        domNode.nodeName.match(/^MOTOR-/)
                        || (

                            // Ignore the motorDomSceneContainer because we
                            // won't move it (that should stay in place inside
                            // of the <motor-scene> element). Other elements
                            // get moved into the scene graph (for example, if
                            // you put a <div> inside of a <motor-node>, then
                            // that <div> gets transplanted into the Motor
                            // scene graph DOM tree which is rooted in the
                            // <motor-scene>. You'll understand what this means
                            // now if you take a look in the element inspector.
                            domNode.className // some domNodes don't have a class name (#text, #comment, #document).
                            && domNode.className.match(/^motorDomSceneContainer/)
                        )
                    ) {
                        keep = false
                    }

                    return keep
                })

                domNodes.forEach(domNode => {

                    // this is kind of a hack: we remove the content
                    // from the motor-node in the actual DOM and put
                    // it in the node-controlled element, which may
                    // make it a little harder to debug, but at least
                    // for now it works.
                    //
                    // TODO TODO: When using the HTML API, make Nodes use
                    // the custom element itself instead of creating a
                    // parallel DOM representation. I.e. Node.element holds
                    // a ref to the actual motor-node or motor-scene
                    // elements instead of other elements that are
                    // currently created in the Node class.
                    this.node.element.element.appendChild(domNode)
                })
            })
        })
    }

    async attachedCallback() {
        console.log('<motor-node> attachedCallback()', this.id)
        this._attached = true

        // If the node is currently being attached, wait for that to finish
        // before attaching again, to avoid a race condition. This will almost
        // never happen, but just in case, it'll protect against naive
        // programming on the end-user's side (which is fine, we want to make
        // programming easy on their side, f.e., if they attach the motor-node
        // element to the DOM then move it to a new element within the same
        // tick.
        if (this._attachPromise) await this._attachPromise

        let resolve = null
        this._attachPromise = new Promise(r => resolve = r)

        if (this._cleanedUp) {
            this._cleanedUp = false

            this.childObserver.observe(this, { childList: true })
        }

        // Attach this motor-node's Node to the parent motor-node's
        // Node (doesn't apply to motor-scene, which doesn't have a
        // parent to attach to).
        if (this.nodeName.toLowerCase() != 'motor-scene')
            this.parentNode.node.addChild(this.node)

        // There's currently no asynchronous behavior in this attachedCallback,
        // so the _attachPromise is resolved synchronously here.
        resolve()
        this._attachPromise = null
    }

    async detachedCallback() {
        console.log('<motor-node> detachedCallback()')
        this._attached = false

        // If the node is currently being attached, wait for that to finish
        // before starting the detach process (to avoid a race condition).
        // if this._attachPromise is null, excution continues without
        // going to the next tick
        if (this._attachPromise) await this._attachPromise

        // XXX For performance, deferr to the next tick before cleaning up
        // in case the element is actually being re-attached somewhere else
        // within this same tick (detaching and attaching is synchronous,
        // so by deferring to the next tick we'll be able to know if the
        // element was re-attached or not in order to clean up or not), in
        // which case we want to preserve the style sheet, preserve the
        // animation frame, and keep the scene in the sceneList. {{
        await Promise.resolve() // deferr to the next tick.
        // If the scene wasn't re-attached, clean up.  TODO (performance):
        // How can we coordinate this with currently running animations so
        // that Garabage Collection doesn't make the frames stutter?
        if (!this._attached) {
            this.cleanUp()
        }
        // }}
    }

    cleanUp() {
        this.childObserver.disconnect()

        // TODO: anything else?

        this._cleanedUp = true
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        //console.log('<motor-node> attribute')
        this.updateNodeProperty(attribute, oldValue, newValue)
    }

    updateNodeProperty(attribute, oldValue, newValue) {
        // TODO: Handle actual values (not just string property values as
        // follows) for performance; especially when DOMMatrix is supported
        // by browsers.

        // attributes on our HTML elements are the same name as those on
        // the Node class (the setters).
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
            else { /* crickets */ }
        }
    }
}
MotorHTMLNode = document.registerElement('motor-node', MotorHTMLNode)

export default MotorHTMLNode

function parseNumberArray(str) {
    if (!isNumberArrayString(str))
        throw new Error(`Invalid array. Must be an array of numbers of length 3.`)

    let numbers = str.split('[')[1].split(']')[0].split(',')

    numbers = numbers.map(num => window.parseFloat(num))
    return numbers
}

function parseStringArray(str) {
    let strings = str.split('[')[1].split(']')[0].split(',')
    strings = strings.map(str => str.trim())
    return strings
}

function isNumberArrayString(str) {
    return !!str.match(/^\s*\[\s*(-?((\d+\.\d+)|(\d+))(\s*,\s*)?){3}\s*\]\s*$/g)
}
