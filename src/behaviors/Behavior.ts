import 'element-behaviors'
import {element} from '@lume/element'
import {PropReceiver} from './PropReceiver.js'

import type {Element as LumeElement} from '@lume/element'
import type {ElementWithBehaviors} from 'element-behaviors'

/**
 * Alias of the `@element` decorator used on custom elements for use on Behavior
 * classes. If a name is passed in, it defines an element behavior instead of a
 * custom element.
 *
 * Besides defining an element behavior instead of a custom element, it re-uses
 * the `@element` implementation: sets up `observedAttributes`,
 * `attributeChangedCallback`, and makes properties be Solid signals by
 * composing `@reactive` and `@signal` decorators).
 *
 * Example (ignore backslashes):
 *
 * ```js
 * \@behavior('my-behavior')
 * class MyBehavior extends Behavior {
 *   \@numberAttribute foo = 123
 * }
 * ```
 */
// TODO avoid `any`
export const behavior = (nameOrClass?: any, context?: any) => {
	if (typeof nameOrClass === 'string' && context == null) {
		return (Class: any, context: any) => elementBehaviors.define(nameOrClass, element(Class, context))
	} else if (context && context.kind === 'class') {
		return element(nameOrClass, context)
	} else {
		throw new TypeError(
			'Invalid decorator usage. Call with a string, or as a plain decorator with, only on a class meant to be used as an element behavior.',
		)
	}
}
/**
 * @class Behavior
 * Base class for all LUME behaviors.
 *
 * Features:
 * - Sets `static awaitElementDefined` to `true`, which causes `elementBehaviors` to wait until the behavior's host element is upgraded if it might be a custom element (i.e. when the host element has a hyphen in its name).
 * - Assigns the host element onto `this.element` for convenience.
 * - Calls a subclass's `requiredElementType` method which should return the type (constructor) of allowed elements that the behavior can be hosted on. If the element is not instanceof the `requiredElementType()`, then an error is shown in console. For TypeScript users, it enforces the type of `.element` in subclass code.
 * - Forwards the properties specified in `receivedProperties` from `observedObject` to `this` any time `receivedProperties` on `observedObject` change. Useful for forwarding JS properties from the host element to the behavior. This functionality comes from the [`PropReceiver`](./PropReceiver) class.
 *
 * @extends PropReceiver
 */
export abstract class Behavior extends PropReceiver() {
	// If true, elementBehaviors will wait for a custom element to be defined
	// before running "connectedCallback" or "disconnectedCallback" on the
	// behavior. This guarantees that the host element is already upgraded
	// before the life cycle hooks run.
	static awaitElementDefined = true

	element: Element

	constructor(element: ElementWithBehaviors) {
		super()

		// Ensure this.element is the type specified by a subclass's requiredElementType.
		// @prod-prune
		this.#checkElementIsLibraryElement(element)

		this.element = element
	}

	/**
	 * @method requiredElementType - A subclass can override this method in
	 * order to enforce that the behavior can be applied only on certain types
	 * of elements by returning an array of constructors. An error will be
	 * thrown if `this.element` is not an instanceof one of the constructors.
	 *
	 * If the element's tag name has a hyphen in it, the logic will consider it
	 * to possibly be a custom element and will wait for it to be upgraded
	 * before performing the check; if the custom element is not upgraded within
	 * a second, an error is thrown.
	 *
	 * @returns {[typeof Element]}
	 */
	requiredElementType() {
		return [Element]
	}

	// used by PropReceiver. See PropReceiver.ts
	override get observedObject() {
		return this.element
	}

	// a promise resolved when an element is upgraded
	#whenDefined: Promise<unknown> = null! as Promise<unknown>
	#elementDefined = false

	override __forwardInitialProps() {
		super.__forwardInitialProps()
		this.#fowardPreUpgradeValues()
	}

	#preUpgradeValuesHandled = false

	// TODO Write a test to ensure that pre-upgrade values are handled.
	#fowardPreUpgradeValues() {
		if (this.#preUpgradeValuesHandled) return

		const el = this.observedObject

		if (!isLumeElement(el)) return

		this.#preUpgradeValuesHandled = true

		for (const prop of this.__forwardedProps()) {
			// prettier-ignore
			const value = el.
				// @ts-ignore protected access is ok here
				_preUpgradeValues
				.get(prop)

			if (value !== undefined) this._propChangedCallback(prop, value)
		}
	}

	// TODO add a test to make sure this check works
	// @prod-prune
	async #checkElementIsLibraryElement(element: Element) {
		const classes = this.requiredElementType()

		if (element.nodeName.includes('-')) {
			this.#whenDefined = customElements.whenDefined(element.nodeName.toLowerCase())

			this.#whenDefined.then(() => {
				this.#elementDefined = classes.some(Class => element instanceof Class)

				this.#fowardPreUpgradeValues()
			})

			await Promise.race([this.#whenDefined, new Promise(r => setTimeout(r, 1000))])

			if (!this.#elementDefined) {
				const errorMessage = `
					Either the element you're using the behavior on
					(<${element.tagName.toLowerCase()}>) is not an instance of one
					of the allowed classes, or there was a 1-second timeout waiting
					for the element to be defined. Please make sure all elements
					you intend to use are defined. The allowed classes are:
				`
				queueMicrotask(() => console.error(errorMessage, classes))
				throw new Error(`${errorMessage}

					${classes}
				`)
			}
		} else {
			const errorMessage = `
				The element you're using the mesh behavior on (<${element.tagName.toLowerCase()}>)
				is not an instance of one of the following classes:
			`
			queueMicrotask(() => console.error(errorMessage, classes))
			throw new Error(`${errorMessage}

				${classes}
			`)
		}
	}
}

function isLumeElement(el: Element): el is LumeElement {
	return '_preUpgradeValues' in el
}
