import type {SharedAPI} from './SharedAPI'

/**
 * @private
 */
export class ElementOperations {
	#element: SharedAPI

	constructor(element: SharedAPI) {
		this.#element = element
	}

	#shouldRender = false

	applyProperties() {
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

	#applySize() {
		const {x, y} = this.#element.calculatedSize

		this.#applyStyle('width', `${x}px`)
		this.#applyStyle('height', `${y}px`)

		// NOTE: we ignore the Z axis on elements, since they are flat.
	}

	#applyOpacity() {
		this.#applyStyle('opacity', this.#element.opacity.toString())
	}

	#applyStyle(property: string, value: string) {
		this.#element.style.setProperty(property, value)
	}
}
