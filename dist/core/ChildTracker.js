import { Constructor } from 'lowclass';
import { observeChildren } from './utils/observeChildren.js';
// TODO add childAttributeChangedCallback, similar to attributeChangedCallback?
/**
 * @class ChildTracker - A mixin for use with custom elements, for tracking
 * children of a custom element. In a similar pattern as with custom element
 * `connectedCallback` and `disconnectedCallback`, when a child is connected
 * `childConnectedCallback(child)` will be called and when a child is
 * disconnected `childDisconnectedCallback(child)` will be called.
 */
export function ChildTracker(Base) {
    return class ChildTracker extends Constructor(Base) {
        /**
         * @property {boolean} awaitChildrenDefined When `true`,
         * `childConnectedCallback`s will not fire until those children are
         * upgraded (if they are possibly custom elements, having a hyphen in
         * their name). If a child is disconnected before it has been upgraded,
         * then `childDisconnectedCallback` will not be called and any pending
         * `childConnectedCallback` will be canceled.
         */
        awaitChildrenDefined = true;
        /**
         * @property {boolean} syncChildCallbacks When `true`,
         * `childConnectedCallback`s will be fired for existing children when
         * this element is connected into the DOM, and
         * `childDisconnectedCallback`s will be fired when `this` is
         * disconnected from the DOM.
         *
         * This can be useful for instantiation and cleanup logic that depends
         * on children, not just when children are (dis)connected, but any time
         * this element is (dis)connected. Sometimes children are not custom
         * elements, and don't have their own (dis)connectedCallbacks, hence the
         * need in such cases for a parent to manage setup/cleanup logic based on
         * the connection of non-custom elements.
         */
        syncChildCallbacks = true;
        constructor(...args) {
            super(...args);
            this.#createObserver();
        }
        connectedCallback() {
            super.connectedCallback?.();
            if (this.syncChildCallbacks)
                this.#runChildConnectedCallbacks();
            this.#createObserver();
        }
        disconnectedCallback() {
            super.disconnectedCallback?.();
            if (this.syncChildCallbacks)
                this.#runChildDisconnectedCallbacks();
            this.#destroyObserver();
        }
        #awaitedChildren = new Set();
        #runChildConnectedCallbacks() {
            for (let el = this.firstElementChild; el; el = el.nextElementSibling)
                this.#runChildConnect(el);
        }
        #runChildConnect(child) {
            const elementIsUpgraded = child.matches(':defined');
            if (elementIsUpgraded || !this.awaitChildrenDefined) {
                this.childConnectedCallback?.(child);
            }
            else {
                if (!this.#awaitedChildren.has(child)) {
                    this.#awaitedChildren.add(child);
                    customElements.whenDefined(child.tagName.toLowerCase()).then(() => {
                        this.#awaitedChildren.delete(child);
                        if (!this.isConnected)
                            return;
                        this.childConnectedCallback?.(child);
                    });
                }
            }
        }
        #runChildDisconnectedCallbacks() {
            for (let el = this.firstElementChild; el; el = el.nextElementSibling)
                this.#runChildDisconnect(el);
        }
        #runChildDisconnect(child) {
            if (this.#awaitedChildren.has(child))
                return;
            this.childDisconnectedCallback?.(child);
        }
        #unobserveChildren = null;
        #createObserver() {
            if (this.#unobserveChildren)
                return;
            // observeChildren returns a MutationObserver observing childList
            this.#unobserveChildren = observeChildren({
                target: this,
                onConnect: (child) => {
                    if (!this.isConnected)
                        return;
                    this.childConnectedCallback && this.childConnectedCallback(child);
                },
                onDisconnect: (child) => {
                    if (!this.isConnected)
                        return;
                    this.childDisconnectedCallback && this.childDisconnectedCallback(child);
                },
            });
        }
        #destroyObserver() {
            if (!this.#unobserveChildren)
                return;
            this.#unobserveChildren();
            this.#unobserveChildren = null;
        }
    };
}
//# sourceMappingURL=ChildTracker.js.map