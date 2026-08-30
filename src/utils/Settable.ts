import type {Constructor} from 'lowclass/dist/Constructor.js'

const isInstance = Symbol()

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
export function Settable<T extends Constructor>(Base: T = Object as any) {
	if (Base.prototype instanceof Settable)
		throw new Error('Base class already extends Settable, no need to apply the mixin again.')

	return class Settable extends Base {
		// Use `any` to prevent subclass "has or is using private name" errors.
		get [isInstance as any]() {
			return true
		}

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
		// prettier-ignore
		// set(props: Partial<this>) { // This doesn't work
		set<T extends this, K extends keyof T, V extends T[K]>(props: Partial<Record<K, V>>) { // but this does?
			Object.assign(this, props)
			return this
		}
	}
}

export type AnySettable = InstanceType<ReturnType<typeof Settable>>

export function isAnySettable(o: any): o is AnySettable {
	return o[isInstance]
}

Object.defineProperty(Settable, Symbol.hasInstance, {value: isAnySettable})
