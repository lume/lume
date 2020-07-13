import {Mixin, MixinResult, Constructor} from 'lowclass'

// TODO @trusktr, make strongly typed event args. Combine with stuff in Events.ts (or similar).

// TODO @trusktr, Make sure emit will not attempt to call event handlers removed
// during emit (in place modification of listeners array during emit iteration
// will try to access undefined after the end of the array). Possibly use
// for..of with a Set instead, otherwise modify the iteration index manually.

/**
 * @class Eventful - An instance of Eventful emits events that code can
 * subscribe to with callbacks. Events may optionally pass a payload to the
 * callbacks.
 *
 * Callbacks can be associated with contexts to be called with (called with
 * Function.prototype.call), which offers more performance than similar
 * patterns that don't allow contexts to be specified (in those cases the user
 * has to create new arrow functions or function clones with
 * Function.prototype.bind, which is heavier).
 *
 * For example, suppose some object `rectangle` emits events named "resize".
 * One can react to those events by subscribing to them with a callback:
 *
 * ```js
 * const onResize = size => {
 *   // whenever `object` emits a "resize" event, the event passes a payload
 *   // containing the new size of `object`:
 *   console.log(size) // for example, {x: 123, y: 123}
 * }
 *
 * rectangle.on("resize", onResize)
 * ```
 *
 * To stop reacting to the "resize" event later, we can unsubscribe the
 * callback from the "resize" events:
 *
 * ```js
 * rectangle.off("resize", onResize)
 * ```
 */
export const Eventful = Mixin(EventfulMixin)
export interface Eventful extends InstanceType<typeof Eventful> {}
export default Eventful

export function EventfulMixin<T extends Constructor>(Base: T) {
	class Eventful extends Constructor(Base) {
		/**
		 * @method on - Register a `callback` to be executed any
		 * time an event with name `eventName` is triggered by an instance of
		 * Eventful. If a `context` is passed to `.on()`, the `callback` is
		 * associated with both `eventName` and `context`. Make sure to also
		 * call `.off()` with the same `context` or else the callabck
		 * associated with that `context` will not be removed.
		 *
		 * @param {string} eventName - The name of the event to listen for.
		 * @param {Function} callback - A callback that will be called anytime the event named `eventName` happens. The callback may receive certain arguments depending on the event that the callback is subscribed to.
		 * @param {any} context - An optional context to call the callback with. Passing no context is the same as subscribing `callback` for a `context` of `undefined`.
		 */
		on(eventName: string, callback: Function, context?: any) {
			let eventMap = this.__eventMap

			// @prod-prune
			if (typeof callback !== 'function')
				throw new Error('Expected a function in callback argument of Eventful#on.')

			if (!eventMap) eventMap = this.__eventMap = new Map()

			let callbacks = eventMap.get(eventName)

			if (!callbacks) eventMap.set(eventName, (callbacks = []))

			callbacks.push([callback, context])
		}

		/**
		 * @method off - Stop a `callback` from being fired for event named `eventName`. If
		 * the callback was previously registered along with a `context` in
		 * `.on()`, be sure to pass the `context` to `.off()` as well.
		 *
		 * @param {string} eventName - The name of the event to unsubscribe `callback` from.
		 * @param {Function} callback - The callback that will be no longer be executed when the event happens.
		 * @param {any} context - A context associated with `callback`. Not passing a `context` arg is equivalent to unsubscribing the `callback` for `context` of `undefined`.
		 */
		off(eventName: string, callback?: Function, context?: any) {
			const eventMap = this.__eventMap

			if (!eventMap) return

			const callbacks = eventMap.get(eventName)

			if (!callbacks) return

			const index = callbacks.findIndex(tuple => tuple[0] === callback && tuple[1] === context)

			if (index === -1) return

			callbacks.splice(index, 1)

			if (callbacks.length === 0) eventMap.delete(eventName)

			if (eventMap.size === 0) this.__eventMap = null
		}

		/**
		 * @method emit - Cause the event with name `eventName` to be emitted
		 * (i.e. cause the event to happen). Any callbacks subscribed to the
		 * event will be executed and passed the arguments that passed into the
		 * emit call.
		 *
		 * For example, inside a Rectangle class we might see
		 *
		 * ```js
		 * this.emit("resize", {x, y})
		 * ```
		 *
		 * @param {string} eventName - The name of the event to emit.
		 * @param {data} any - The data that is passed to each callback subscribed to the event.
		 */
		emit(eventName: string, data?: any) {
			const eventMap = this.__eventMap

			if (!eventMap) return

			const callbacks = eventMap.get(eventName)

			if (!callbacks) return

			let tuple: typeof callbacks[0]
			let callback: typeof callbacks[0][0]
			let context: typeof callbacks[0][1]

			for (let i = 0, len = callbacks.length; i < len; i += 1) {
				tuple = callbacks[i]
				callback = tuple[0]
				context = tuple[1]
				callback.call(context, data)
			}
		}

		private __eventMap: Map<string, Array<[Function, any]>> | null = null
	}

	return Eventful as MixinResult<typeof Eventful, T>
}
