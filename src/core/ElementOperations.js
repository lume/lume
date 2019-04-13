import Class from 'lowclass'
import {native} from 'lowclass/native'
import './Camera'
import Node from './Node'

// fallback to experimental CSS transform if browser doesn't have it (fix for Safari 9)
if (typeof document.createElement('div').style.transform == 'undefined') {
    if ( typeof CSSStyleDeclaration !== 'undefined' ) { // doesn't exist in Jest+@skatejs/ssr environment
        Object.defineProperty(CSSStyleDeclaration.prototype, 'transform', {
            set(value) {
                this.webkitTransform = value
            },
            get() {
                return this.webkitTransform
            },
            enumerable: true,
        })
    }
}

/**
 * Manages a DOM element. Exposes a set of recommended APIs for working with
 * DOM efficiently. Currently doesn't do much yet...
 */
export default
Class('ElementOperations', {
    element: null,

    constructor(element) {
        this.element = element
    },

    /**
     * @param {Array.string} classes An array of class names to add to the
     * managed element.
     *
     * Note: updating class names with `el.classList.add()` won't thrash the
     * layout. See: http://www.html5rocks.com/en/tutorials/speed/animations
     */
    setClasses(...classes) {
        if (classes.length) this.element.classList.add(...classes)
        return this
    },

    /**
     * Apply a style property to the element.
     *
     * @private
     * @param  {string} property The CSS property we will a apply.
     * @param  {string} value    The value the CSS property wil have.
     */
    applyStyle(property, value) {
        this.element.style[property] = value
    },

    add(child) {
        this.element.appendChild(child)
    },

    remove(child) {
        // This conditional check is needed incase the element was already
        // removed from the HTML-API side.
        if (child.parentNode === this.element)
            this.element.removeChild(child)
    },

    connectChildElement(child) {
        if (

            // When using the imperative API, this statement is
            // true, so the DOM elements need to be connected.
            !child.parentNode

            // This condition is irrelevant when strictly using the
            // imperative API. However, it is possible that when
            // using the HTML API that the HTML-API node can be placed
            // somewhere that isn't another HTML-API node, and the
            // imperative Node can be gotten and used to add the
            // node to another imperative Node. In this case, the
            // HTML-API node will be added to the proper HTMLparent.
            || (child.parentElement &&
                child.parentElement !== this.element)

            // When an HTML-API node is already child of the
            // relevant parent, or it is child of a shadow root of
            // the relevant parent, there there's nothing to do,
            // everything is already as expected, so the following
            // conditional body is skipped.
        ) {
            this.add(child)
        }
    },

    disconnectChildElement(child) {
        // If DeclarativeBase#remove was called first, we don't need to
        // call this again.
        if (!child.parentNode) return

        this.remove(child)
    },

    /**
     * [applySize description]
     */
    applySize (size) {
        const {x,y} = size

        this.applyStyle('width', `${x}px`)
        this.applyStyle('height', `${y}px`)

        // NOTE: we ignore the Z axis on elements, since they are flat.
    },

    applyOpacity(opacity) {
        this.applyStyle('opacity', opacity)
    },

    applyImperativeNodeProperties(node) {

        // Only Node is Transformable
        if (node instanceof Node) {
            this.applyOpacity(node._properties.opacity)
        }

        // But both Node and Scene are Sizeable
        this.applySize(node.calculatedSize)
    },

    shouldRender(shouldRender) {
        requestAnimationFrame(() => {
            this.applyStyle('display', shouldRender ? 'block' : 'none')
        })
    },
})
