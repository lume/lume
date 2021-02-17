import 'element-behaviors'
import ForwardProps from './ForwardProps.js'

import type {Element as LumeElement} from '@lume/element'
import type {Constructor} from 'lowclass'
import type Node from '../../core/Node.js'

/**
 * Base class for all behaviors
 */
export default abstract class Behavior extends ForwardProps {
	// If true, elementBehaviors will wait for a custom element to be defined
	// before running "connectedCallback" or "disconnectedCallback" on the
	// behavior. This guarantees that the host element is already upgraded
	// before the life cycle hooks run.
	awaitElementDefined = true

	element: Node

	constructor(element: Element) {
		super()

		// Ensure this.element is the type specified by a subclass's requiredElementType.
		this.__checkElementIsLibraryElement(element)

		this.element = element as any
	}

	/**
	 * @method requiredElementType - A subclass can
	 * specify this property (whose value should be a constructor) in order to
	 * enforce that the behavior operates only on a certain type of element. If
	 * a type is specified, an error will be thrown if this.element is not of
	 * the specified type. If the element name has a hyphen in it, the logic
	 * will consider it to possibly be a custom element and will wait for it to
	 * be upgraded before performing the check; if the custom element is not
	 * upgraded within a second, an error is thrown.
	 *
	 * @returns {Constructor<Element>}
	 */
	// TODO support an array of types for behaviors that are allowed on multiple types of elements.
	abstract requiredElementType(): Constructor<Element>

	// used by ForwardProps. See ForwardProps.js
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
	private async __checkElementIsLibraryElement(element: Element) {
		const BaseClass = this.requiredElementType()

		if (!BaseClass) return

		if (element.nodeName.includes('-')) {
			this.__whenDefined = customElements.whenDefined(element.nodeName.toLowerCase())

			this.__whenDefined.then(() => {
				this.__elementDefined = element instanceof BaseClass

				this.__fowardPreUpgradeValues()
			})

			await Promise.race([this.__whenDefined, new Promise(r => setTimeout(r, 1000))])

			if (!this.__elementDefined) {
				throw new Error(`
                    Either the element you're using the behavior on is not an
                    instance of ${BaseClass.name}, or there was a 1-second
                    timeout waiting for the element to be defined. Please make
                    sure all elements you intend to use are defined.
				`)
			}
		} else {
			throw new Error(`
				The element you're using the mesh behavior on (<${element.tagName.toLowerCase()}>)
				is not an instance of ${BaseClass.name}.
			`)
		}
	}
}

export {Behavior}

function isLumeElement(el: Element): el is LumeElement {
	return '_preUpgradeValues' in el
}
