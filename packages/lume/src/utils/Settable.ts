import {Mixin, Constructor, MixinResult} from 'lowclass'

/**
 * @class Settable - This class provides a simple `set()` method that can be used
 * to set multiple properties of an instance at once. See `set()` method
 * description.
 */
export const Settable = Mixin(SettableMixin)
export interface Settable extends InstanceType<typeof Settable> {}
export default Settable

function SettableMixin<T extends Constructor>(Base: T) {
	class Settable extends Constructor(Base) {
		/**
		 * @method set - Convenience method for setting all (or some)
		 * properties of a Settable at once.
		 *
		 * @param {this} props - An object containing all properties to set. For example:
		 *
		 * ```js
		 * class Foo extends Settable {
		 *   a = 1
		 *   b = 2
		 * }
		 * const obj = new Foo().set({
		 *   a: 3,
		 *   b: 4
		 * })
		 * ```
		 */
		set(props: Partial<this>) {
			Object.assign(this, props)
			// for (const prop of Object.keys(props)) {
			// 	// @ts-ignore
			// 	this[prop] = props[prop]
			// }
			return this
		}
	}

	return Settable as MixinResult<typeof Settable, T>
}
