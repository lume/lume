
import styles from './node-style'
import Node from '../motor/Node'
import Transformable from '../motor/Transformable'
import Sizeable from '../motor/Sizeable'
import MotorHTMLBase, {initMotorHTMLBase} from './base'

initMotorHTMLBase()

// XXX we'll export the class directly for v1 Custom Elements, and encourage
// end users to define the name of the element as they see fit. We won't
// define the name ourselves like we do here.
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
}

// This associates the Transformable getters/setters with the HTML-API classes,
// so that the same getters/setters can be called from HTML side of the API.
proxyGettersSetters(Transformable, MotorHTMLNode)
proxyGettersSetters(Sizeable, MotorHTMLNode)

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

// Creates setters/getters on the TargetClass which proxy to the
// setters/getters on SourceClass.
function proxyGettersSetters(SourceClass, TargetClass) {

    // Node methods not to proxy (private underscored methods are also detected and
    // ignored).
    //
    // XXX Should use a whitelist instead of a blacklist?
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

    const props = Object.getOwnPropertyNames(SourceClass.prototype)

    for (let prop of props) {
        if (
            // skip the blacklisted properties
            methodProxyBlacklist.indexOf(prop) >= 0

            // skip the private underscored properties
            || prop.indexOf('_') == 0

            // skip properties that are already defined.
            || TargetClass.prototype.hasOwnProperty(prop)
        ) continue

        const targetDescriptor = {}
        const sourceDescriptor = Object.getOwnPropertyDescriptor(SourceClass.prototype, prop)

        // if the property has a setter
        if (sourceDescriptor.set) {
            Object.assign(targetDescriptor, {
                set(value) {
                    this.imperativeCounterpart[prop] = value
                }
            })
        }

        // if the property has a getter
        if (sourceDescriptor.get) {
            Object.assign(targetDescriptor, {
                get() {
                    return this.imperativeCounterpart[prop]
                }
            })
        }

        Object.defineProperty(TargetClass.prototype, prop, targetDescriptor)
    }
}

import 'document-register-element'
MotorHTMLNode = document.registerElement('motor-node', MotorHTMLNode)

export {MotorHTMLNode as default}
