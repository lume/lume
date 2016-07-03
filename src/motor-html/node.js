import 'document-register-element'
//import 'webcomponents.js-v1/src/CustomElements/v1/native-shim'
//import 'webcomponents.js-v1/src/CustomElements/v1/CustomElements'

import styles from './node-style'
import Node from '../motor/Node'
import MotorHTMLBase from './base'
import MotorHTMLScene from './scene'
import { makeLowercaseSetterAliases, proxyMethods } from '../motor/Utility'

class MotorHTMLNode extends MotorHTMLBase {

    // Use constructor() in v1 Custom Elements instead of createdCallback.
    //constructor() {

    createdCallback() {
        super.createdCallback()

        // true if motor-node is mounted improperly (not mounted in motor-node or motor-scene)
        this._attachError = false
    }

    attachedCallback() {

        // Check that motor-nodes are mounted to motor-scenes or
        // motor-nodes. Scene can be mounted to any element. In the future
        // we could inspect the scene mount point, and advise about posisble
        // styling issues (f.e. making the scene container have a height).
        //
        // XXX: different check needed when using is="" attributes. For now,
        // we'll discourage use of the awkward is="" attribute.
        if ( !(this instanceof MotorHTMLScene) ) {
            if (
                !(
                    this.parentNode instanceof MotorHTMLNode
                    || this.parentNode instanceof MotorHTMLScene
                )
                || this.parentNode._attachError // TODO, #40
            ) {

                this._attachError = true
                throw new Error('<motor-node> elements must be appended only to <motor-scene> or other <motor-node> elements.')
            }
        }

        super.attachedCallback()
    }

    getStyles() {
        return styles
    }

    init() {
        super.init()

        // Attach this motor-node's Node to the parent motor-node's
        // Node (doesn't apply to motor-scene, which doesn't have a
        // parent to attach to).
        //
        // TODO: prevent this call if attachedCallback happened to call to
        // addChild on the imperative side.
        if ( !(this instanceof MotorHTMLScene) )
            this.parentNode.node.addChild(this.node)
    }

    // this is called in attachedCallback, at which point this element hasa
    // parentNode.
    // @override
    _makeImperativeNode() {
        return new Node({}, this)
    }

    // TODO XXX: remove corresponding imperative Node from it's parent.
    detachedCallback() {
        if (!(this instanceof MotorHTMLScene) && this._attachError) {
            this._attachError = false
            return
        }

        super.detachedCallback()
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        this._updateNodeProperty(attribute, oldValue, newValue)
    }

    async _updateNodeProperty(attribute, oldValue, newValue) {
        // TODO: Handle actual values (not just string property values as
        // follows) for performance; especially when DOMMatrix is supported
        // by browsers.

        console.log('motor-node not ready yet.')
        // if not initialized yet, wait.
        if (!this.node) await this.ready
        console.log('motor-node ready!')

        // attributes on our HTML elements are the same name as those on
        // the Node class (the setters).
        // TODO: make a list of the properties (or get them dynamically) then
        // assign them dynamically.
        if (newValue !== oldValue) {
            if (attribute.match(/opacity/i))
                this.node[attribute] = window.parseFloat(newValue)
            else if (attribute.match(/sizeMode/i))
                this.node[attribute] = parseStringArray(newValue)
            else if (
                attribute.match(/rotation/i)
                || attribute.match(/scale/i) // scale is TODO on imperative side.
                || attribute.match(/position/i)
                || attribute.match(/absoluteSize/i)
                || attribute.match(/proportionalSize/i)
                || attribute.match(/align/i)
                || attribute.match(/mountPoint/i)
                || attribute.match(/origin/i) // origin is TODO on imperative side.
                || attribute.match(/skew/i) // skew is TODO on imperative side.
            ) {
                this.node[attribute] = parseNumberArray(newValue)
            }
            else {
                /* nothing, ignore other attributes */
            }
        }
    }
}

proxyMethods(Node, MotorHTMLNode)

// XXX we'll export the class directly for v1 Custom Elements, and encourage
// end users to define the name of the element as they see fit. We won't
// define the name ourselves like we do here.
export default
document.registerElement('motor-node', MotorHTMLNode)

// for use by MotorHTML, convenient since HTMLElement attributes are all
// converted to lowercase by default, so if we don't do this then we won't be
// able to map attributes to Node setters as easily.
makeLowercaseSetterAliases(Node.prototype)

function parseNumberArray(str) {
    checkIsNumberArrayString(str)
    let numbers = str.split(',')
    return {
        x: window.parseFloat(numbers[0]),
        y: window.parseFloat(numbers[1]),
        z: window.parseFloat(numbers[2]),
    }
}

function parseStringArray(str) {
    checkIsSizeArrayString(str)
    let strings = str.split(',')
    return {
        x: strings[0].trim(),
        y: strings[1].trim(),
        z: strings[2].trim(),
    }
}

function checkIsNumberArrayString(str) {
    if (!str.match(/^\s*(-?((\d+\.\d+)|(\d+))(\s*,\s*)?){3}\s*$/g))
        throw new Error(`Invalid array. Must be an array of numbers of length 3, for example "1, 2.5,3" without brackets. Yours was ${str}.`)
}

function checkIsSizeArrayString(str) {
    // TODO: throw error if str is not a valid array of size mode strings.
    return
}
