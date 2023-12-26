// TODO Remove isScene and isNode specifics out of here here

// TODO Some logic in SharedAPI actually belongs in here, and relies on
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

import {Constructor} from 'lowclass'
import {observeChildren} from './utils/observeChildren.js'
import type {PossibleCustomElement, PossibleCustomElementConstructor} from './PossibleCustomElement.js'
import {isDomEnvironment, isScene} from './utils/isThisOrThat.js'

export function CompositionTracker<T extends Constructor<HTMLElement>>(Base: T) {
	return class CompositionTracker extends Constructor<PossibleCustomElement, PossibleCustomElementConstructor & T>(
		Base,
	) {
		// from Scene
		isScene = false

		// from Element3D
		isElement3D = false

		// A subclass can set this to false to skip observation of its ShadowRoot.
		skipShadowObservation = false

		// COMPOSED TREE TRACKING:
		// Overriding HTMLElement.prototype.attachShadow here is part of our
		// implementation for tracking the composed tree and connecting THREE
		// objects in the same structure as the DOM composed tree so that it will
		// render as expected when end users compose elements with ShadowDOM and
		// slots.
		override attachShadow(options: ShadowRootInit): ShadowRoot {
			const root = super.attachShadow(options)

			if (this.skipShadowObservation) return root

			this.__shadowRoot = root

			observeChildren({
				target: root,
				onConnect: this.__shadowRootChildAdded.bind(this),
				onDisconnect: this.__shadowRootChildRemoved.bind(this),
			})

			// Arrray.from is needed for older Safari which can't iterate on HTMLCollection
			const children = Array.from(this.children)

			for (const child of children) {
				if (!(child instanceof CompositionTracker)) continue

				child.__isPossiblyDistributedToShadowRoot = true
				this.__triggerChildUncomposedCallback(child, 'actual')
			}

			return root
		}

		// COMPOSED TREE TRACKING:
		get _hasShadowRoot(): boolean {
			return !!this.__shadowRoot
		}

		// COMPOSED TREE TRACKING:
		get _isPossiblyDistributedToShadowRoot(): boolean {
			return this.__isPossiblyDistributedToShadowRoot
		}

		// COMPOSED TREE TRACKING:
		get _shadowRootParent(): CompositionTracker | null {
			return this.__shadowRootParent
		}

		get _shadowRootChildren(): CompositionTracker[] {
			if (!this.__shadowRoot) return []

			return Array.from(this.__shadowRoot.children).filter(
				(n): n is CompositionTracker => n instanceof CompositionTracker,
			)
		}

		// COMPOSED TREE TRACKING: Elements that are distributed to a slot that is
		// child of a ShadowRoot of this element.
		get _distributedShadowRootChildren(): CompositionTracker[] {
			const result: CompositionTracker[] = []

			for (const child of Array.from(this.__shadowRoot?.children || [])) {
				if (child instanceof HTMLSlotElement && !child.assignedSlot) {
					for (const distributed of child.assignedElements({flatten: true})) {
						if (distributed instanceof CompositionTracker) result.push(distributed)
					}
				}
			}

			return result
		}

		// COMPOSED TREE TRACKING:
		get _distributedParent(): CompositionTracker | null {
			return this.__distributedParent
		}

		// COMPOSED TREE TRACKING:
		get _distributedChildren(): CompositionTracker[] | null {
			return this.__distributedChildren ? [...this.__distributedChildren] : null
		}

		__composedParent: Element | null = null

		get composedParent(): Element | null {
			let result = this.__composedParent

			if (!result) {
				result = this.__getComposedParent()
			}

			return result
		}

		// Returns composed state calculated only during composition, which can
		// be incorrect in the edge case described in
		// __getSlottedChildDifference (faster).
		get __isComposed() {
			return this.__composedParent
		}

		// Returns the correct composed state even if our tracking is incorrect,
		// by inspecting the DOM (slower).
		get isComposed() {
			return this.composedParent
		}

		// COMPOSED TREE TRACKING: The composed parent is the parent that this element renders relative
		// to in the flat tree (composed tree).
		__getComposedParent(): HTMLElement | null {
			let parent: Node | null = this.parentElement

			// Special case only for Nodes that are children of a Scene.
			// TODO filtering should be done by subclasses
			if (parent && isScene(parent)) return parent

			parent = this.__distributedParent || this.__shadowRootParent

			// Shortcut in case we have already detected distributed or shadowRoot parent.
			if (parent) return parent as HTMLElement

			return getComposedParent(this)
		}

		// COMPOSED TREE TRACKING: Composed children are the children that render relative to this
		// element in the flat tree (composed tree), whether as children of a
		// shadow root, or distributed children (assigned nodes) of a <slot>
		// element.
		get _composedChildren(): CompositionTracker[] {
			if (this.__shadowRoot) {
				return [...this._distributedShadowRootChildren, ...this._shadowRootChildren]
			} else {
				return [
					...(this.__distributedChildren || []), // TODO perhaps use slot.assignedElements instead?
					// We only care about other nodes of the same type.
					...Array.from(this.children).filter((n): n is CompositionTracker => n instanceof CompositionTracker),
				]
			}
		}

		// COMPOSED TREE TRACKING: This element's shadow root, if any. This always points to the shadow
		// root, even if it is a closed root, unlike the public shadowRoot
		// property.
		__shadowRoot?: ShadowRoot

		// COMPOSED TREE TRACKING: True when this element has a parent that has a shadow root.
		__isPossiblyDistributedToShadowRoot = false

		__prevAssignedNodes?: WeakMap<HTMLSlotElement, Element[]>

		// COMPOSED TREE TRACKING:
		// A map of the slot elements that are children of this element and
		// their last-known assigned elements. When a slotchange happens while
		// this element is in a shadow root and has a slot child, we can
		// detect what the difference is between the last known assigned elements and the new
		// ones.
		get __previousSlotAssignedNodes() {
			if (!this.__prevAssignedNodes) this.__prevAssignedNodes = new WeakMap()
			return this.__prevAssignedNodes
		}

		// COMPOSED TREE TRACKING:
		// If this element is distributed into a shadow tree, this will
		// reference the parent element of the <slot> element where this element is
		// distributed to. This element will render as a child of
		// that parent element in the flat tree (composed tree).
		__distributedParent: CompositionTracker | null = null

		// COMPOSED TREE TRACKING:
		// If this element is a top-level child of a shadow root, then this points
		// to the shadow root host. The shadow root host is the prent element that
		// this element renders relative to in the flat tree (composed tree).
		__shadowRootParent: CompositionTracker | null = null

		// COMPOSED TREE TRACKING:
		// If this element has a child <slot> element while in
		// a shadow root, then this will be a Set of the nodes distributed
		// into the <slot>, and those nodes render relatively
		// to this element in the flat tree. We instantiate this later, only
		// when/if needed.
		__distributedChildren?: Set<CompositionTracker>

		// COMPOSED TREE TRACKING: Called when a child is added to the ShadowRoot of this element.
		// This does not run for Scene instances, which already have a root for their rendering implementation.
		__shadowRootChildAdded(child: Element) {
			// NOTE Logic here is similar to childConnectedCallback

			if (child instanceof CompositionTracker) {
				child.__shadowRootParent = this
				this.__triggerChildComposedCallback(child, 'root')
			} else if (child instanceof HTMLSlotElement) {
				child.addEventListener('slotchange', this.__onChildSlotChange)
				this.__handleSlottedChildren(child)
			}
		}

		// COMPOSED TREE TRACKING: Called when a child is removed from the ShadowRoot of this element.
		// This does not run for Scene instances, which already have a root for their rendering implementation.
		__shadowRootChildRemoved(child: Element) {
			// NOTE Logic here is similar to childDisconnectedCallback

			if (child instanceof CompositionTracker) {
				child.__shadowRootParent = null
				this.__triggerChildUncomposedCallback(child, 'root')
			} else if (child instanceof HTMLSlotElement) {
				child.removeEventListener('slotchange', this.__onChildSlotChange, {capture: true})
				this.__handleSlottedChildren(child)
				this.__previousSlotAssignedNodes.delete(child)
			}
		}

		// COMPOSED TREE TRACKING: Called when a slot child of this element emits a slotchange event.
		// TODO we need an @lazy decorator instead of making this a getter manually.
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

		__onChildSlotChange__?: (event: Event) => void

		// COMPOSED TREE TRACKING: Life cycle methods for use by subclasses to run
		// logic when children are composed or uncomposed to them in the composed
		// tree.
		childComposedCallback?(composedChild: Element, compositionType: CompositionType): void
		childUncomposedCallback?(uncomposedChild: Element, compositionType: CompositionType): void
		composedCallback?(composedParent: Element, compositionType: CompositionType): void
		uncomposedCallback?(uncomposedParent: Element, compositionType: CompositionType): void

		#discrepancy = false

		__triggerChildComposedCallback(child: CompositionTracker, compositionType: CompositionType) {
			if (child.#discrepancy) return

			child.__composedParent = this

			const trigger = () => {
				this.childComposedCallback?.(child, compositionType)
				child.composedCallback?.(this, compositionType)
			}

			const isUpgraded = child.matches(':defined')

			if (isUpgraded) trigger()
			else customElements.whenDefined(child.tagName.toLowerCase()).then(trigger)
		}

		__triggerChildUncomposedCallback(child: CompositionTracker, compositionType: CompositionType) {
			// If we detected the discrepancy, return, the slotchange handler will rerun this appropriately.
			if (child.#discrepancy) return

			child.__composedParent = null

			// We don't need to defer here like we did in
			// __triggerChildComposedCallback because if an element is uncomposed,
			// it won't load anything even if its class gets defined later.
			this.childUncomposedCallback?.(child, compositionType)
			child.uncomposedCallback?.(this, compositionType)
		}

		// COMPOSED TREE TRACKING: This is called in certain cases when distributed
		// children may have changed, f.e. when a slot was added to this element, or
		// when a child slot of this element has had assigned nodes changed
		// (slotchange).
		__handleSlottedChildren(slot: HTMLSlotElement) {
			const diff = this.__getSlottedChildDifference(slot)

			const {removed} = diff
			for (let l = removed.length, i = 0; i < l; i += 1) {
				const removedNode = removed[i]

				if (!(removedNode instanceof CompositionTracker)) continue

				removedNode.__distributedParent = null

				// The node may have already been deleted, and
				// __distributedChildren set to undefined, in the `added`
				// for-loop of another slot.
				if (this.__distributedChildren) {
					this.__distributedChildren.delete(removedNode)
					if (this.__distributedChildren.size) this.__distributedChildren = undefined
				}

				this.__triggerChildUncomposedCallback(removedNode, 'slot')
			}

			const {added} = diff
			for (let l = added.length, i = 0; i < l; i += 1) {
				const addedNode = added[i]

				if (!(addedNode instanceof CompositionTracker)) continue

				// Keep track of the final distribution of a node.
				//
				// If the given slot is assigned to another
				// slot, then this logic will run again for the next slot on
				// that next slot's slotchange, so we remove the distributed
				// node from the previous distributedParent and add it to the next
				// one. If we don't do this, then the distributed node will
				// exist in multiple distributedChildren lists when there is a
				// chain of assigned slots. For more info, see
				// https://github.com/w3c/webcomponents/issues/611
				const distributedParent = addedNode.__distributedParent
				if (distributedParent) {
					const distributedChildren = distributedParent.__distributedChildren
					if (distributedChildren) {
						distributedChildren.delete(addedNode)
						if (!distributedChildren.size) distributedParent.__distributedChildren = undefined
					}
				}

				// The node is now distributed to `this` element.
				addedNode.__distributedParent = this
				if (!this.__distributedChildren) this.__distributedChildren = new Set()
				this.__distributedChildren.add(addedNode)

				// This is true then the reaction order is incorrect due to the
				// order of slot change events.
				//
				// This discrepancy detection is only for slot composition
				// right now. We need to add more tests to see if this is a
				// problem with other composition types, and possbly
				// combinations of composition types (f.e. uncomposed from a
				// shadow root host, then composed to a slot parent, etc).
				if (addedNode.__composedParent) addedNode.#discrepancy = true

				this.__triggerChildComposedCallback(addedNode, 'slot')
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
					if (!(addedNode instanceof CompositionTracker)) continue
					// if (addedNode.isConnected && !addedNode.__isComposed && addedNode.isComposed) {
					if (addedNode.isConnected && addedNode.#discrepancy) {
						// addedNode.recompose()
						addedNode.#discrepancy = false
						this.__triggerChildUncomposedCallback(addedNode, 'slot')
						this.__triggerChildComposedCallback(addedNode, 'slot')
					}
				}
			})
		}

		// COMPOSED TREE TRACKING: Get the difference between the last assigned
		// elements and current assigned elements of a child slot of this element.
		__getSlottedChildDifference(slot: HTMLSlotElement): SlotDiff {
			const bruteForceMethod = true

			if (bruteForceMethod) {
				//////////////////////
				// This method behaves *more* correct (not fully) than the other
				// method, but does extra work because it runs unslotted
				// reactions for *all* previous nodes, and then slotted
				// reactions for *all* current nodes even if any of those nodes
				// were not removed and added, to be sure that we catch
				// synchronous changes where the same node was both removed and
				// added or similar. We are not able to see all the mutations
				// like we can with MutationObserver.
				//
				// This method might not catch cases when a node is added and
				// then removed in the same tick. It might also not run
				// reactions in a correct order across multiple slots (f.e.
				// given a node removed from one slot then added to another, the
				// slot that received the node may have its callback ran first
				// and added reactions will fire, then the slot that had the
				// node removed may have its *after*, causing the net effect on
				// the node to be removed), which is the same problems as with
				// MutationObserver callbacks described in
				// https://github.com/whatwg/dom/issues/1111.
				//
				// Discussion: https://github.com/WICG/webcomponents/issues/1042
				//////////////////////

				const previousNodes = this.__previousSlotAssignedNodes.get(slot) ?? []
				const newNodes = this.#getCurrentAssignedNodes(slot)
				this.__previousSlotAssignedNodes.set(slot, [...newNodes])
				return {removed: previousNodes, added: newNodes}
			} else {
				//////////////////////
				// This method is potentially more optimized because it does a
				// diff, and runs reactions only for nodes that were detected to
				// actually be added or removed, but it fails to detect nodes
				// that were both removed and added in the same tick because
				// `slotchange` is synchronous and we do not have a way to see
				// all mutation records, we can only see the current set of
				// slotted nodes with slot.assignedNodes.
				//////////////////////

				const previousNodes = this.__previousSlotAssignedNodes.get(slot) ?? []

				const newNodes = this.#getCurrentAssignedNodes(slot)

				// Save the newNodes to be used as the previousNodes for next time
				// (clone it so the following in-place modification doesn't ruin any
				// assumptions in the next round).
				this.__previousSlotAssignedNodes.set(slot, [...newNodes])

				const diff: SlotDiff = {added: newNodes, removed: []}

				for (let i = 0, l = previousNodes.length; i < l; i += 1) {
					const oldNode = previousNodes[i]
					const newIndex = newNodes.indexOf(oldNode)

					// if it exists in the previousNodes but not the newNodes, then
					// the node was removed.
					if (!(newIndex >= 0)) diff.removed.push(oldNode)
					// otherwise the node wasn't added or removed.
					else newNodes.splice(i, 1)
				}

				// The remaining nodes in newNodes must have been added.

				return diff
			}
		}

		#getCurrentAssignedNodes(slot: HTMLSlotElement) {
			// If this slot is assigned to another slot, then we don't consider any
			// of the slot's assigned nodes as being distributed to the current element,
			// because instead they are distributed to an element further down in the
			// composed tree where this slot is assigned to.
			//
			// Special case for Scenes: we don't care if slot children of a Scene
			// distribute to a deeper slot, because a Scene's ShadowRoot is for the rendering
			// implementation and not the user's distribution, so we only want to detect
			// elements slotted directly to the Scene in that case.
			// TODO filtering should be done by subclasses
			// TODO move filtering to parent
			return !this.isScene && slot.assignedSlot ? [] : slot.assignedElements({flatten: true})
		}

		traverseComposed(visitor: (el: CompositionTracker) => void, waitForUpgrade = false): Promise<void> | void {
			visitor(this)

			if (!waitForUpgrade) {
				for (const child of this._composedChildren) child.traverseComposed(visitor, waitForUpgrade)
				return
			}

			// If waitForUpgrade is true, we make a promise chain so that traversal
			// order is still the same as when waitForUpgrade is false.
			let promise: Promise<any> = Promise.resolve()

			for (const child of this._composedChildren) {
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

export type CompositionType = 'root' | 'slot' | 'actual'

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
