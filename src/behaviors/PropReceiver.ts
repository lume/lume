import {observe, unobserve} from 'james-bond'

import type {Constructor} from 'lowclass'

// We use this to enforce that the @receiver decorator is used on PropReceiver
// classes.
//
// We could've used a Symbol instead, which is simpler, but that causes the
// infamous "has or is using private name" errors due to declaration emit
// (https://github.com/microsoft/TypeScript/issues/35822)
const isPropReceiverClass: unique symbol = Symbol()

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
export function PropReceiver<T extends Constructor<PossiblyCustomElement>>(Base: T = Object as any) {
	// TODO Maybe this class should not depend on DOM (i.e. don't use methods
	// from PossibleCustomElement), and we can have a separate mixin for that.

	// TODO Use abstract with TS 4.2
	return class PropReceiver extends Base {
		static {
			// Make this unknown to the type system, otherwise we get errors with the mixin usage downstream. :(
			;(this as any)[isPropReceiverClass] = true
		}

		constructor(...args: any[]) {
			super(...args)
			this._propChangedCallback = this._propChangedCallback.bind(this)
		}

		override connectedCallback() {
			super.connectedCallback?.()
			this.#observeProps()
		}

		override disconnectedCallback() {
			super.disconnectedCallback?.()
			this.#unobserveProps()
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
			throw new TypeError(`
                The subclass using PropReceiver must define
                'observedObject' to specify the object from which props
                are received.
            `)
		}

		_propChangedCallback(propName: PropKey, value: any) {
			;(this as any)[propName] = value
		}

		#observeProps() {
			const ctor = this.constructor as typeof PropReceiver

			// Make it unique, before we pass it to observe(), just in case.
			if (ctor.receivedProperties) ctor.receivedProperties = Array.from(new Set(ctor.receivedProperties))

			this.__receiveInitialValues()

			observe(this.observedObject, this.__getReceivedProps(), this._propChangedCallback, {
				// inherited: true, // XXX the 'inherited' option doesn't work in this case. Why?
			})
		}

		#unobserveProps() {
			unobserve(this.observedObject, this.__getReceivedProps(), this._propChangedCallback)
		}

		/**
		 * @property {string[]} receivedProperties
		 *
		 * `static`
		 *
		 * An array of strings, the properties of observedObject to observe.
		 */
		static receivedProperties?: PropKey[]

		__getReceivedProps() {
			const ctor = this.constructor as typeof PropReceiver
			const props = ctor.receivedProperties || []
			// @prod-prune
			if (!Array.isArray(props)) throw new TypeError('Expected static receivedProperties to be an array.')
			return props as Array<keyof this['observedObject']>
		}

		__receiveInitialValues() {
			const observed = this.observedObject

			for (const prop of this.__getReceivedProps()) {
				if (prop in observed) {
					const value = (observed as any)[prop]
					// @ts-expect-error indexed access of this
					this._propChangedCallback(prop, value !== undefined ? value : this[prop])
				}
			}
		}
	}
}

export interface PossiblyCustomElement {
	connectedCallback?(): void
	disconnectedCallback?(): void
	adoptedCallback?(): void
	attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void
}

function checkIsObject(o: unknown): o is object {
	if (typeof o !== 'object') throw new Error('cannot use @receiver on class returning a non-object instance')
	return true
}

export function receiver(_: unknown, context: DecoratorContext): any {
	const {kind, name} = context

	if (kind === 'field') {
		return function (this: unknown, initialValue: unknown) {
			checkIsObject(this)
			trackReceiverProperty(this!, name)
			return initialValue
		}
	} else if (kind === 'getter' || kind === 'setter' || kind === 'accessor') {
		context.addInitializer!(function (this: unknown) {
			checkIsObject(this)
			trackReceiverProperty(this!, name)
		})
	} else {
		throw new TypeError(
			'@receiver is for use only on class fields, getters/setters, and auto accessors. Also make sure your class extends from PropReceiver.',
		)
	}
}

function trackReceiverProperty(obj: object, name: PropKey) {
	const ctor = obj.constructor as ReturnType<typeof PropReceiver>

	if (!(ctor as any)[isPropReceiverClass])
		throw new TypeError('@receiver must be used on a property of a class that extends PropReceiver')

	if (!ctor.hasOwnProperty('receivedProperties')) ctor.receivedProperties = [...(ctor.receivedProperties || [])]

	ctor.receivedProperties!.push(name)
}

type PropKey = string | symbol
