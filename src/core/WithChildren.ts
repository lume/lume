import {observeChildren} from '../core/utils.js'

import {Constructor} from 'lowclass'
import type {PossibleCustomElement, PossibleCustomElementConstructor} from './PossibleCustomElement.js'

export function WithChildren<T extends Constructor<HTMLElement>>(Base: T) {
	// This doesn't work
	// return class WithChildren extends Constructor<PossibleCustomElement & InstanceType<T>, PossibleCustomElementConstructor & T>(Base) {
	// but this does.  Need help from TS gods as to why. https://discord.com/channels/508357248330760243/508357248330760249/942301492503773194
	return class WithChildren extends Constructor<PossibleCustomElement, PossibleCustomElementConstructor & T>(Base) {
		constructor(...args: any[]) {
			super(...args)

			this.#createObserver()

			if (!this.isConnected) {
				this.#handleChildrenWhenConnected = true
				return
			}

			this.#handleConnectedChildren()
		}

		connectedCallback() {
			super.connectedCallback?.()

			if (this.#handleChildrenWhenConnected) {
				this.#handleConnectedChildren()
			}

			this.#createObserver()
		}

		disconnectedCallback() {
			super.disconnectedCallback?.()

			this.#destroyObserver()
			this.#handleChildrenWhenConnected = true
		}

		childConnectedCallback?(_child: Element): void
		childDisconnectedCallback?(_child: Element): void

		#handleChildrenWhenConnected = false
		#observer: MutationObserver | null = null

		#createObserver() {
			if (this.#observer) return

			// observeChildren returns a MutationObserver observing childList
			this.#observer = observeChildren(
				this,
				(child: Element) => {
					if (!this.isConnected) return
					this.childConnectedCallback && this.childConnectedCallback(child)
				},
				(child: Element) => {
					if (!this.isConnected) return
					this.childDisconnectedCallback && this.childDisconnectedCallback(child)
				},
				true,
			)
		}

		#destroyObserver() {
			if (!this.#observer) return
			this.#observer.disconnect()
			this.#observer = null
		}

		#handleConnectedChildren() {
			if (!this.isConnected) return

			for (let element = this.firstElementChild; element; element = element.nextElementSibling) {
				this.#handleConnectedChild(element)
			}
		}

		#handleConnectedChild(element: Element) {
			const elementIsUpgraded = element.matches(':defined')

			if (elementIsUpgraded) {
				this.childConnectedCallback?.(element)
			} else {
				customElements.whenDefined(element.tagName.toLowerCase()).then(() => {
					this.childConnectedCallback?.(element)
				})
			}
		}
	}
}
