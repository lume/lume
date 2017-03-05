
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
    const numbers = str.split(',')
    return {
        x: window.parseFloat(numbers[0]),
        y: window.parseFloat(numbers[1]),
        z: window.parseFloat(numbers[2]),
    }
}

function parseStringArray(str) {
    checkIsSizeArrayString(str)
    const strings = str.split(',')
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
    return
}

import 'document-register-element'
MotorHTMLNode = document.registerElement('motor-node', MotorHTMLNode)

export {MotorHTMLNode as default}
