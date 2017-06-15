
import styles from './node-style'
import Node from '../motor/Node'
import Transformable from '../motor/Transformable'
import Sizeable from '../motor/Sizeable'
import MotorHTMLBase, {initMotorHTMLBase, proxyGettersSetters} from './base'

initMotorHTMLBase()

class MotorHTMLNode extends MotorHTMLBase {

    getStyles() {
        return styles
    }

    // this is called by DeclarativeBase#init, which is called by
    // WebComponent#connectedCallback, at which point this element has a
    // parentNode.
    // @override
    _makeImperativeCounterpart() {
        return new Node({
            _motorHtmlCounterpart: this
        })
    }

    async attributeChangedCallback(...args) {
        super.attributeChangedCallback(...args)
        await this._imperativeCounterpartPromise
        this._updateNodeProperty(...args)
    }

    _updateNodeProperty(attribute, oldValue, newValue) {
        // attributes on our HTML elements are the same name as those on
        // the Node class (the setters).
        if (newValue !== oldValue) {
            if (attribute.match(/opacity/i))
                this.imperativeCounterpart[attribute] = window.parseFloat(newValue)
            else if (attribute.match(/sizeMode/i))
                this.imperativeCounterpart[attribute] = parseStringArray(newValue)
            else if (
                attribute.match(/rotation/i)
                || attribute.match(/scale/i)
                || attribute.match(/position/i)
                || attribute.match(/absoluteSize/i)
                || attribute.match(/proportionalSize/i)
                || attribute.match(/align/i)
                || attribute.match(/mountPoint/i)
                || attribute.match(/origin/i)
                || attribute.match(/skew/i)
            ) {
                this.imperativeCounterpart[attribute] = parseNumberArray(newValue)
            }
            else {
                /* nothing, ignore other attributes */
            }
        }
    }
}

// This associates the Transformable getters/setters with the HTML-API classes,
// so that the same getters/setters can be called from HTML side of the API.
proxyGettersSetters(Transformable, MotorHTMLNode)
proxyGettersSetters(Sizeable, MotorHTMLNode)

function parseNumberArray(str) {
    checkIsNumberArrayString(str)
    const numbers = str.trim().split(/(?:\s*,\s*)|(?:\s+)/g)
    const length = numbers.length
    if (length > 0) numbers[0] = window.parseFloat(numbers[0])
    if (length > 1) numbers[1] = window.parseFloat(numbers[1])
    if (length > 2) numbers[2] = window.parseFloat(numbers[2])
    return numbers
}

function parseStringArray(str) {
    checkIsSizeArrayString(str)
    const strings = str.trim().toLowerCase().split(/(?:\s*,\s*)|(?:\s+)/g)
    const length = strings.length
    if (length > 0) strings[0] = strings[0]
    if (length > 1) strings[1] = strings[1]
    if (length > 2) strings[2] = strings[2]
    return strings
}

function checkIsNumberArrayString(str) {
    if (!str.match(/^\s*(((\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+)))\s*,){0,2}(\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+)))))|((\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+)))\s){0,2}(\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+))))))\s*$/g))
        throw new Error(`Attribute must be a comma- or space-separated sequence of up to three numbers, for example "1 2.5 3". Yours was "${str}".`)
}

function checkIsSizeArrayString(str) {
    if (!str.match(/^\s*(((\s*([a-zA-Z]+)\s*,){0,2}(\s*([a-zA-Z]+)))|((\s*([a-zA-Z]+)\s*){1,3}))\s*$/g))
        throw new Error(`Attribute must be a comma- or space-separated sequence of up to three strings, for example "absolute absolute". Yours was "${str}".`)
}

import 'document-register-element'
MotorHTMLNode = document.registerElement('motor-node', MotorHTMLNode)

export {MotorHTMLNode as default}
