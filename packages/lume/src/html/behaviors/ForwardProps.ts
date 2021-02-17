import {observe, unobserve} from 'james-bond'
import {Mixin, MixinResult, Constructor} from 'lowclass'

import type {PossibleCustomElement} from '../PossibleCustomElement.js'

function ForwardPropsMixin<T extends Constructor<HTMLElement>>(Base: T) {
	// TODO Maybe this class should not depend on DOM (i.e. don't use methods
	// from PossibleCustomElement), and we can have a separate mixin for that.

	// TODO Use abstract with TS 4.2
	class ForwardProps extends Constructor<PossibleCustomElement>(Base) {
		constructor(...args: any[]) {
			super(...args)
			this._propChangedCallback = this._propChangedCallback.bind(this)
		}

		connectedCallback() {
			super.connectedCallback && super.connectedCallback()
			this._forwardInitialProps()
			this.__observeProps()
		}

		disconnectedCallback() {
			super.disconnectedCallback && super.disconnectedCallback()
			this.__unobserveProps()
		}

		protected get _observedObject(): object {
			throw new TypeError(`
                The subclass using ForwardProps must define a protected
                _observedObject property defining the object from which props
                are forwarded.
            `)
		}

		protected _propChangedCallback(propName: string, value: any) {
			;(this as any)[propName] = value
		}

		private __observeProps() {
			observe(this._observedObject, this._forwardedProps(), this._propChangedCallback, {
				// inherited: true, // XXX the 'inherited' option doesn't work in this case. Why?
			})
		}

		private __unobserveProps() {
			unobserve(this._observedObject, this._forwardedProps(), this._propChangedCallback)
		}

		protected static _observedProperties?: string[]

		protected _forwardedProps(): string[] {
			const props = (this.constructor as typeof ForwardProps)._observedProperties || []
			// @prod-prune
			if (!Array.isArray(props))
				throw new TypeError('Expected protected static _observedProperties to be an array.')
			return props
		}

		protected _forwardInitialProps() {
			const observed = this._observedObject

			for (const prop of this._forwardedProps()) {
				prop in observed && this._propChangedCallback(prop, (observed as any)[prop])
			}
		}
	}

	return ForwardProps as MixinResult<typeof ForwardProps, T>
}

export const ForwardProps = Mixin(ForwardPropsMixin)
export interface ForwardProps extends InstanceType<typeof ForwardProps> {}
export default ForwardProps
