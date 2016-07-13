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
}

export {ElementManager as default}
