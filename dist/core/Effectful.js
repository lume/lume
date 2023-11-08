import { createEffect, createRoot, getOwner, runWithOwner } from 'solid-js';
export function Effectful(Base) {
    return class Effectful extends Base {
        #owner = null;
        #dispose = null;
        createEffect(fn) {
            if (!this.#owner) {
                createRoot(dispose => {
                    this.#owner = getOwner();
                    this.#dispose = dispose;
                });
            }
            runWithOwner(this.#owner, () => createEffect(fn));
        }
        stopEffects() {
            this.#dispose?.();
            this.#dispose = null;
            this.#owner = null;
        }
    };
}
//# sourceMappingURL=Effectful.js.map