import {observe, unobserve} from 'james-bond'
import type {Constructor} from 'lowclass/dist/Constructor.js'
import type {PossiblyCustomElement} from '../core/PossibleCustomElement.js'

// We use this to enforce that the @receiver decorator is used on PropReceiver
// classes.
const isPropReceiverClass = Symbol()

/**
 * @class PropReceiver
 *
 * `mixin`
 *
 * Forwards properties of a specified `observedObject` onto properties of
 * `this` object. The properties to be received from `observedObject` are those
 * listed in the `receivedProperties` array, or the ones decorated with
 * `@receiver`.
 *
 * In particular, LUME uses this to forward properties of a behavior's host
 * element onto the behavior.
 *
 * Example:
 *
 * ```js
 * class SomeBehavior extends PropReceiver(BaseClass) {
 *   receivedProperties = ['foo', 'bar']
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
export function PropReceiver<T extends Constructor<PossiblyCustomElement>>(Base: T = Object as any) {
	return class PropReceiver extends Base {
		// @ts-ignore Make this unknown to the type system, otherwise we get "has or is using private name" errors due to declaration emit. :(
		// (https://github.com/microsoft/TypeScript/issues/35822)
		static [isPropReceiverClass as any] = true

		constructor(...args: any[]) {
			super(...args)
			this._propChangedCallback = this._propChangedCallback.bind(this)
		}

		override connectedCallback() {
			super.connectedCallback?.()
			this.receiveProps()
		}

		override disconnectedCallback() {
			super.disconnectedCallback?.()
			this.unreceiveProps()
		}

		/**
		 * @abstract
		 * @property {object} observedObject
		 *
		 * `abstract` `protected` `readonly`
		 *
		 * A subclass should specify the object to observe by defining a `get observedObject` getter.
		 */
		get observedObject(): object {
			throw new TypeError(`implement 'observedObject' in subclass`)
		}

		_propChangedCallback(propName: PropKey, value: any) {
			;(this as any)[propName] = value
		}

		receiveProps() {
			// Make it unique, before we pass it to observe(), just in case.
			if (this.receivedProperties) this.receivedProperties = Array.from(new Set(this.receivedProperties))

			this.receiveInitialValues()

			observe(this.observedObject, this.#getReceivedProps() as never[], this._propChangedCallback, {
				// inherited: true, // XXX the 'inherited' option doesn't work in this case. Why?
			})
		}

		unreceiveProps() {
			unobserve(this.observedObject, this.#getReceivedProps() as never[], this._propChangedCallback)
		}

		/**
		 * @property {string[]} receivedProperties
		 *
		 * `static`
		 *
		 * An array of strings, the properties of observedObject to observe.
		 */
		receivedProperties?: (keyof this['observedObject'])[] = []

		#getReceivedProps(): Array<keyof this['observedObject']> {
			const props = this.receivedProperties || []
			// @prod-prune
			if (!Array.isArray(props)) throw new TypeError('Expected receivedProperties to be an array.')
			return props
		}

		receiveInitialValues() {
			const observed = this.observedObject

			for (const prop of this.#getReceivedProps()) {
				if (prop in observed) {
					const value = (observed as any)[prop]
					// @ts-expect-error indexed access of this
					this._propChangedCallback(prop, value !== undefined ? value : this[prop])
				}
			}
		}
	}
}

function checkIsObject(o: unknown): o is object {
	if (typeof o !== 'object') throw new Error('cannot use @receiver on class returning a non-object instance')
	return true
}

export function receiver(_: unknown, context: DecoratorContext): any {
	const {kind, name} = context

	if (kind === 'field') {
		return function (this: InstanceType<ReturnType<typeof PropReceiver>>, initialValue: unknown) {
			checkIsObject(this)
			trackReceiverProperty(this, name)
			return initialValue
		}
	} else if (kind === 'getter' || kind === 'setter' || kind === 'accessor') {
		context.addInitializer!(function (this: unknown) {
			checkIsObject(this)
			trackReceiverProperty(this as InstanceType<ReturnType<typeof PropReceiver>>, name)
		})
	} else {
		throw new TypeError(
			'@receiver is for use only on class fields, getters/setters, and auto accessors. Also make sure your class extends from PropReceiver.',
		)
	}
}

function trackReceiverProperty(obj: InstanceType<ReturnType<typeof PropReceiver>>, name: PropKey) {
	const ctor = obj.constructor as ReturnType<typeof PropReceiver>

	if (!(ctor as any)[isPropReceiverClass])
		throw new TypeError('@receiver must be used on a property of a class that extends PropReceiver')

	// Ensure we modify the own property if any, and not an inherited property which would break other inheriting objects.
	if (!obj.hasOwnProperty('receivedProperties')) obj.receivedProperties = [...(obj.receivedProperties || [])]

	if (!obj.receivedProperties) debugger
	obj.receivedProperties!.push(name as never)
}

type PropKey = string | symbol
