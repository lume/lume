import Class from 'lowclass'
import './Camera'

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
const ElementOperations = Class('ElementOperations', ({ Private }) => ({

    constructor(element: HTMLElement) {
        Private(this).__element = element
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
                child.parentElement !== Private(this).__element)

            // When an HTML-API node is already child of the
            // relevant parent, or it is child of a shadow root of
            // the relevant parent, there there's nothing to do,
            // everything is already as expected, so the following
            // conditional body is skipped.
        ) {
            Private(this).__add(child)
        }
    },

    disconnectChildElement(child) {
        // If DeclarativeBase#remove was called first, we don't need to
        // call this again.
        if (!child.parentNode) return

        Private(this).__remove(child)
    },

    applyImperativeNodeProperties() {
        if (!Private(this).__shouldRender) return

        Private(this).__applyOpacity()
        Private(this).__applySize()
    },

    set shouldRender(shouldRender: boolean) {
        Private(this).__shouldRender = shouldRender
        requestAnimationFrame(() => {
            Private(this).__applyStyle('display', shouldRender ? 'block' : 'none')
        })
    },
    get shouldRender(): boolean {
        return Private(this).__shouldRender
    },

    private: {
        __element: undefined! as HTMLElement,
        __shouldRender: false,

        __add(child) {
            Private(this).__element.appendChild(child)
        },

        __remove(child) {
            // This conditional check is needed incase the element was already
            // removed from the HTML-API side.
            if (child.parentNode === Private(this).__element)
                Private(this).__element.removeChild(child)
        },

        __applySize() {
            const {x,y} = (Private(this).__element as any).calculatedSize // TODO ImperativeBase typing

            Private(this).__applyStyle('width', `${x}px`)
            Private(this).__applyStyle('height', `${y}px`)

            // NOTE: we ignore the Z axis on elements, since they are flat.
        },

        __applyOpacity() {
            Private(this).__applyStyle('opacity', (Private(this).__element as any).opacity) // TODO ImperativeBase typing
        },

        /**
         * Apply a style property to the element.
         *
         * @param  {string} property The CSS property we will a apply.
         * @param  {string} value    The value the CSS property wil have.
         */
        __applyStyle(property: string, value: string) {
            Private(this).__element.style.setProperty(property, value)
        },
    },
}))

type ElementOperations = InstanceType<typeof ElementOperations>

export default ElementOperations
