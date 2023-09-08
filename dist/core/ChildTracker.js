import { Constructor } from 'lowclass';
import { observeChildren } from './utils/observeChildren.js';
export function ChildTracker(Base) {
    return class ChildTracker extends Constructor(Base) {
        awaitChildrenDefined = true;
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
                skipTextNodes: true,
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