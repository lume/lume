
import styles from './HTMLNode.style'
import Transformable from '../core/Transformable'
import Sizeable from '../core/Sizeable'
import DeclarativeBase, {initDeclarativeBase, proxyGettersSetters} from './DeclarativeBase'

initDeclarativeBase()

class HTMLNode extends DeclarativeBase {
    construct() {
        super.construct()
    }

    getStyles() {
        return styles
    }

    // TODO: get these from somewhere dynamically, and do same for
    // proxyGettersSetters and _updateNodeProperty
    static get observedAttributes() { return [
        'sizeMode',
        'size',
        'align',
        'mountPoint',
        'rotation',
        'position',
        'scale',
        'origin',
        'skew',
        'opacity',
    ].map(a => a.toLowerCase())}

    attributeChangedCallback(...args) {
        super.attributeChangedCallback(...args)
        this._updateNodeProperty(...args)
    }

    _updateNodeProperty(attribute, oldValue, newValue) {
        // attributes on our HTML elements are the same name as those on
        // the Node class (the setters).
        if (newValue !== oldValue) {
            if (attribute.match(/opacity/i))
                this[attribute] = window.parseFloat(newValue)
            else if (attribute.match(/sizeMode/i))
                this[attribute] = parseStringArray(newValue)
            else if (
                attribute.match(/rotation/i)
                || attribute.match(/scale/i)
                || attribute.match(/position/i)
                || attribute.match(/size/i)
                || attribute.match(/align/i)
                || attribute.match(/mountPoint/i)
                || attribute.match(/origin/i)
                || attribute.match(/skew/i)
            ) {
                this[attribute] = parseNumberArray(newValue)
            }
            else {
                /* nothing, ignore other attributes */
            }
        }
    }
}

// This associates the Transformable getters/setters with the HTML-API classes,
// so that the same getters/setters can be called from HTML side of the API.
proxyGettersSetters(Transformable, HTMLNode)
proxyGettersSetters(Sizeable, HTMLNode)

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
        throw new Error(`Attribute must be a comma- or space-separated sequence of up to three strings, for example "literal proportional". Yours was "${str}".`)
}

export {HTMLNode as default}
