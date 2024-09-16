import type { Constructor } from 'lowclass/dist/Constructor.js';
/**
 * @mixin - TODO make this @mixin tag do something in the docs.
 * @class Settable - This class provides a simple `set()` method that can be used
 * to set multiple properties of an instance at once. See `set()` method
 * description.
 *
 * This class is a mixin. Use it like so:
 *
 * ```js
 * class MyClass extends Settable() {
 *   // ...
 * }
 * ```
 *
 * or
 *
 * ```js
 * class MyClass extends Settable(SomeBaseClass) {
 *   // ...
 * }
 * ```
 */
export declare function Settable<T extends Constructor>(Base?: T): {
    new (...a: any[]): {
        /**
         * @method set - Convenience method for setting all (or some)
         * properties of a Settable at once. For example:
         *
         * ```js
         * class Foo extends Settable {
         *   a = 1
         *   b = 2
         * }
         *
         * const obj = new Foo().set({
         *   a: 3,
         *   b: 4
         * })
         * ```
         *
         * @param {this} props - An object containing all properties to set. For example:
         */
        set<T_1 extends any, K extends keyof T_1, V extends T_1[K]>(props: Partial<Record<K, V>>): any;
    };
} & T;
export type SettableInstance = InstanceType<ReturnType<typeof Settable>>;
//# sourceMappingURL=Settable.d.ts.map