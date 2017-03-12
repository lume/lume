import Node from './Node'
import Motor from './Motor'

/**
 * Manages a DOM element. Exposes a set of recommended APIs for working with
 * DOM efficiently. Currently doesn't do much yet...
 */
class ElementManager {
    constructor(element) {
        this.element = element
    }

    /**
     * @param {Array.string} classes An array of class names to add to the
     * managed element.
     *
     * Note: updating class names with `el.classList.add()` won't thrash the
     * layout. See: http://www.html5rocks.com/en/tutorials/speed/animations
     */
    setClasses (...classes) {
        if (classes.length) this.element.classList.add(...classes)
        return this
    }

    /**
     * Apply a style property to the element.
     *
     * @private
     * @param  {string} property The CSS property we will a apply.
     * @param  {string} value    The value the CSS property wil have.
     */
    applyStyle(property, value) {
        this.element.style[property] = value
    }

    addChild(childElementManager) {
        this.element.appendChild(childElementManager.element)
    }

    removeChild(childElementManager) {
        // This conditional check is needed incase the element was already
        // removed from the HTML-API side.
        if (childElementManager.element.parentNode === this.element)
            this.element.removeChild(childElementManager.element)
    }

    connectChildElement(childImperativeNode) {
        if (

            // When using the imperative API, this statement is
            // true, so the DOM elements need to be connected.
            !childImperativeNode._elementManager.element.parentNode

            // This condition is irrelevant when strictly using the
            // imperative API. However, it is possible that when
            // using the HTML API that the HTML-API node can be placed
            // somewhere that isn't another HTML-API node, and the
            // imperative Node can be gotten and used to add the
            // node to another imperative Node. In this case, the
            // HTML-API node will be added to the proper HTMLparent.
            || (childImperativeNode._elementManager.element.parentElement &&
                childImperativeNode._elementManager.element.parentElement !== this.element)

            // When an HTML-API node is already child of the
            // relevant parent, or it is child of a shadow root of
            // the relevant parent, there there's nothing to do,
            // everything is already as expected, so the following
            // conditional body is skipped.
        ) {
            this.addChild(childImperativeNode._elementManager)
        }
    }

    disconnectChildElement(childImperativeNode) {
        // If DeclarativeBase#removeChild was called first, we don't need to
        // call this again.
        if (!childImperativeNode._elementManager.element.parentNode) return

        this.removeChild(childImperativeNode._elementManager)
    }

    /**
     * Apply the DOMMatrix value to the style of this Node's element.
     */
    applyTransform (domMatrix) {
        var cssMatrixString = `matrix3d(
            ${ domMatrix.m11 },
            ${ domMatrix.m12 },
            ${ domMatrix.m13 },
            ${ domMatrix.m14 },
            ${ domMatrix.m21 },
            ${ domMatrix.m22 },
            ${ domMatrix.m23 },
            ${ domMatrix.m24 },
            ${ domMatrix.m31 },
            ${ domMatrix.m32 },
            ${ domMatrix.m33 },
            ${ domMatrix.m34 },
            ${ domMatrix.m41 },
            ${ domMatrix.m42 },
            ${ domMatrix.m43 },
            ${ domMatrix.m44 }
        )`;

        this.applyStyle('transform', cssMatrixString)
    }

    /**
     * [applySize description]
     */
    applySize (size) {
        const {x,y} = size

        this.applyStyle('width', `${x}px`)
        this.applyStyle('height', `${y}px`)

        // NOTE: we ignore the Z axis on elements, since they are flat.
    }

    applyOpacity(opacity) {
        this.applyStyle('opacity', opacity)
    }

    applyImperativeNodeProperties(node) {

        // Only Node is Transformable
        if (node instanceof Node) {
            this.applyOpacity(node._properties.opacity)
            this.applyTransform(node._properties.transform)
        }

        // But both Node and Scene are Sizeable
        this.applySize(node._calculatedSize)
    }

    shouldRender() {
        const task = Motor.addRenderTask(() => {
            this.applyStyle('display', 'block')
            Motor.removeRenderTask(task)
        })
    }

    shouldNotRender() {
        const task = Motor.addRenderTask(() => {
            this.applyStyle('display', 'none')
            Motor.removeRenderTask(task)
        })
    }
}

export {ElementManager as default}
