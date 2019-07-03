// fallback to experimental CSS transform if browser doesn't have it (fix for Safari 9)
if (typeof document.createElement('div').style.transform == 'undefined') {
    if (typeof CSSStyleDeclaration !== 'undefined') {
        // doesn't exist in Jest+@skatejs/ssr environment
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
export default class ElementOperations {
    constructor(private __element: HTMLElement) {}

    connectChildElement(child: HTMLElement) {
        if (
            // When using the imperative API, this statement is
            // true, so the DOM elements need to be connected.
            !child.parentNode ||
            // This condition is irrelevant when strictly using the
            // imperative API. However, it is possible that when
            // using the HTML API that the HTML-API node can be placed
            // somewhere that isn't another HTML-API node, and the
            // imperative Node can be gotten and used to add the
            // node to another imperative Node. In this case, the
            // HTML-API node will be added to the proper HTMLparent.
            (child.parentElement && child.parentElement !== this.__element)

            // When an HTML-API node is already child of the
            // relevant parent, or it is child of a shadow root of
            // the relevant parent, there there's nothing to do,
            // everything is already as expected, so the following
            // conditional body is skipped.
        ) {
            this.__add(child)
        }
    }

    disconnectChildElement(child: HTMLElement) {
        // If DeclarativeBase#remove was called first, we don't need to
        // call this again.
        if (!child.parentNode) return

        this.__remove(child)
    }

    private __shouldRender = false

    applyImperativeNodeProperties() {
        if (!this.__shouldRender) return

        this.__applyOpacity()
        this.__applySize()
    }

    set shouldRender(shouldRender: boolean) {
        this.__shouldRender = shouldRender
        requestAnimationFrame(() => {
            this.__applyStyle('display', shouldRender ? 'block' : 'none')
        })
    }
    get shouldRender(): boolean {
        return this.__shouldRender
    }

    private __add(child: HTMLElement) {
        this.__element.appendChild(child)
    }

    private __remove(child: HTMLElement) {
        // This conditional check is needed incase the element was already
        // removed from the HTML-API side.
        if (child.parentNode === this.__element) this.__element.removeChild(child)
    }

    private __applySize() {
        const {x, y} = (this.__element as any).calculatedSize // TODO TS ImperativeBase typing

        this.__applyStyle('width', `${x}px`)
        this.__applyStyle('height', `${y}px`)

        // NOTE: we ignore the Z axis on elements, since they are flat.
    }

    private __applyOpacity() {
        this.__applyStyle('opacity', (this.__element as any).opacity) // TODO TS ImperativeBase typing
    }

    /**
     * Apply a style property to the element.
     *
     * @param  {string} property The CSS property we will a apply.
     * @param  {string} value    The value the CSS property wil have.
     */
    private __applyStyle(property: string, value: string) {
        this.__element.style.setProperty(property, value)
    }
}

export {ElementOperations}
