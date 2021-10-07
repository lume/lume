// fallback to experimental CSS transform if browser doesn't have it (fix for Safari 9)
if (typeof document.createElement('div').style.transform == 'undefined') {
	if (typeof CSSStyleDeclaration !== 'undefined') {
		// doesn't exist in Jest+@skatejs/ssr environment
		Object.defineProperty(CSSStyleDeclaration.prototype, 'transform', {
			set(value) {
				this.webkitTransform = value
			},
			get() {
				return this.webkitTransform
			},
			enumerable: true,
		})
	}
}

/**
 * Manages the some DOM operations. This is used by ImperativeBase to keep
 * DOM-manipulation code co-located in this separate place. Consider this
 * internal API, not intended for end users.
 * @private
 */
export class ElementOperations {
	#element: HTMLElement

	constructor(element: HTMLElement) {
		this.#element = element
	}

	connectChildElement(child: HTMLElement) {
		if (
			// When using the imperative API, this statement is
			// true, so the DOM elements need to be connected.
			!child.parentNode ||
			// This condition is irrelevant when strictly using the
			// imperative API. However, it is possible that when
			// using the HTML API that the HTML-API node can be placed
			// somewhere that isn't another HTML-API node, and the
			// imperative Node can be gotten and used to add the
			// node to another imperative Node. In this case, the
			// HTML-API node will be added to the proper HTMLparent.
			(child.parentElement && child.parentElement !== this.#element)

			// When an HTML-API node is already child of the
			// relevant parent, or it is child of a shadow root of
			// the relevant parent, there there's nothing to do,
			// everything is already as expected, so the following
			// conditional body is skipped.
		) {
			this.#add(child)
		}
	}

	disconnectChildElement(child: HTMLElement) {
		// If DeclarativeBase#remove was called first, we don't need to
		// call this again.
		if (!child.parentNode) return

		this.#remove(child)
	}

	#shouldRender = false

	applyImperativeNodeProperties() {
		if (!this.#shouldRender) return

		this.#applyOpacity()
		this.#applySize()
	}

	set shouldRender(shouldRender: boolean) {
		this.#shouldRender = shouldRender

		// TODO replace this with Motor.once() (might cause a circular dependency)
		requestAnimationFrame(() => {
			this.#applyStyle('display', shouldRender ? 'block' : 'none')
		})
	}
	get shouldRender(): boolean {
		return this.#shouldRender
	}

	#add(child: HTMLElement) {
		this.#element.appendChild(child)
	}

	#remove(child: HTMLElement) {
		// This conditional check is needed incase the element was already
		// removed from the HTML-API side.
		if (child.parentNode === this.#element) this.#element.removeChild(child)
	}

	#applySize() {
		// TODO remove this any, the refactor code so non-HTMLElement stuff is
		// moved outside of this class.
		const {x, y} = (this.#element as any).calculatedSize

		this.#applyStyle('width', `${x}px`)
		this.#applyStyle('height', `${y}px`)

		// NOTE: we ignore the Z axis on elements, since they are flat.
	}

	#applyOpacity() {
		// TODO remove this any, the refactor code so non-HTMLElement stuff is
		// moved outside of this class.
		this.#applyStyle('opacity', (this.#element as any).opacity.toString())
	}

	/**
	 * Apply a style property to the element.
	 *
	 * @param  {string} property The CSS property we will a apply.
	 * @param  {string} value    The value the CSS property wil have.
	 */
	#applyStyle(property: string, value: string) {
		this.#element.style.setProperty(property, value)
	}
}
