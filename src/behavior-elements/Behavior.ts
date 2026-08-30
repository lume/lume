import {css, Element as LumeElement, element} from '@lume/element'
import {effect, Effectful, signal} from 'classy-solid'
import {CompositionTracker, type CompositionType} from '../core/CompositionTracker.js'

/**
 * @class Behavior
 * Base class for all behavior elements.
 *
 * Behavior elements are elements that interact with their composed parent
 * element in a certain way to add features to the composed parent element. It
 * is similar to entities and components in entity-component-system (ECS)
 * frameworks, but in this case the component (behavior) is an element that is a
 * composed child of the entity (composed parent element) that the component is
 * affecting.
 *
 * Because behavior elements are intended to affect their composed parent
 * element, they have no visual representation of their own, and do not render
 * anything themselves, with display:none styling by default. They are simply a
 * way to attach behavior to an element.
 *
 * Example:
 *
 * ```html
 * <some-element>
 *   <!-- Behavior elements are children of the element they affect. -->
 *   <some-behavior></some-behavior>
 *   <other-behavior></other-behavior>
 *
 *   <!-- The element's regular (visible) content. -->
 *   <div>regular content</div>
 * </some-element>
 * ```
 *
 * When `_awaitElementDefined` is `true`, it causes the behavior to wait until
 * the behavior's composed parent element is upgraded if it might be a custom
 * element (i.e. when the composed parent element has a hyphen in its name).
 *
 * The `_parentDefinedEffect` method can be defined by subclasses to define an
 * effect that runs once the composed parent is defined, and it will
 * additionally re-run on changes to any other used signals.
 *
 * Calls a subclass's `requiredParentType` method should return a list of
 * classes (constructors) of allowed types of composed parent elements that the
 * behavior can be operate on. If the composed parent element is not
 * `instanceof` the any class returned by `requiredParentType()`, then an error
 * is shown in console and `_parentDefinedEffect` will not run.
 *
 * Note! For TypeScript users, the type of `.composedParent` needs to be
 * declared in subclasses as a union that matches the classes returned by
 * `requiredParentType`.
 *
 * Example subclass to define a new behavior element:
 *
 * ```ts
 * class MyBehavior extends Behavior {
 *   declare readonly composedParent: MyElement | null
 *
 *   override requiredParentType() {
 *     return [MyElement]
 *   }
 *
 *   override _parentDefinedEffect(composedParent) {
 *     super._parentDefinedEffect(composedParent)
 *
 *     // ...do something with `composedParent` of verified type...
 *
 *     onCleanup(() => {
 *       // ...do cleanup with `composedParent`...
 *     })
 *   }
 * }
 * ```
 *
 * @extends HTMLElement
 */
@element({autoDefine: false})
export abstract class BehaviorEl extends CompositionTracker(Effectful(LumeElement)) {
	// @ts-expect-error override accessor type with field type
	declare readonly composedParent: Element | null

	/**
	 * If true, elementBehaviors will wait for a parent custom element to be
	 * defined before setting _parentIsDefined to true on the behavior. The
	 * behavior can use this signal to wait until the parent element is defined
	 * and upgraded before trying to access it in `createEffect()`.
	 */
	protected readonly _awaitElementDefined = true

	@signal accessor #parentIsDefined = false

	/**
	 * @method requiredParentType - A subclass can override this method in
	 * order to enforce that the behavior can be applied only on certain types
	 * of elements by returning an array of constructors. An error will be
	 * thrown if `this.element` is not an instanceof one of the constructors.
	 *
	 * If the element's tag name has a hyphen in it, the logic will consider it
	 * to possibly be a custom element and will wait for it to be upgraded
	 * before performing the check; if the custom element is not upgraded within
	 * a second, an error is thrown.
	 *
	 * @returns {(typeof LumeElement)[]}
	 */
	requiredParentType(): (typeof Element)[] {
		return [Element]
	}

