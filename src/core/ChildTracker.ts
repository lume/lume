import {Constructor} from 'lowclass/dist/Constructor.js'
import {observeChildren} from './utils/observeChildren.js'
import type {PossibleCustomElement, PossibleCustomElementConstructor} from './PossibleCustomElement.js'

// TODO add childAttributeChangedCallback, similar to attributeChangedCallback?

/**
 * @class ChildTracker - A mixin for use with custom elements, for tracking
 * children of a custom element. In a similar pattern as with custom element
 * `connectedCallback` and `disconnectedCallback`, when a child is connected
 * `childConnectedCallback(child)` will be called and when a child is
 * disconnected `childDisconnectedCallback(child)` will be called.
 */
export function ChildTracker<T extends Constructor<HTMLElement>>(Base: T) {
	return class ChildTracker extends Constructor<PossibleCustomElement, PossibleCustomElementConstructor & T>(Base) {
		/**
		 * @property {boolean} awaitChildrenDefined When `true`,
		 * `childConnectedCallback`s will not fire until those children are
		 * upgraded (if they are possibly custom elements, having a hyphen in
		 * their name). If a child is disconnected before it has been upgraded,
		 * then `childDisconnectedCallback` will not be called and any pending
		 * `childConnectedCallback` will be canceled.
		 */
		awaitChildrenDefined = true

		/**
		 * @property {boolean} syncChildCallbacks When `true`,
		 * `childConnectedCallback`s will be fired for existing children when
		 * this element is connected into the DOM, and
		 * `childDisconnectedCallback`s will be fired when `this` is
		 * disconnected from the DOM.
		 *
		 * This can be useful for instantiation and cleanup logic that depends
		 * on children, not just when children are (dis)connected, but any time
		 * this element is (dis)connected. Sometimes children are not custom
		 * elements, and don't have their own (dis)connectedCallbacks, hence the
		 * need in such cases for a parent to manage setup/cleanup logic based on
		 * the connection of non-custom elements.
		 */
		syncChildCallbacks = true

		constructor(...args: any[]) {
			super(...args)
			this.#createObserver()
		}

		override connectedCallback() {
			super.connectedCallback?.()
			if (this.syncChildCallbacks) this.#runChildConnectedCallbacks()
			this.#createObserver()
		}

		override disconnectedCallback() {
			super.disconnectedCallback?.()
			if (this.syncChildCallbacks) this.#runChildDisconnectedCallbacks()
			this.#destroyObserver()
		}

		/**
		 * @method childConnectedCallback If defined, this is called any time a child is
		 * connected, with the connected child passed as an argument.
		 */
		childConnectedCallback?(_child: Element): void

		/**
		 * @method childDisconnectedCallback If defined, this is called any time a child
		 * is disconnected, with the disconnected child passed as an argument.
		 */
		childDisconnectedCallback?(_child: Element): void

		#awaitedChildren = new Set<Element>()

		#runChildConnectedCallbacks() {
			for (let el = this.firstElementChild; el; el = el.nextElementSibling) this.#runChildConnect(el)
		}

		#runChildConnect(child: Element) {
			const elementIsUpgraded = child.matches(':defined')

			if (elementIsUpgraded || !this.awaitChildrenDefined) {
				this.childConnectedCallback?.(child)
			} else {
				if (!this.#awaitedChildren.has(child)) {
					this.#awaitedChildren.add(child)

					customElements.whenDefined(child.tagName.toLowerCase()).then(() => {
						this.#awaitedChildren.delete(child)
						if (!this.isConnected) return
						this.childConnectedCallback?.(child)
					})
				}
			}
		}

		#runChildDisconnectedCallbacks() {
			for (let el = this.firstElementChild; el; el = el.nextElementSibling) this.#runChildDisconnect(el)
		}

		#runChildDisconnect(child: Element) {
			if (this.#awaitedChildren.has(child)) return

			this.childDisconnectedCallback?.(child)
		}

		#unobserveChildren: (() => void) | null = null

		#createObserver() {
			if (this.#unobserveChildren) return

			// observeChildren returns a MutationObserver observing childList
			this.#unobserveChildren = observeChildren({
				target: this,
				onConnect: (child: Element) => {
					if (!this.isConnected) return
					this.childConnectedCallback && this.childConnectedCallback(child)
				},
				onDisconnect: (child: Element) => {
					if (!this.isConnected) return
					this.childDisconnectedCallback && this.childDisconnectedCallback(child)
				},
			})
		}

		#destroyObserver() {
			if (!this.#unobserveChildren) return
			this.#unobserveChildren()
			this.#unobserveChildren = null
		}
	}
}
