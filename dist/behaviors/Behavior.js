import 'element-behaviors';
import { PropReceiver } from './PropReceiver.js';
export class Behavior extends PropReceiver() {
    static awaitElementDefined = true;
    element;
    constructor(element) {
        super();
        this.#checkElementIsLibraryElement(element);
        this.element = element;
    }
    requiredElementType() {
        return [Element];
    }
    get observedObject() {
        return this.element;
    }
    #whenDefined = null;
    #elementDefined = false;
    __forwardInitialProps() {
        super.__forwardInitialProps();
        this.#fowardPreUpgradeValues();
    }
    #preUpgradeValuesHandled = false;
    #fowardPreUpgradeValues() {
        if (this.#preUpgradeValuesHandled)
            return;
        const el = this.observedObject;
        if (!isLumeElement(el))
            return;
        this.#preUpgradeValuesHandled = true;
        for (const prop of this.__forwardedProps()) {
            const value = el.
                _preUpgradeValues
                .get(prop);
            if (value !== undefined)
                this._propChangedCallback(prop, value);
        }
    }
    async #checkElementIsLibraryElement(element) {
        const classes = this.requiredElementType();
        if (element.nodeName.includes('-')) {
            this.#whenDefined = customElements.whenDefined(element.nodeName.toLowerCase());
            this.#whenDefined.then(() => {
                this.#elementDefined = classes.some(Class => element instanceof Class);
                this.#fowardPreUpgradeValues();
            });
            await Promise.race([this.#whenDefined, new Promise(r => setTimeout(r, 1000))]);
            if (!this.#elementDefined) {
                const errorMessage = `
					Either the element you're using the behavior on
					(<${element.tagName.toLowerCase()}>) is not an instance of one
					of the allowed classes, or there was a 1-second timeout waiting
					for the element to be defined. Please make sure all elements
					you intend to use are defined. The allowed classes are:
				`;
                queueMicrotask(() => console.error(errorMessage, classes));
                throw new Error(`${errorMessage}

					${classes}
				`);
            }
        }
        else {
            const errorMessage = `
				The element you're using the mesh behavior on (<${element.tagName.toLowerCase()}>)
				is not an instance of one of the following classes:
			`;
            queueMicrotask(() => console.error(errorMessage, classes));
            throw new Error(`${errorMessage}

				${classes}
			`);
        }
    }
}
function isLumeElement(el) {
    return '_preUpgradeValues' in el;
}
//# sourceMappingURL=Behavior.js.map