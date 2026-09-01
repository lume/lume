// CONTINUE Some logic in SharedAPI actually belongs in here, and relies on
// childConnectedCallback. Untangle that from SharedAPI so CompositionTracker
// can fully contain the composition tracking.

// TODO After the above, move this class along with ChildTracker to
// `@lume/element` or somewhere as generic custom element utilities. Sub-classes
// should filter out specific undesired elements while CompositionTracker is generic.

// TODO a more generic v2 implementation: a node shuold be able to observe when
// it is composed into any element, no matter if the element is custom or not.
// Currently, we rely on the composed parent and children both extending from
// CompositionTracker for composition tracking to work, but if an element gets
// composed into some other element like a regular `<div>`, composition is not
// tracked.
// What we need to approximately do is have a CompositionTracker instance detect
// its regular parentElement in `connectedCallback` no matter what element it
// is, observe if it has a `ShadowRoot` by patching global `attachShadow` (with
// the limitation that the code has to be imported before any roots are
// attached) so that we can react to the presence of a ShadowRoot now or in the
// future, then we should enact similar logic as in this class in the
// arbitrary parent element's ShadowRoot.

// TODO update MDN docs on "composed trees" and "flat trees", https://github.com/mdn/content/pull/20703

import {Constructor} from 'lowclass/dist/Constructor.js'
import {observeChildren} from './utils/observeChildren.js'
import type {PossibleCustomElement, PossibleCustomElementConstructor} from './PossibleCustomElement.js'
import {isDomEnvironment} from './utils/isThisOrThat.js'
import {ChildTracker} from './ChildTracker.js'

const isInstance = Symbol()

/**
 * A class that allows tracking the DOM composed tree (Shadow DOM), ultimately
 * allowing consumers to write logic against the shape of the DOM flat tree.
 *
 * Native HTML/CSS engines track the DOM flat tree in order to render built-in
 * elements (<img>, <div>, <button>, etc) the way you expect after composing
 * them with Shadow DOM.
 *
 * An excellent explainer on Shadow DOM concepts:
 * https://hayatoito.github.io/2026/dom/
 *
 * This mixin allows tracking the flat tree just as native browser engines do,
 * but for scenarios such as custom rendering with canvas (e.g. with 2D, WebGL,
 * or WebGPU APIs). When the custom elements with custom rendering are composed
 * with Shadow DOM, their JavaScript implementation will want to know the shape
 * of the flat tree so that rendering can be implemented exactly as the
 * composition of the elements implies.
 *
 * As a concrete example, a library of custom elements could implement rendering
 * using a library like Playcanvas (https://playcanvas.com) that has its own
 * pure-JS concept of a tree of render objects. The custom element
 * implementation would want to ensure that it connects the Playcanvas render
 * objects into a render tree hierarchy that matches with the shape of the DOM
 * flat tree that is formed by composing the custom elements. This includes
 * child elements that are "slotted" to `<slot>` elements in a Shadow DOM, very
 * much similar to concepts such as props.children in React, Preact, and Solid,
 * slots in Vue and Svelte (loosely based on the same concept as Shadow DOM
 * slots), or transclusion in Angular.
 *
 * NOTE: This class exposes closed ShadowRoots and elements inside ShadowRoots.
 * Tracking the flat tree is not easy without access to ShadowRoots and their
 * DOM, so using `closed` roots with this mixin is counterintuitive. This class
 * adds a new `exposedShadowRoot` property that references an attached
 * ShadowRoot even if it is closed, and other properties such as `terminalSlottedParent`
 * that reference elements inside ShadowRoots even if they are closed.
 */
