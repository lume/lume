// XXX should we import a polyfill? Or let the end user do that?
import 'document-register-element'

//import 'webcomponents.js-v1/src/CustomElements/v1/native-shim'
//import 'webcomponents.js-v1/src/CustomElements/v1/CustomElements'

import styles from './node-style'
import Node, {Transformable} from '../motor/Node'
import MotorHTMLBase from './base'
import MotorHTMLScene from './scene'
import { proxyGettersSetters } from '../motor/Utility'

// XXX we'll export the class directly for v1 Custom Elements, and encourage
// end users to define the name of the element as they see fit. We won't
// define the name ourselves like we do here.
let MotorHTMLNode = document.registerElement('motor-node',
class MotorHTMLNode extends MotorHTMLBase {

    createdCallback() {
        super.createdCallback()

        // true if MotorHTMLNode is mounted improperly (not mounted in another
        // MotorHTMLNode or MotorHTMLScene element.)
        this._attachError = false
    }

    connectedCallback() {

        // Check that motor-nodes are mounted to motor-scenes or
        // motor-nodes. Scene can be mounted to any element. In the future
        // we could inspect the scene mount point, and advise about posisble
        // styling issues (f.e. making the scene container have a height).
        //
        // XXX: different check needed when using is="" attributes. For now,
        // we'll discourage use of the awkward is="" attribute.
        if (
            !(
                this.parentNode instanceof MotorHTMLNode ||
                this.parentNode instanceof MotorHTMLScene
            )
            || this.parentNode._attachError // TODO, #40
        ) {

            this._attachError = true
            throw new Error('<motor-node> elements must be appended only to <motor-scene> or other <motor-node> elements.')
        }

        super.connectedCallback()
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
        // TODO: prevent this call if connectedCallback happened to call to
        // addChild on the imperative side.
        this.parentNode.imperativeCounterpart.addChild(this.imperativeCounterpart)
        // TODO: ^ Update when/if Scene no longer extends from Node, as API
        // might change.
    }

    // this is called in connectedCallback, at which point this element has a
    // parentNode.
    // @override
    _makeImperativeCounterpart() {
        return new Node({
            _motorHtmlCounterpart: this
        })
    }

    // TODO XXX: remove corresponding imperative Node from it's parent.
    disconnectedCallback() {
        if (this._attachError) {
            this._attachError = false
            return
        }

        super.disconnectedCallback()
    }

    attributeChangedCallback(attribute, oldValue, newValue) {
        this._updateNodeProperty(attribute, oldValue, newValue)
    }

    async _updateNodeProperty(attribute, oldValue, newValue) {
        // TODO: Handle actual values (not just string property values as
        // follows) for performance; especially when DOMMatrix is supported
        // by browsers.

        // if not initialized yet, wait before setting the attribute.
        // XXX What happens if this is called many times before the Node is
        // ready? Will it set an attribute perhaps many times at once when the
        // node becomes ready?
        if (!this.imperativeCounterpart) await this.ready

        // attributes on our HTML elements are the same name as those on
        // the Node class (the setters).
        // TODO: make a list of the properties (or get them dynamically) then
        // assign them dynamically.
        if (newValue !== oldValue) {
            if (attribute.match(/opacity/i))
                this.imperativeCounterpart[attribute] = window.parseFloat(newValue)
            else if (attribute.match(/sizeMode/i))
                this.imperativeCounterpart[attribute] = parseStringArray(newValue)
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
                this.imperativeCounterpart[attribute] = parseNumberArray(newValue)
            }
            else {
                /* nothing, ignore other attributes */
            }
        }
    }
})

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

// This associates the Transformable getters/setters with the HTML-API classes,
// so that the same getters/setters can be called from HTML side of the API.
if (Transformable && MotorHTMLNode)
    proxyGettersSetters(Transformable, MotorHTMLNode)

export {MotorHTMLNode as default}
