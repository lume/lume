import 'element-behaviors'
import ForwardProps from './ForwardProps'

import type {Constructor} from 'lowclass'
import type Node from '../../core/Node'

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
		if (this.requiredElementType) this.__checkElementIsLibraryElement(element)

		this.element = element as any
	}

	/**
	 * @property {Constructor<Element>} requiredElementType - A subclass can
	 * specify this property (whose value should be a constructor) in order to
	 * enforce that the behavior operates only on a certain type of element. If
	 * a type is specified, an error will be thrown if this.element is not of
	 * the specified type. If the element name has a hyphen in it, the logic
	 * will consider it to possibly be a custom element and will wait for it to
	 * be upgraded before performing the check; if the custom element is not
	 * upgraded within a second, an error is thrown.
	 */
	// TODO support an array of types.
	requiredElementType?: Constructor<Element>

	// used by ForwardProps. See ForwardProps.js
	protected get _observedObject() {
		return this.element
	}

	// a promise resolved when an element is upgraded
	private __whenDefined: Promise<void> = null! as Promise<void>

	private __elementDefined = false

	// TODO add a test to make sure this check works
	private async __checkElementIsLibraryElement(element: Element) {
		const BaseClass = this.requiredElementType

		if (!BaseClass) return

		if (element.nodeName.includes('-')) {
			this.__whenDefined = customElements.whenDefined(element.nodeName.toLowerCase())

			// We use `.then` here on purpose, so that setting
			// __elementDefined happens in the very first microtask after
			// __whenDefined is resolved. Otherwise if we set
			// __elementDefined after awaiting the following Promise.race,
			// then it will happen on the second microtask after
			// __whenDefined is resolved. Our goal is to have APIs ready as
			// soon as possible in the methods above that wait for
			// __whenDefined.
			this.__whenDefined.then(() => {
				this.__elementDefined = element instanceof BaseClass
			})

			await Promise.race([this.__whenDefined, new Promise(r => setTimeout(r, 1000))])

			if (!this.__elementDefined)
				throw new Error(`
                    Either the element you're using the behavior on is not an
                    instance of ${BaseClass.name}, or there was a 1-second
                    timeout waiting for the element to be defined. Please make
                    sure all elements you intend to use are defined.
                `)
		} else {
			throw new Error(`
                    The element you're using the mesh behavior on (<${element.tagName.toLowerCase()}>)
                    is not an instance of ${BaseClass.name}.
                `)
		}
	}
}

export {Behavior}
