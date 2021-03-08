import 'element-behaviors'
import ForwardProps from './ForwardProps.js'
import {defer} from '../../core/Utility.js'

import type {Element as LumeElement} from '@lume/element'
// @ts-ignore the type is used in a JSDoc comment
import type {Constructor} from 'lowclass'

type ElementTypeArrayToInstArray<T extends Constructor[]> = {
	// Pick only the number keys (array values, not array methods and properties).
	[K in keyof T]: InstanceType<T[number & K]>
}
type ArrayValues<T extends any[]> = T[number & keyof T]
type ElementTypes<T extends Constructor[]> = ArrayValues<ElementTypeArrayToInstArray<T>>

/**
 * Base class for all behaviors.
 *
 * Features:
 * - Sets `awaitElementDefined` to `true`, which causes `elementBehaviors` to wait until the behavior's host element is upgraded if it might be a custom element (i.e. when the host element has a hyphen in its name).
 * - Assigns the host element onto `this.element` for convenience.
 * - Calls a subclass's requiredElementType method which should return the type (constructor) of allowed elements that the behavior can be hosted on. If the element is not instanceof the requiredElementType(), then an error is shown in console. For TypeScript users, it enforces the type `element` in subclass code.
 * - Forwards the properties specified in `_observedProperties` from `_observedObject` to `this` any time `_observedProperties` on `_observedObject` change. Useful for forwarding JS properties from the host element to the behavior.
 */
export default abstract class Behavior extends ForwardProps {
	// If true, elementBehaviors will wait for a custom element to be defined
	// before running "connectedCallback" or "disconnectedCallback" on the
	// behavior. This guarantees that the host element is already upgraded
	// before the life cycle hooks run.
	awaitElementDefined = true

	element: ElementTypes<ReturnType<this['requiredElementType']>>

	constructor(element: Element) {
		super()

		// Ensure this.element is the type specified by a subclass's requiredElementType.
		// @prod-prune
		this.__checkElementIsLibraryElement(element)

		this.element = element as ElementTypes<ReturnType<this['requiredElementType']>>
	}

	/**
	 * @method requiredElementType - A subclass can specify override this
	 * method (whose return value should be a constructor) in order to enforce
	 * that the behavior operates only on a certain type of Element. An error
	 * will be thrown if `this.element` is not of the specified type. If the
	 * element name has a hyphen in it, the logic will consider it to
	 * possibly be a custom element and will wait for it to be upgraded before
	 * performing the check; if the custom element is not upgraded within a
	 * second, an error is thrown.
	 *
	 * @returns {Array<typeof Element>}
	 */
	// TODO support an array of types for behaviors that are allowed on
	// multiple types of elements.
	requiredElementType() {
		return [Element]
	}

	// used by ForwardProps. See ForwardProps.ts
	protected get _observedObject() {
		return this.element
	}

	// a promise resolved when an element is upgraded
	private __whenDefined: Promise<void> = null! as Promise<void>
	private __elementDefined = false

	protected _forwardInitialProps() {
		super._forwardInitialProps()
		this.__fowardPreUpgradeValues()
	}

	private __preUpgradeValuesHandled = false

	// TODO Write a test to ensure that pre-upgrade values are handled.
	private __fowardPreUpgradeValues() {
		if (this.__preUpgradeValuesHandled) return

		const el = this._observedObject

		if (!isLumeElement(el)) return

		this.__preUpgradeValuesHandled = true

		for (const prop of this._forwardedProps()) {
			// @ts-ignore, protected access of _preUpgradeValues
			const value = el._preUpgradeValues.get(prop)

			if (value !== undefined) this._propChangedCallback(prop, value)
		}
	}

	// TODO add a test to make sure this check works
	// @prod-prune
	private async __checkElementIsLibraryElement(element: Element) {
		const classes = this.requiredElementType()

		if (element.nodeName.includes('-')) {
			this.__whenDefined = customElements.whenDefined(element.nodeName.toLowerCase())

			this.__whenDefined.then(() => {
				this.__elementDefined = classes.some(Class => element instanceof Class)

				this.__fowardPreUpgradeValues()
			})

			await Promise.race([this.__whenDefined, new Promise(r => setTimeout(r, 1000))])

			if (!this.__elementDefined) {
				const errorMessage = `
					Either the element you're using the behavior on
					(<${element.tagName.toLowerCase()}>) is not an instance of one
					of the allowed classes, or there was a 1-second timeout waiting
					for the element to be defined. Please make sure all elements
					you intend to use are defined. The allowed classes are:
				`
				defer(() => console.error(errorMessage, classes))
				throw new Error(`${errorMessage}

					${classes}
				`)
			}
		} else {
			const errorMessage = `
				The element you're using the mesh behavior on (<${element.tagName.toLowerCase()}>)
				is not an instance of one of the following classes:
			`
			defer(() => console.error(errorMessage, classes))
			throw new Error(`${errorMessage}

				${classes}
			`)
		}
	}
}

export {Behavior}

function isLumeElement(el: Element): el is LumeElement {
	return '_preUpgradeValues' in el
}
