import type {Constructor} from 'lowclass'

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
	class Settable extends Base {
		// @ts-ignore, prevent downstream "has or is using private name" errors.
		[isInstance as any] = true

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

	Settable.prototype[isInstance] = true

	return Settable
}

Object.defineProperty(Settable, Symbol.hasInstance, {
	value(obj: any): boolean {
		if (!obj) return false
		if (obj[isInstance]) return true
		return false
	},
})

export type SettableInstance = InstanceType<ReturnType<typeof Settable>>