export function CompositionTracker<T extends Constructor<HTMLElement>>(Base: T) {
	if (Base.prototype instanceof CompositionTracker)
		throw new Error('Base class already extends CompositionTracker, no need to apply the mixin again.')

	return class CompositionTracker extends ChildTracker(
		Constructor<PossibleCustomElement, PossibleCustomElementConstructor & T>(Base),
	) {
		// Use `any` to prevent subclass "has or is using private name" errors.
		get [isInstance as any]() {
			return true
		}

		// Overriding HTMLElement.prototype.attachShadow here is part of our
		// implementation for tracking the composed tree and connecting THREE
		// objects in the same structure as the DOM flat tree so that it will
		// render as expected when end users compose elements with ShadowDOM and
		// slots.
		override attachShadow(options: ShadowRootInit): ShadowRoot {
			const root = super.attachShadow(options)

			this.exposedShadowRoot = root

			// Wrapper over MutationObserver
			observeChildren({
				target: root,
				onConnect: this.__shadowRootChildAdded.bind(this),
				onDisconnect: this.__shadowRootChildRemoved.bind(this),
			})

			// Arrray.from is needed for older Safari which can't iterate on HTMLCollection
			const children = Array.from(this.children)

			for (const child of children) {
				if (!isAnyCompositionTracker(child)) continue

				child.isPossiblySlotted = true
				this.__triggerChildUncomposedCallback(this, child, 'actual')
			}

			return root
		}

		/**
		 * The children of this element's ShadowRoot, if any, otherwise an empty
		 * array.
		 *
		 * This is similar to `[...this.shadowRoot.children]`, except that it
		 * gets the children even if the ShadowRoot is closed.
		 */
		get shadowRootChildren(): CompositionTracker[] {
			if (!this.exposedShadowRoot) return []

			return Array.from(this.exposedShadowRoot.children).filter((n): n is CompositionTracker =>
				isAnyCompositionTracker(n),
			)
		}

		/**
		 * Elements that are slotted to a slot that is child of a ShadowRoot of
		 * this element.
		 */
		get shadowRootSlottedChildren(): CompositionTracker[] {
			const result: CompositionTracker[] = []

			for (const child of Array.from(this.exposedShadowRoot?.children || [])) {
				if (child instanceof HTMLSlotElement && !child.assignedSlot) {
					for (const slotted of child.assignedElements({flatten: true})) {
						if (isAnyCompositionTracker(slotted)) result.push(slotted)
					}
				}
			}

			return result
		}

		/** @private */
		__composedParent: Element | null = null

		/**
		 * The parent this element is composed to, i.e. this element's parent in
		 * the flat tree.
		 */
		get composedParent(): Element | null {
			let result = this.__composedParent

			if (!result) {
				result = this.__getComposedParent()
			}

			return result
		}

		/**
		 * True when this element has a composed parent, i.e. when this element
		 * is (has a parent) in the flat tree.
		 */
		get isComposed() {
			return !!this.composedParent
		}

		/**
		 * @private
		 *
		 * Traverses to find the parent that this element renders relative to in
		 * the flat tree, if any (no parent means this element is not in the
		 * flat tree).
		 */
		__getComposedParent(): HTMLElement | null {
			let parent = this.terminalSlottedParent || this.shadowParent

			// Shortcut in case we have already detected slotted or shadowRoot parent.
			if (parent) return parent as HTMLElement

			return getComposedParent(this)
		}

		/**
		 * Children that are composed to this element, i.e. that render as
		 * children of this element in the flat tree. Flat tree children may be
		 * regular children of a shadow root in the composed tree, or slotted
		 * children (assigned nodes) of a <slot> element in a shadow root.
		 */
		get composedChildren(): CompositionTracker[] {
			// FIXME This object/array spreading and cloning is sloooooooow, and becomes
			// apparent the more ShadowRoots a tree has.
			if (this.exposedShadowRoot) {
				return [...this.shadowRootSlottedChildren, ...this.shadowRootChildren]
			} else {
				return [
					...(this.terminalSlottedChildren || []), // TODO perhaps use slot.assignedElements instead?
					// We only care about other nodes of the same type.
					...Array.from(this.children).filter((n): n is CompositionTracker => isAnyCompositionTracker(n)),
				]
			}
		}

		/**
		 * This element's ShadowRoot, if any (even if it is a closed shadow
		 * root, unlike the `shadowRoot` property).
		 */
		exposedShadowRoot?: ShadowRoot

		/**
		 * When true, this element's parent has a ShadowRoot, which means this
		 * element is possibly slotted into a slot in that parent's ShadowRoot.
		 * This doesn't guarantee that this element is slotted, it may not be
		 * slotted if there's no matching `<slot>` element to be slotted to.
		 *
		 * This is similar to `Boolean(this.parentElement.shadowRoot)`, except
		 * this is accurate even if the ShadowRoot mode is closed.
		 */
		isPossiblySlotted = false

		/** @private */
		__prevAssignedNodes?: WeakMap<HTMLSlotElement, Element[]>

		/**
		 * A map of the slot elements that are children of this element and
		 * their last-known assigned elements. When a slotchange happens while
		 * this element is in a shadow root and has a slot child, we can detect
		 * what the difference is between the last known assigned elements and
		 * the new ones.
		 * @private
		 */
		get __previousSlotAssignedNodes() {
			if (!this.__prevAssignedNodes) this.__prevAssignedNodes = new WeakMap()
			return this.__prevAssignedNodes
		}

		/**
		 * If this element is slotted into a shadow tree, this will reference
		 * the parent element of the <slot> element where this element is
		 * slotted to. This element will render as a child of that parent
		 * element in the flat tree (composed tree).
		 *
		 * This is similar to `this.assignedSlot.parentElement`, except this
		 * returns a result even if the ShadowRoot mode is closed.
		 */
		terminalSlottedParent: CompositionTracker | null = null

		/**
		 * If this element is a top-level child of a ShadowRoot, this points to
		 * the ShadowRoot host. The ShadowRoot host is the prent element that
		 * this element renders relative to (is a child of) in the flat tree.
		 *
		 * This is similar to `this.parentNode.host ?? null`.
		 */
		shadowParent: CompositionTracker | null = null

		/**
		 * If this element has a child `<slot>` element while in a ShadowRoot,
		 * this will be a Set of the nodes slotted into that `<slot>`, and that
		 * Set of nodes render relative to (are children of) this element in the
		 * flat tree. This is `null` if there are no slotted children.
		 */
		terminalSlottedChildren: Set<CompositionTracker> | null = null

		/**
		 * The parent whose child <slot> this element is assigned to,
		 * regardless of whether that slot itself is assigned to a
		 * deeper slot. This is the direct slot parent.
		 *
		 * Compare with terminalSlottedParent, which follows slot
		 * chaining to the final distributed parent.
		 */
		slottedParent: CompositionTracker | null = null

		/**
		 * Elements directly assigned to this element's child <slot>,
		 * regardless of whether this slot is assigned to a deeper slot.
		 * These are the direct slotted children.
		 *
		 * Compare with terminalSlottedChildren, which only contains
		 * children whose slot is NOT forwarded further down.
		 */
		slottedChildren: Set<CompositionTracker> | null = null

		/**
		 * Called when a child is added to the ShadowRoot of this element to
		 * establish composed relationships and trigger composedCallback.
		 * @private
		 */
		__shadowRootChildAdded(child: Element) {
			// NOTE Logic here is similar to childConnectedCallback

			if (isAnyCompositionTracker(child)) {
				child.shadowParent = this
				this.__triggerChildComposedCallback(this, child, 'root')
			} else if (child instanceof HTMLSlotElement) {
				child.addEventListener('slotchange', this.__onChildSlotChange)
				// CONTINUE This call *sometimes* runs redundantly here in addition
				// to the one in slotchange for added slots, doing extra work.
				// Why?
				queueMicrotask(() => this.__handleSlottedChildren(child))
			}
		}

		/**
		 * Called when a child is removed from the ShadowRoot of this element to
		 * remove composed relationships and trigger uncomposedCallback.
		 */
		__shadowRootChildRemoved(child: Element) {
			// NOTE Logic here is similar to childDisconnectedCallback

			if (isAnyCompositionTracker(child)) {
				child.shadowParent = null
				this.__triggerChildUncomposedCallback(this, child, 'root')
			} else if (child instanceof HTMLSlotElement) {
				child.removeEventListener('slotchange', this.__onChildSlotChange)
				queueMicrotask(() => this.__handleSlottedChildren(child))
				this.__previousSlotAssignedNodes.delete(child)
			}
		}

		/**
		 * Called when a slot child of this element emits a slotchange event.
		 */
		// TODO we need an @lazy decorator instead of making this a getter
		// manually to lazily create a value when it is needed. The decorator
		// would delay running the initializer.
		// Class field decorator example: https://tinyurl.com/lazy-field-decorator
		// Can do similar with a getter decorator.
		get __onChildSlotChange(): (event: Event) => void {
			if (this.__onChildSlotChange__) return this.__onChildSlotChange__

			this.__onChildSlotChange__ = (event: Event) => {
				// event.currentTarget is the slot that this event handler is on,
				// while event.target is always the slot from the ancestor-most
				// tree if that slot is assigned to this slot or another slot that
				// ultimate distributes to this slot.
				const slot = event.currentTarget as HTMLSlotElement

				this.__handleSlottedChildren(slot)
			}

			return this.__onChildSlotChange__
		}

		/** @private */
		__onChildSlotChange__?: (event: Event) => void

		/**
		 * Implement this method in a subclass to run logic when a child is
		 * composed to this element in the flat tree.
		 */
		childComposedCallback?(composedChild: Element, compositionType: CompositionType): void
		/**
		 * Implement this method in a subclass to run logic when a child is
		 * uncomposed from this element in the flat tree.
		 */
		childUncomposedCallback?(uncomposedChild: Element, compositionType: CompositionType): void
		/**
		 * Implement this method in a subclass to run logic when this element is
		 * composed to a parent in the flat tree.
		 */
		composedCallback?(composedParent: Element, compositionType: CompositionType): void
		/**
		 * Implement this method in a subclass to run logic when this element is
		 * uncomposed from a parent in the flat tree.
		 */
		uncomposedCallback?(uncomposedParent: Element, compositionType: CompositionType): void

		/** @private */
		__lastComposedParent: CompositionTracker | null = null
		/** @private */
		__lastCompositionType: CompositionType = 'actual'

		/**
		 * When we detect the slotchange ordering discrepancy (see __discrepancy
		 * usage sites), regular composition callbacks will be skipped, and
		 * special logic will run later to ensure we call composition methods in
		 * correct order.
		 * @private
		 */
		__discrepancy = false

		/** @private */
		__triggerChildComposedCallback(parent: CompositionTracker, child: CompositionTracker, compositionType: CompositionType) {
			// If we detected the discrepancy, return, the slotchange handler
			// will rerun this again in correct ordering.
			if (child.__discrepancy) return

			if (child.__composedParent) return

			child.__composedParent = parent

			// Small hack: track last state. See description in connectedCallback.
			child.__lastComposedParent = child.__composedParent as CompositionTracker
			child.__lastCompositionType = compositionType

			const trigger = () => {
				parent.childComposedCallback?.(child, compositionType)
				child.composedCallback?.(parent, compositionType)
			}

			const isUpgraded = child.matches(':defined')

			if (isUpgraded) trigger()
			else customElements.whenDefined(child.tagName.toLowerCase()).then(trigger)
		}

		/** @private */
		__triggerChildUncomposedCallback(parent: CompositionTracker, child: CompositionTracker, compositionType: CompositionType) {
			// If we detected the discrepancy, return, the slotchange handler
			// will rerun this again in correct ordering.
			if (child.__discrepancy) return

			if (!child.__composedParent) return

			child.__composedParent = null

			// We don't need to defer here like we did in
			// __triggerChildComposedCallback because if an element is uncomposed,
			// it won't load anything even if its class gets defined later.
			parent.childUncomposedCallback?.(child, compositionType)
			child.uncomposedCallback?.(parent, compositionType)
		}

		override connectedCallback() {
			// Small hack: immediately restore previous composition state. If
			// composition changed, our subsequent processing will update the
			// state to the new correct state. This solves an edge case where if
			// a child is disconnected and reconnect to the same parent
			// synchronously, we cannot detect this using slotchange events if
			// the removed/added child is slotted, because slotchange events do
			// not tell us individual mutations like MutationObserver does.
			if (this.__lastComposedParent)
				this.__triggerChildComposedCallback(this.__lastComposedParent, this, this.__lastCompositionType)


			super.connectedCallback()
		}

		override disconnectedCallback() : void {
			super.disconnectedCallback()

			// Small hack: immediately uncompose and track previous composition
			// state for connectedCallback. See description there.
			if (this.__lastComposedParent)
				this.__triggerChildUncomposedCallback(this.__lastComposedParent, this, this.__lastCompositionType)
		}

		/**
		 * This is called in certain cases when slotted children may have
		 * changed, f.e. when a slot was added to this element, or when a child
		 * slot of this element has had assigned nodes changed (slotchange).
		 * @private
		 */
		__handleSlottedChildren(slot: HTMLSlotElement) {
			const diff = this.__getSlottedChildDifference(slot)
			const isForwarded = !!slot.assignedSlot

			const {removed} = diff
			for (let l = removed.length, i = 0; i < l; i += 1) {
				const removedNode = removed[i]

				if (!isAnyCompositionTracker(removedNode)) continue

				// --- Direct slotted* — the nearest slot-owning parent ---
				// Only clear if this IS the current direct slot parent.
				if (removedNode.slottedParent === this) {
					removedNode.slottedParent = null
					if (this.slottedChildren) {
						this.slottedChildren.delete(removedNode)
						if (!this.slottedChildren.size) this.slottedChildren = null
					}

					// First-slot owner: fire hooks without touching __composedParent.
					this.childUncomposedCallback?.(removedNode, 'slot')
					removedNode.uncomposedCallback?.(this, 'slot')
				} else if (isForwarded && this.slottedChildren?.has(removedNode)) {
					// Passthrough: element is leaving this owner's slottedChildren
					// but its slottedParent belongs to a different owner. Only
					// remove it from slottedChildren and fire the parent-side
					// callback, without touching slottedParent or firing the
					// element's uncomposedCallback. Only forwarded slots have
					// passthrough children.
					this.slottedChildren.delete(removedNode)
					if (!this.slottedChildren.size) this.slottedChildren = null
					this.childUncomposedCallback?.(removedNode, 'slot')
				}

				// --- Terminal slotted* (only when NOT forwarded) ---
				if (!isForwarded) {
					removedNode.terminalSlottedParent = null
					if (this.terminalSlottedChildren) {
						this.terminalSlottedChildren.delete(removedNode)
						if (!this.terminalSlottedChildren.size) this.terminalSlottedChildren = null
					}

					// Terminal slot owner was the composed parent. Clear it.
					removedNode.__composedParent = null

					// Also remove from slottedChildren (passthrough added it).
					if (this.slottedChildren) {
						this.slottedChildren.delete(removedNode)
						if (!this.slottedChildren.size) this.slottedChildren = null
					}

					this.childUncomposedCallback?.(removedNode, 'terminal-slot')
					removedNode.uncomposedCallback?.(this, 'terminal-slot')
				}
			}

			const {added} = diff
			for (let l = added.length, i = 0; i < l; i += 1) {
				const addedNode = added[i]

				if (!isAnyCompositionTracker(addedNode)) continue

				// --- Direct slotted* — the nearest slot-owning parent ---
				// Only set if this is the first slot this node is assigned to.
				// Subsequent redistribution through forwarded slots does NOT
				// change the direct slottedParent (it stays at the nearest slot).
				if (!addedNode.slottedParent) {
					addedNode.slottedParent = this
					if (!this.slottedChildren) this.slottedChildren = new Set()
					this.slottedChildren.add(addedNode)

					// First-slot owner: fire hooks directly without setting
					// __composedParent. The terminal slot owner will set
					// __composedParent to the true flat-tree parent.
					const trigger = () => {
						this.childComposedCallback?.(addedNode, 'slot')
						addedNode.composedCallback?.(this, 'slot')
					}
					const isUpgraded = addedNode.matches(':defined')
					if (isUpgraded) trigger()
					else customElements.whenDefined(addedNode.tagName.toLowerCase()).then(trigger)
				} else {
					// Passthrough: element is already owned by an earlier slot
					// owner. Add it to this owner's slottedChildren regardless
					// of whether this slot is forwarded or terminal. Terminal
					// slots mirror terminalSlottedChildren here.
					if (!this.slottedChildren) this.slottedChildren = new Set()
					this.slottedChildren.add(addedNode)

					if (isForwarded) {
						// Forwarded slot: fire only the parent-side callback
						// with 'slot' type.
						const trigger = () => this.childComposedCallback?.(addedNode, 'slot')
						const isUpgraded = addedNode.matches(':defined')
						if (isUpgraded) trigger()
						else customElements.whenDefined(addedNode.tagName.toLowerCase()).then(trigger)
					}
				}

				// --- Terminal slotted* (only when NOT forwarded) ---
				if (!isForwarded) {
					// Keep track of the final distribution of a node.
					//
					// If the given slot is assigned to another
					// slot, then this logic will run again for the next slot on
					// that next slot's slotchange, so we remove the slotted
					// node from the previous terminalSlottedParent and add it to the next
					// one. If we don't do this, then the slotted node will
					// exist in multiple terminalSlottedChildren lists when there is a
					// chain of assigned slots. For more info, see
					// https://github.com/w3c/webcomponents/issues/611
					const terminalParent = addedNode.terminalSlottedParent
					if (terminalParent) {
						const children = terminalParent.terminalSlottedChildren
						if (children) {
							children.delete(addedNode)
							if (!children.size) terminalParent.terminalSlottedChildren = null
						}
					}

					// The node is now slotted to `this` element.
					addedNode.terminalSlottedParent = this
					if (!this.terminalSlottedChildren) this.terminalSlottedChildren = new Set()
					this.terminalSlottedChildren.add(addedNode)

					// This is true then the reaction order is incorrect due to the
					// order of slot change events.
					//
					// This discrepancy detection is only for slot composition
					// right now. We need to add more tests to see if this is a
					// problem with other composition types, and possibly
					// combinations of composition types (f.e. uncomposed from a
					// shadow root host, then composed to a slot parent, etc).
					if (addedNode.__composedParent) addedNode.__discrepancy = true

					console.log('[TERMINAL-ADD] this:', (this as any).tagName, 'added:', (addedNode as any).tagName, '__CP before:', (addedNode as any).__composedParent?.tagName)

					// Terminal slot owner is the composed parent in the flat
					// tree. Update __composedParent directly — skip the guard
					// in __triggerChildComposedCallback (which returns early
					// when __composedParent is already set by a first-slot owner).
					addedNode.__composedParent = this
					addedNode.__lastComposedParent = this as CompositionTracker
					addedNode.__lastCompositionType = 'terminal-slot'

					console.log('[TERMINAL-ADD] SET __CP of', (addedNode as any).tagName, 'to', (this as any).tagName, '__CP now:', (addedNode as any).__composedParent?.tagName)

					const trigger = () => {
						this.childComposedCallback?.(addedNode, 'terminal-slot')
						addedNode.composedCallback?.(this, 'terminal-slot')
					}
					const isUpgraded = addedNode.matches(':defined')
					if (isUpgraded) trigger()
					else customElements.whenDefined(addedNode.tagName.toLowerCase()).then(trigger)
				}
			}

			// If there is the detected discrepancy for any of the added nodes,
			// run uncomposed and composed reactions again, in that order. This
			// fixes the edge case with composition causing composed to run
			// before uncomposed when a node is moved to another slot (causing
			// the rendering to break) due to slotchange ordering issues as with
			// MutationObserver, described in
			// https://github.com/whatwg/dom/issues/1111. More info in
			// __getSlottedChildDifference.
			//
			// We will improve this by using Oxford Harrison's `realdom` library
			// at https://github.com/webqit/realdom, which allows us to react to
			// DOM mutations in a reliable way synchronously in the
			// always-correct order (by patching all the DOM-mutating APIs such
			// as appendChild, innerHTML, etc).
			queueMicrotask(() => {
				for (let l = added.length, i = 0; i < l; i += 1) {
					const addedNode = added[i]
					if (!isAnyCompositionTracker(addedNode)) continue
					if (addedNode.isConnected && addedNode.__discrepancy) {
						addedNode.__discrepancy = false
						// Re-fire terminal hooks with correct ordering.
						addedNode.__composedParent = null
						this.childUncomposedCallback?.(addedNode, 'terminal-slot')
						addedNode.uncomposedCallback?.(this, 'terminal-slot')
						addedNode.__composedParent = this
						addedNode.__lastComposedParent = this as CompositionTracker
						addedNode.__lastCompositionType = 'terminal-slot'
						this.childComposedCallback?.(addedNode, 'terminal-slot')
						addedNode.composedCallback?.(this, 'terminal-slot')
					}
				}
			})
		}

		/**
		 * Get the difference between the last assigned elements and current
		 * assigned elements of a child slot of this element.
		 *
		 * This does a diff that allows us to run slotted/unslotted reactions
		 * only for nodes that were detected to have been added or removed, but
		 * it fails to detect nodes that were both removed and added within the
		 * same tick synchronously because `slotchange` runs in the next
		 * microtask and does not give us a way to see all slot assignment
		 * change records (like we can with MutationObserver), we can only see
		 * the current set of slotted nodes with slot.assignedNodes.
		 *
		 * @private
		 */
		__getSlottedChildDifference(slot: HTMLSlotElement): SlotDiff {
			const previousNodes = this.__previousSlotAssignedNodes.get(slot) ?? []
			const newNodes = slot.assignedElements({flatten: true})

			// Save the newNodes to be used as the previousNodes for next time
			// (clone it so the following in-place modification doesn't ruin any
			// assumptions in the next round).
			this.__previousSlotAssignedNodes.set(slot, [...newNodes])

			const diff: SlotDiff = {added: newNodes, removed: []}

			for (let i = 0, l = previousNodes.length; i < l; i += 1) {
				const oldNode = previousNodes[i]!
				const newIndex = newNodes.indexOf(oldNode)
				const newIncludesOld = newIndex >= 0

				// if it exists in the previousNodes but not the newNodes, then
				// the node was removed.
				if (!newIncludesOld) diff.removed.push(oldNode)
				// otherwise the node wasn't added or removed.
				else newNodes.splice(newIndex, 1)
			}

			// The remaining nodes in newNodes must have been added.

			return diff
		}

		override childConnectedCallback(child: Element) {
			// This code handles two cases: the element has a ShadowRoot
			// ("composed children" are children of the ShadowRoot), or it has a
			// <slot> child ("composed children" are elements that may be
			// distributed to the <slot>).
			if (isAnyCompositionTracker(child)) {
				// We skip Scene here because we know it already has a
				// ShadowRoot that serves a different purpose than for Element3Ds. A
				// Scene child's three objects will always be connected to the
				// scene's three object regardless of its ShadowRoot.
				if (this.exposedShadowRoot) {
					child.isPossiblySlotted = true

					// We don't call childComposedCallback here because that
					// will be called indirectly due to a slotchange event on a
					// <slot> element if the added child will be distributed to
					// a slot.
				} else {
					// If there's no shadow root, call the childComposedCallback
					// with connection type "actual". This is effectively a
					// regular parent-child composition (no distribution, no
					// children of a ShadowRoot).

					this.__triggerChildComposedCallback(this, child, 'actual')
				}
			} else if (child instanceof HTMLSlotElement) {
				// FLAT TREE TRACKING: Detecting slots here is part of composed
				// tree tracking (detecting when a child is distributed to an element).

				child.addEventListener('slotchange', this.__onChildSlotChange)

				// XXX Do we need __handleSlottedChildren for initial slotted
				// elements? The answer seems to be "yes, sometimes". When slots are
				// appended, their slotchange events will fire. However, this
				// `childConnectedCallback` is fired later from when a child is
				// actually connected, in a MutationObserver task. Because of this,
				// an appended slot's slotchange event *may* have already fired,
				// and we will not have had the chance to add a slotchange event
				// handler yet, therefore we need to fire
				// __handleSlottedChildren here to handle that missed
				// opportunity.
				//
				// Also we need to defer() here because otherwise, this
				// childConnectedCallback will fire once for when a child is
				// connected into the light DOM and run the logic in the `if
				// (isElement3D(child))` branch *after* childConnectedCallback is fired
				// and executes this __handleSlottedChildren call for a shadow
				// DOM slot, and in that case the distribution will not be detected
				// (why is that?).  By deferring, this __handleSlottedChildren
				// call correctly happens *after* the above `if (isElement3D(child))`
				// branch and then things will work as expected. This is all due to
				// using MutationObserver, which fires event in a later task than
				// when child connections actually happen.
				//
				// TODO ^, Can we make WithChildren call this callback right when
				// children are added, synchronously?  If so then we could rely on
				// a slot's slotchange event upon it being connected without having
				// to call __handleSlottedChildren here (which means also not
				// having to use defer for anything).

				queueMicrotask(() => this.__handleSlottedChildren(child))
			}
		}

		override childDisconnectedCallback(child: Element) {
			if (isAnyCompositionTracker(child)) {
				if (this.exposedShadowRoot) {
					child.isPossiblySlotted = false
				} else {
					// If there's no shadow root, call the
					// childUncomposedCallback with connection type "actual".
					// This is effectively similar to childDisconnectedCallback.
					this.__triggerChildUncomposedCallback(this, child, 'actual')
				}
			} else if (child instanceof HTMLSlotElement) {
				// FLAT TREE TRACKING:
				child.removeEventListener('slotchange', this.__onChildSlotChange)

				queueMicrotask(() => this.__handleSlottedChildren(child))
				this.__previousSlotAssignedNodes.delete(child)
			}
		}

		/**
		 * Visit nodes in the DOM composed tree starting at this element in such
		 * a way that nodes are visited as if the implicit flat tree were
		 * traversed in pre-order. Essentially, traverse the flat tree.
		 */
		traverseComposed(visitor: (el: CompositionTracker) => void, waitForUpgrade = false): Promise<void> | void {
			visitor(this)

			if (!waitForUpgrade) {
				for (const child of this.composedChildren) child.traverseComposed(visitor, waitForUpgrade)
				return
			}

			// If waitForUpgrade is true, we make a promise chain so that traversal
			// order is still the same as when waitForUpgrade is false.
			let promise: Promise<any> = Promise.resolve()

			for (const child of this.composedChildren) {
				const isUpgraded = child.matches(':defined')

				if (isUpgraded) {
					promise = promise!.then(() => child.traverseComposed(visitor, waitForUpgrade))
				} else {
					promise = promise!
						.then(() => customElements.whenDefined(child.tagName.toLowerCase()))
						.then(() => child.traverseComposed(visitor, waitForUpgrade))
				}
			}

			return promise
		}
	}
}

