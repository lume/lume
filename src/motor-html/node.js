import Scene from '../motor/Scene'
import Node from '../motor/Node'

import jss from '../jss'

/**
 * @class MotorHTMLNode
 */
const MotorHTMLNode = document.registerElement('motor-node', {
    prototype: Object.assign(Object.create(HTMLElement.prototype), {
        createdCallback() {
            console.log('<motor-node> createdCallback()')
            this._attached = false
            this.attachPromise = null
            this._cleanedUp = true

            this.node = this.makeNode()
            this.createChildObserver()

            this.childObserver.observe(this, { childList: true })
        },

        makeNode() {
            return new Node
        },

        createChildObserver() {
            this.childObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    let nodes = Array.from(mutation.addedNodes)

                    nodes = nodes.filter(node => {
                        let keep = true

                        if (
                            node.nodeName.match(/^MOTOR-/)
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
                                node.className // some nodes don't have a class name (#text, #comment, #document).
                                && node.className.match(/^motorDomSceneContainer/)
                            )
                        ) {
                            keep = false
                        }

                        return keep
                    })

                    nodes.forEach(node => {

                        // this is kind of a hack: we remove the content
                        // from the motor-node in the actual DOM and put
                        // it in the node-controlled element, which may
                        // make it a little harder to debug, but at least
                        // for now it works.
                        this.node.element.element.appendChild(node)
                    })
                })
            })
        },

        async attachedCallback() {
            console.log('<motor-node> attachedCallback()')
            this._attached = true

            // If the node is currently being attached, wait for that to finish
            // before attaching again, to avoid a race condition. This will
            // almost never happen, but just in case, it'll protect against
            // naive programming on the end-user's side (f.e., if they attach
            // the motor-node element to the DOM then move it to a new element
            // within the same tick.
            await this.attachPromise

            this.attachPromise = new Promise(async (resolve) => {

                if (this._cleanedUp) {
                    this._cleanedUp = false

                    this.childObserver.observe(this, { childList: true })

                    // the document has to be loaded for before things will render properly.
                    // scene.mountPromise is a promise we can await, at which point the
                    // document is ready and the scene is mounted (although not rendered, as in
                    // matrix transforms and styling are not yet applied).
                    //
                    // TODO mountPromise for Nodes so that we don't have to
                    // check for the scene node specifically.
                    if (this.nodeName == 'MOTOR-SCENE')
                        await this.node.mountPromise

                    // So now we can render after the scene is mounted.
                    // TODO: Move the loop into Motor core, and request frames
                    // for specific nodes only when they update.
                    const loop = () => {
                        this.node.render()
                        this.rAF = requestAnimationFrame(loop)
                    }

                    this.rAF = requestAnimationFrame(loop)
                }

                // The scene doesn't have a parent to attach to.
                if (this.nodeName.toLowerCase() != 'motor-scene')
                    this.parentNode.node.addChild(this.node)

                resolve()
            })
        },

        async detachedCallback() {
            console.log('<motor-node> detachedCallback()')
            this._attached = false

            // If the node is currently being attached, wait for that to finish
            // before starting the detach process (to avoid a race condition).
            // if this.attachPromise is null, excution continues without
            // going to the next tick (TODO: is this something we can rely on
            // in the language spec?).
            if (this.attachPromise) await this.attachPromise
            this.attachPromise = null

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
                this._cleanedUp = true
            }
            // }}
        },

        cleanUp() {
            cancelAnimationFrame(this.rAF)
            this.childObserver.disconnect()
        },

        attributeChangedCallback(attribute, oldValue, newValue) {
            console.log('<motor-node> attributeChangedCallback()')
            this.updateNodeProperty(attribute, oldValue, newValue)
        },

        updateNodeProperty(attribute, oldValue, newValue) {
            // attributes on our HTML elements are the same name as those on
            // the Node class (the setters).
            if (newValue !== oldValue) {
                if (['opacity'].includes(attribute))
                    this.node[attribute] = parseFloat(newValue)
                else if (attribute.match(/sizemode/i))
                    this.node[attribute] = parseStringArray(newValue)
                else
                    this.node[attribute] = parseNumberArray(newValue)
            }
        },
    }),
})

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
