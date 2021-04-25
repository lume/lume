import {observe, unobserve} from 'james-bond'

import type {Constructor} from 'lowclass'

export function ForwardProps<T extends Constructor<CustomElementLike>>(Base: T = Object as any) {
	// TODO Maybe this class should not depend on DOM (i.e. don't use methods
	// from PossibleCustomElement), and we can have a separate mixin for that.

	// TODO Use abstract with TS 4.2
	return class ForwardProps extends Base {
		constructor(...args: any[]) {
			super(...args)
			this._propChangedCallback = this._propChangedCallback.bind(this)
		}

		connectedCallback() {
			super.connectedCallback && super.connectedCallback()
			this._forwardInitialProps()
			this.#observeProps()
		}

		disconnectedCallback() {
			super.disconnectedCallback && super.disconnectedCallback()
			this.#unobserveProps()
		}

		get _observedObject(): object {
			throw new TypeError(`
                The subclass using ForwardProps must define a protected
                _observedObject property defining the object from which props
                are forwarded.
            `)
		}

		_propChangedCallback(propName: string, value: any) {
			;(this as any)[propName] = value
		}

		#observeProps() {
			observe(this._observedObject, this._forwardedProps(), this._propChangedCallback, {
				// inherited: true, // XXX the 'inherited' option doesn't work in this case. Why?
			})
		}

		#unobserveProps() {
			unobserve(this._observedObject, this._forwardedProps(), this._propChangedCallback)
		}

		static _observedProperties?: string[]

		_forwardedProps(): string[] {
			const props = (this.constructor as typeof ForwardProps)._observedProperties || []
			// @prod-prune
			if (!Array.isArray(props))
				throw new TypeError('Expected protected static _observedProperties to be an array.')
			return props
		}

		_forwardInitialProps() {
			const observed = this._observedObject

			for (const prop of this._forwardedProps()) {
				prop in observed && this._propChangedCallback(prop, (observed as any)[prop])
			}
		}
	}
}

export interface CustomElementLike {
	connectedCallback?(): void
	disconnectedCallback?(): void
	adoptedCallback?(): void
	attributeChangedCallback?(name: string, oldVal: string | null, newVal: string | null): void
}
