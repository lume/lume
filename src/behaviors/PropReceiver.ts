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
export function PropReceiver<T extends Constructor<CustomElementLike>>(Base: T = Object as any) {
	// TODO Maybe this class should not depend on DOM (i.e. don't use methods
	// from PossibleCustomElement), and we can have a separate mixin for that.

	// TODO Use abstract with TS 4.2
	class PropReceiver extends Base {
		constructor(...args: any[]) {
			super(...args)
			this._propChangedCallback = this._propChangedCallback.bind(this)
		}

		override connectedCallback() {
			super.connectedCallback && super.connectedCallback()
			this.__forwardInitialProps()
			this.#observeProps()
		}

		override disconnectedCallback() {
			super.disconnectedCallback && super.disconnectedCallback()
			this.#unobserveProps()
		}

		/**
		 * @property {object} observedObject
		 *
		 * `protected` `readonly`
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

		_propChangedCallback(propName: string, value: any) {
			;(this as any)[propName] = value
		}

		#observeProps() {
			observe(this.observedObject, this.__forwardedProps(), this._propChangedCallback, {
				// inherited: true, // XXX the 'inherited' option doesn't work in this case. Why?
			})

			if (this.__forwardedProps().includes('clipPlanes')) {
				// debugger // FIXME with this debugger, things don't load properly once unpaused, indicating code load order race conditions or something.
			}
		}

		#unobserveProps() {
			unobserve(this.observedObject, this.__forwardedProps(), this._propChangedCallback)
		}

		/**
		 * @property {string[]} receivedProperties
		 *
		 * `static`
		 *
		 * An array of strings, the properties of observedObject to observe.
		 */
		static receivedProperties?: string[]

		__forwardedProps(): string[] {
			const props = (this.constructor as typeof PropReceiver).receivedProperties || []
			// @prod-prune
			if (!Array.isArray(props)) throw new TypeError('Expected protected static receivedProperties to be an array.')
			return props
		}

		__forwardInitialProps() {
			const observed = this.observedObject

			for (const prop of this.__forwardedProps()) {
				prop in observed && this._propChangedCallback(prop, (observed as any)[prop])
			}
		}
	}

	;(PropReceiver as any)[isPropReceiverClass] = true

	return PropReceiver
}

export interface CustomElementLike {
	connectedCallback?(): void
	disconnectedCallback?(): void
	adoptedCallback?(): void
	attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void
}

export function receiver(...args: any[]): any {
	return decoratorAbstraction(decorator, ...args)

	function decorator(prototype: any, propName: string, _descriptor?: PropertyDescriptor) {
		const ctor = prototype?.constructor as ReturnType<typeof PropReceiver> | undefined

		if (!(ctor && (ctor as any)[isPropReceiverClass]))
			throw new TypeError('@receiver must be used on a property of a class that extends PropReceiver')

		if (!ctor.hasOwnProperty('receivedProperties')) ctor.receivedProperties = [...(ctor.receivedProperties || [])]

		ctor.receivedProperties!.push(propName)
	}
}

export function decoratorAbstraction(
	decorator: (prototype: any, propName: string, _descriptor?: PropertyDescriptor) => void,
	handlerOrProtoOrFactoryArg?: any,
	propName?: string,
	descriptor?: PropertyDescriptor,
) {
	// This is true only if we're using the decorator in a Babel-compiled app
	// with non-legacy decorators. TypeScript only has legacy decorators.
	const isDecoratorV2 = handlerOrProtoOrFactoryArg && 'kind' in handlerOrProtoOrFactoryArg

	if (isDecoratorV2) {
		const classElement = handlerOrProtoOrFactoryArg

		return {
			...classElement,
			finisher(Class: Constructor) {
				decorator(Class.prototype, classElement.key)
				return classElement.finisher?.(Class) ?? Class
			},
		}
	}

	if (handlerOrProtoOrFactoryArg && propName) {
		// if being used as a legacy decorator directly
		const prototype = handlerOrProtoOrFactoryArg
		return decorator(prototype, propName, descriptor)
	}

	throw new TypeError('Invalid decorator')
}
