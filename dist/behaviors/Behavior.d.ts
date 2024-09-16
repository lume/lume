import 'element-behaviors';
import type { ElementWithBehaviors, PossibleBehaviorInstance } from 'element-behaviors';
import type { AnyConstructor } from 'lowclass/dist/Constructor.js';
/**
 * Alias of the `@element` decorator used on custom elements for use on Behavior
 * classes. If a name is passed in, it defines an element behavior instead of a
 * custom element.
 *
 * Besides defining an element behavior instead of a custom element, it re-uses
 * the `@element` implementation: sets up `observedAttributes`,
 * `attributeChangedCallback`, and makes properties be Solid signals by
 * composing `@reactive` and `@signal` decorators).
 *
 * Example:
 *
 * ```js
 * ⁣@behavior('my-behavior')
 * class MyBehavior extends Behavior {
 *   ⁣@numberAttribute foo = 123
 * }
 * ```
 */
export declare function behavior(name: string): <T extends AnyConstructor<PossibleBehaviorInstance>>(Class: T, context?: ClassDecoratorContext) => T;
export declare function behavior<T extends AnyConstructor<PossibleBehaviorInstance>>(Class: T, context?: ClassDecoratorContext): T;
declare const Behavior_base: {
    new (...args: any[]): {
        connectedCallback(): void;
        disconnectedCallback(): void;
        readonly observedObject: object;
        _propChangedCallback(propName: string | symbol, value: any): void;
        receiveProps(): void;
        unreceiveProps(): void;
        receivedProperties?: never[] | undefined;
        "__#5@#getReceivedProps"(): never[];
        receiveInitialValues(): void;
        adoptedCallback?(): void;
        attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void;
    };
} & (new (...a: any[]) => import("../index.js").PossiblyCustomElement);
/**
 * @class Behavior
 * Base class for all LUME behaviors.
 *
 * Features:
 * - Sets `static awaitElementDefined` to `true`, which causes `elementBehaviors` to wait until the behavior's host element is upgraded if it might be a custom element (i.e. when the host element has a hyphen in its name).
 * - Assigns the host element onto `this.element` for convenience.
 * - Calls a subclass's `requiredElementType` method which should return the type (constructor) of allowed elements that the behavior can be hosted on. If the element is not instanceof the `requiredElementType()`, then an error is shown in console. For TypeScript users, it enforces the type of `.element` in subclass code.
 * - Forwards the properties specified in `receivedProperties` from `observedObject` to `this` any time `receivedProperties` on `observedObject` change. Useful for forwarding JS properties from the host element to the behavior. This functionality comes from the [`PropReceiver`](./PropReceiver) class.
 *
 * @extends PropReceiver
 */
export declare abstract class Behavior extends Behavior_base {
    #private;
    static awaitElementDefined: boolean;
    element: Element;
    constructor(element: ElementWithBehaviors);
    /**
     * @method requiredElementType - A subclass can override this method in
     * order to enforce that the behavior can be applied only on certain types
     * of elements by returning an array of constructors. An error will be
     * thrown if `this.element` is not an instanceof one of the constructors.
     *
     * If the element's tag name has a hyphen in it, the logic will consider it
     * to possibly be a custom element and will wait for it to be upgraded
     * before performing the check; if the custom element is not upgraded within
     * a second, an error is thrown.
     *
     * @returns {[typeof Element]}
     */
    requiredElementType(): {
        new (): Element;
        prototype: Element;
    }[];
    get observedObject(): Element;
    receiveInitialValues(): void;
}
export {};
//# sourceMappingURL=Behavior.d.ts.map