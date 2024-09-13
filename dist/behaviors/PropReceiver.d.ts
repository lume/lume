import type { Constructor } from 'lowclass/dist/Constructor.js';
import type { PossiblyCustomElement } from '../core/PossibleCustomElement.js';
/**
 * @class PropReceiver
 *
 * `mixin`
 *
 * Forwards properties of a specified `observedObject` onto properties of
 * `this` object. The properties to be received from `observedObject` are those
 * listed in the `static receivedProperties` array, or the ones decorated with
 * `@receiver`.
 *
 * In particular, LUME uses this to forward properties of a behavior's host
 * element onto the behavior.
 *
 * Example:
 *
 * ```js
 * class SomeBehavior extends PropReceiver(BaseClass) {
 *   static receivedProperties = ['foo', 'bar']
 *   get observedObject() {
 *     return this.element
 *   }
 * }
 *
 * const behavior = new SomeBehavior()
 * const el = document.querySelector('.some-element-with-some-behavior')
 * el.foo = 123
 * console.log(behavior.foo) // 123
 * ```
 */
export declare function PropReceiver<T extends Constructor<PossiblyCustomElement>>(Base?: T): {
    new (...args: any[]): {
        connectedCallback(): void;
        disconnectedCallback(): void;
        /**
         * @abstract
         * @property {object} observedObject
         *
         * `abstract` `protected` `readonly`
         *
         * A subclass should specify the object to observe by defining a `get observedObject` getter.
         */
        readonly observedObject: object;
        _propChangedCallback(propName: PropKey, value: any): void;
        "__#5@#observeProps"(): void;
        "__#5@#unobserveProps"(): void;
        __getReceivedProps(): never[];
        __receiveInitialValues(): void;
        adoptedCallback?(): void;
        attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void;
    };
    /**
     * @property {string[]} receivedProperties
     *
     * `static`
     *
     * An array of strings, the properties of observedObject to observe.
     */
    receivedProperties?: PropKey[] | undefined;
} & T;
export declare function receiver(_: unknown, context: DecoratorContext): any;
type PropKey = string | symbol;
export {};
//# sourceMappingURL=PropReceiver.d.ts.map