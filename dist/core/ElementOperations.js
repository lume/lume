export class ElementOperations {
    #element;
    constructor(element) {
        this.#element = element;
    }
    #shouldRender = false;
    applyProperties() {
        if (!this.#shouldRender)
            return;
        this.#applyOpacity();
        this.#applySize();
    }
    set shouldRender(shouldRender) {
        this.#shouldRender = shouldRender;
        requestAnimationFrame(() => {
            this.#applyStyle('display', shouldRender ? 'block' : 'none');
        });
    }
    get shouldRender() {
        return this.#shouldRender;
    }
    #applySize() {
        const { x, y } = this.#element.calculatedSize;
        this.#applyStyle('width', `${x}px`);
        this.#applyStyle('height', `${y}px`);
    }
    #applyOpacity() {
        this.#applyStyle('opacity', this.#element.opacity.toString());
    }
    #applyStyle(property, value) {
        this.#element.style.setProperty(property, value);
    }
}
//# sourceMappingURL=ElementOperations.js.map