	#uncomposedPromise: PromiseWithResolvers<void> | null = null

	// @ts-expect-error private effect
	@effect #whenParentDefinedEffect() {
		if (!this.#parentIsDefined) return
		this._parentDefinedEffect(this.composedParent!)
	}

	override composedCallback(composedParent: Element, compositionType: CompositionType) {
		super.composedCallback?.(composedParent, compositionType)

		const parent = composedParent

		if (this._awaitElementDefined && parent.tagName.includes('-')) {
			this.#uncomposedPromise = Promise.withResolvers<void>()

			Promise.race([
				customElements.whenDefined(parent.tagName.toLowerCase()),
				// if the element isn't defined in 1 second, something is
				// probably wrong (like a typo in the tag name, or the user
				// forgot to define the element), so we throw an error in checkElementType.
				new Promise(r => setTimeout(r, 1000)),
				this.#uncomposedPromise.promise,
			]).then(() => {
				if (!this.composedParent) return
				// @prod-prune
				this.#checkElementType()
				this.#parentIsDefined = true
			})
		} else {
			// @prod-prune
			this.#checkElementType()
			this.#parentIsDefined = true
		}
	}

	override uncomposedCallback(uncomposedParent: Element, compositionType: CompositionType) {
		super.uncomposedCallback?.(uncomposedParent, compositionType)
		this.#uncomposedPromise?.resolve()
		this.#uncomposedPromise = null
		this.#parentIsDefined = false
	}

	/**
	 * @protected
	 * @method _parentDefinedEffect - Subclasses can provide this method instead
	 * of using connectedCallback to create effects that run only when both the
	 * composed parent is known and the composed parent is defined if it is a
	 * custom element (with a dash in its name).
	 *
	 * This method is an effect. Any signals accessed in this method will make
	 * it re-run. onCleanup can be used to do cleanup when the effect re-runs or
	 * when the behavior is disconnected.
	 *
	 * Example:
	 *
	 * ```ts
	 * @element
	 * class MyBehavior extends Behavior {
	 *   override _parentDefinedEffect() {
	 *     const [someSignal, setSomeSignal] = createSignal(0)
	 *
	 *     const interval = setInterval(() => setSomeSignal(s => s + 1), 1000)
	 *     onCleanup(() => clearInterval(interval))
	 *
	 *     const parent = this.composedParent!
	 *
	 *     // Do something with parent (which is now guaranteed to be defined
	 *     // and of the correct type).
	 *     createEffect(() => parent.someProp = someSignal())
	 *   }
	 * }
	 * ```
	 *
	 * @param {NonNullable<this['composedParent']>} composedParent The composed
	 * parent element, guaranteed to be defined and of the correct type as
	 * specified by `requiredParentType()`.
	 */
	protected _parentDefinedEffect(composedParent: NonNullable<this['composedParent']> = this.composedParent!) {
		composedParent
	}

	// Checks composedParent is the type specified by a subclass's requiredParentType.
	// TODO add a test to make sure this check works
	// @prod-prune
	#checkElementType() {
		const element = this.composedParent!
		const classes = this.requiredParentType()

		const correctElementType = classes.some(Class => element instanceof Class)
		if (!correctElementType) {
			thro(
				`
				Either the parent element you're using the behavior with
				(<${element.tagName.toLowerCase()}>) is not an instance of one
				of the allowed classes returned by \`requiredParentType\`, or
				there was a 1-second timeout waiting for the parent element to
				be defined. Please make sure all elements you intend to use are
				defined. The allowed classes are:
				`,
				classes,
			)
		}
	}

	override css = css`
		:host {
			display: none;
		}
	`

	// @ts-expect-error Dummy signal field finalizes effects after private fields to prevent TDZ
	@signal private __init_effects_ignore = 0
}

function thro(msg: string, classes: (typeof Element)[]): never {
	console.error(msg, classes)
	throw new Error(`${msg}\n\n${classes.map(c => c.name).join(', ')}`)
}
