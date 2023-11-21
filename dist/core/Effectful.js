// TODO move Effectful to to classy-solid
import { createEffect, createRoot, getOwner, runWithOwner } from 'solid-js';
/**
 * @class Effectful -
 *
 * `mixin`
 *
 * Create Solid.js effects using `this.createEffect(fn)` and easily stop them
 * all by calling `this.stopEffects()`.
 *
 * Example (note, replace double ampersands with one ampersand):
 *
 * ```js
 * import {element, Effectful} from 'lume'
 *
 * @@element('my-element')
 * class MyElement extends Effectful(HTMLElement) {
 *   @@attribute foo = "foo"
 *   @@attribute bar = "bar"
 *
 *   connectedCallback() {
 *     // Log `foo` and `bar` any time either of them change.
 *     this.createEffect(() => {
 *       console.log('foo, bar:', this.foo, this.bar)
 *     })
 *
 *     // Log only `bar` any time it changes.
 *     this.createEffect(() => {
 *       console.log('bar:', this.bar)
 *     })
 *   }
 *
 *   disconnectedCallback() {
 *     // Stop both of the effects.
 *     this.stopEffects()
 *   }
 * }
 * ```
 */
export function Effectful(Base) {
    return class Effectful extends Base {
        #owner = null;
        #dispose = null;
        /**
         * Create a Solid.js effect. If there's no owner (i.e. this will be a
         * top-level effect) then it implicitly creates an owner. Normally with
         * Solid.js you must use createRoot with top-level effects, and this
         * prevents that for convenience.
         */
        createEffect(fn) {
            if (!this.#owner) {
                createRoot(dispose => {
                    this.#owner = getOwner();
                    this.#dispose = dispose;
                });
            }
            runWithOwner(this.#owner, () => createEffect(fn));
        }
        /**
         * Stop all of the effects that were created. For example, create
         * effects in a constructor, then stop them all in a destructor, to
         * avoid mem leaks.
         */
        stopEffects() {
            this.#dispose?.();
            this.#dispose = null;
            this.#owner = null;
        }
    };
}
/**
 * Shortcut for instantiating directly instead of using the mixin.
 */
export class Effects extends Effectful(Object) {
}
//# sourceMappingURL=Effectful.js.map