export type AnyCompositionTracker = InstanceType<ReturnType<typeof CompositionTracker>>

export function isAnyCompositionTracker(o: any): o is AnyCompositionTracker {
	return o[isInstance]
}

Object.defineProperty(CompositionTracker, Symbol.hasInstance, {value: isAnyCompositionTracker})

export type CompositionType = 'root' | 'slot' | 'terminal-slot' | 'actual'

const shadowHosts: WeakSet<Element> = new WeakSet()

if (isDomEnvironment()) {
	const original = Element.prototype.attachShadow

	Element.prototype.attachShadow = function attachShadow(...args) {
		const result = original.apply(this, args)

		shadowHosts.add(this)

		return result
	}
}

export function hasShadow(el: Element): boolean {
	return shadowHosts.has(el)
}

export function getComposedParent(el: HTMLElement): HTMLElement | null {
	const parent = el.parentNode as ShadowRoot | Element | null

	if (parent instanceof HTMLSlotElement) {
		let slot = parent

		// If el is a child of a <slot> element (i.e. el is a slot's default
		// content), then return null if the slot has anything slotted to it in
		// which case default content does not participate in the composed tree.
		if (slot.assignedElements({flatten: true}).length) return null

		return getComposedParent(slot)
	} else {
		const parent = el.parentNode as ShadowRoot | Element | null

		if (!parent) return null

		if (parent instanceof ShadowRoot) return parent.host as HTMLElement

		if (hasShadow(parent)) {
			// If the parent has a ShadowRoot, but el is does not have an
			// assigned node, it is not slotted therefore not in the composed
			// tree.
			if (!el.assignedSlot) return null

			// Otherwise, if el is assigned to a slot, that slot might be
			// further assigned to a deeper slot, and so on.
			while (el.assignedSlot) el = el.assignedSlot

			// So finally get the slot's composition parent.
			return getComposedParent(el)
		}

		// Regular parent is the composed parent.
		return parent as HTMLElement
	}
}

type SlotDiff = {added: Node[]; removed: Node[]}
