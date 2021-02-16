import {Element} from '@lume/element'
import {observeChildren} from '../core/Utility.js'
import WithChildren from './WithChildren.js'
import DefaultBehaviors from './behaviors/DefaultBehaviors.js'

import type HTMLNode from './HTMLNode.js'

export type ConnectionType = 'root' | 'slot' | 'actual'

const observers = new WeakMap()

// using isNode instead of instanceof HTMLNode to avoid runtime reference,
// thus prevent circular dependency between this module and HTMLNode
// TODO consolidate with one in ImperativeBase
function isNode(n: any): n is HTMLNode {
	return n.isNode
}

initDeclarativeBase()

export function initDeclarativeBase() {
	if (!DeclarativeBase) DeclarativeBase = makeDeclarativeBase()
}

function makeDeclarativeBase() {
	/**
	 * @implements {EventListener}
	 */
	return class DeclarativeBase extends WithChildren.mixin(DefaultBehaviors.mixin(Element)) {
		static defaultElementName: string = 'ERROR: Subclass needs to set defaultElementName'
		private static _definedElementName?: string

		static define(name?: string) {
			name = name || this.defaultElementName
			customElements.define(name, this)
			this._definedElementName = name // TODO static protected members in lowclass
		}

		static get definedElementName() {
			return this._definedElementName || null
		}

		// This empty constructor is needed merely to satisfy the type system.
		// Remmoving it causes a type error.
		constructor(..._args: any[]) {
			super()
		}

		// We use this to Override HTMLElement.prototype.attachShadow in v1 so
		// that we can make the connection between parent and child on the
		// imperative side when the HTML side is using shadow roots.
		attachShadow(options: ShadowRootInit): ShadowRoot {
			const root = super.attachShadow(options)

			this.__shadowRoot = root

			const observer = observeChildren(
				root,
				this.__shadowRootChildAdded.bind(this),
				this.__shadowRootChildRemoved.bind(this),
				true,
			)

			observers.set(root, observer)

			// Arrray.from is needed for older Safari which can't iterate on HTMLCollection
			const children = Array.from(this.children)

			for (const child of children) {
				if (!(child instanceof DeclarativeBase)) continue
				child.__isPossiblyDistributedToShadowRoot = true
				this.__childUncomposedCallback(child, 'slot')
			}

			return root
		}

		// from Scene
		// TODO PossiblyScene type for this mixin?
		isScene = false

		// from HTMLNode
		// TODO PossiblyHTMLNode type for this mixin?
		isNode = false

		childConnectedCallback(child: HTMLElement) {
			// TODO Another case to handle is default slot content: when there
			// are no nodes distributed to a slot, then connect the <slot>
			// element's children to the <slot> parent.

			// This code handles two cases: the element has a ShadowRoot
			// ("composed children" are children of the ShadowRoot), or it has a
			// <slot> child ("composed children" are nodes that may be
			// distributed to the <slot>).
			if (isNode(child)) {
				// We skip Scene here because we know it already has a
				// ShadowRoot that serves a different purpose than for Nodes. A
				// Scene child's three objects will always be connected to the
				// scene's three object regardless of its ShadowRoot.
				if (!this.isScene && this.__shadowRoot) {
					child.__isPossiblyDistributedToShadowRoot = true

					// We don't call __childComposedCallback here because that
					// will be called indirectly due to a slotchange event on a
					// <slot> element if the added child will be distributed to
					// a slot.
				} else {
					// If there's no shadow root, call the childComposedCallback
					// with connection type "actual". This is effectively a
					// regular parent-child composition (no distribution, no
					// children of a ShadowRoot).

					this.__childComposedCallback(child, 'actual')
				}
			} else if (child instanceof HTMLSlotElement) {
				if (!this.__slots) this.__slots = []
				this.__slots.push(child)

				child.addEventListener('slotchange', this.__onChildSlotChange)

				// TODO do we need __handleDistributedChildren for initial
				// slotted nodes? Or does `slotchange` conver that? Also, does
				// `slotchange` fire for distributed slots? Or do we need to
				// also look at assigned nodes of distributed slots in the
				// initial __handleDistributedChildren call?
				this.__handleDistributedChildren(child /*, true*/)
			}
		}

		childDisconnectedCallback(child: HTMLElement) {
			// mirror the connection in the imperative API's virtual scene graph.
			if (isNode(child)) {
				if (this.__shadowRoot) {
					child.__isPossiblyDistributedToShadowRoot = false
				} else {
					// If there's no shadow root, call the
					// childUncomposedCallback with connection type "actual".
					// This is effectively similar to childDisconnectedCallback.
					this.__childUncomposedCallback(child, 'actual')
				}
			} else if (child instanceof HTMLSlotElement) {
				child.removeEventListener('slotchange', this.__onChildSlotChange)

				this.__slots!.splice(this.__slots!.indexOf(child), 1)
				if (!this.__slots!.length) this.__slots = undefined
				this.__handleDistributedChildren(child)
				this.__previousSlotAssignedNodes.delete(child)
			}
		}

		// TODO use this to detect when we should render only to WebGL in a
		// non-DOM environment.
		get hasHtmlApi() {
			// @prod-prune
			if (this instanceof HTMLElement) return true
			return false
		}

		// Traverses a tree while considering ShadowDOM disribution.
		//
		// This isn't used for anything at the moment. It was going to be used
		// to traverse the composed tree and render using our own WebGL
		// renderer, but at the moment we're using Three.js nodes and composing
		// them in the structured of the composed tree, then Three.js handles
		// the traversal for rendering the WebGL.
		traverseComposed(cb: (n: Node) => void) {
			// In the future, the user will be use a pure-JS API with no HTML
			// DOM API.
			const hasHtmlApi = this.hasHtmlApi

			const {children} = this
			for (let l = children.length, i = 0; i < l; i += 1) {
				const child = children[i]

				if (!(child instanceof DeclarativeBase)) continue

				// skip nodes that are possiblyDistributed, i.e. they have a parent
				// that has a ShadowRoot.
				if (!hasHtmlApi || !child.__isPossiblyDistributedToShadowRoot) child.traverseComposed(cb)

				cb(child)
			}

			const distributedChildren = this.__distributedChildren
			if (hasHtmlApi && distributedChildren) {
				for (const shadowChild of distributedChildren) {
					shadowChild.traverseComposed(cb)
					cb(shadowChild)
				}
			}
		}

		// TODO: make setAttribute accept non-string values.
		setAttribute(attr: string, value: any) {
			super.setAttribute(attr, value)
		}

		protected get _hasShadowRoot() {
			return !!this.__shadowRoot
		}

		protected get _isPossiblyDistributedToShadowRoot() {
			return this.__isPossiblyDistributedToShadowRoot
		}

		protected get _shadowRootParent() {
			return this.__shadowRootParent
		}

		protected get _distributedParent() {
			return this.__distributedParent
		}

		protected get _distributedChildren() {
			return this.__distributedChildren ? [...this.__distributedChildren] : null
		}

		// The composed parent is the parent that this node renders relative
		// to in the flat tree (composed tree).
		protected get _composedParent() {
			return this.__distributedParent || this.__shadowRootParent || this.parentElement
		}

		// Composed children are the children that render relative to this
		// node in the flat tree (composed tree), whether as children of a
		// shadow root, or distributed children (assigned nodes) of a <slot>
		// element.
		protected get _composedChildren() {
			if (this.__shadowRoot) {
				return [...Array.prototype.filter.call(this.__shadowRoot.children, n => n instanceof DeclarativeBase)]
			} else {
				return [
					...(this.__distributedChildren || []), // TODO perhaps use slot.assignedNodes instead?
					...Array.from(this.children),
				]
			}
		}

		// This node's shadow root, if any. This always points to the shadow
		// root, even if it is a closed root, unlike the public shadowRoot
		// property.
		private declare __shadowRoot?: ShadowRoot

		// All <slot> elements of this node, if any.
		private declare __slots?: HTMLSlotElement[]

		// True when this node has a parent that has a shadow root. When
		// using the HTML API, Imperative API can look at this to determine
		// whether to render this node or not, in the case of WebGL.
		private __isPossiblyDistributedToShadowRoot = false

		private declare __prevAssignedNodes?: WeakMap<HTMLSlotElement, Node[]>

		// A map of the slot elements that are children of this node and
		// their last-known assigned nodes. When a slotchange happens while
		// this node is in a shadow root and has a slot child, we can
		// detect what the difference is between the last known and the new
		// assignments, and notate the new distribution of child nodes. See
		// issue #40 for background on why we do this.
		private get __previousSlotAssignedNodes() {
			if (!this.__prevAssignedNodes) this.__prevAssignedNodes = new WeakMap()
			return this.__prevAssignedNodes
		}

		// If this node is distributed into a shadow tree, this will
		// reference the parent of the <slot> element where this node is
		// distributed to. Basically, this node will render as a child of
		// that parent node in the flat tree (composed tree).
		private __distributedParent: DeclarativeBase | null = null

		// If this node is a top-level child of a shadow root, then this
		// points to the parent of the shadow root. The shadow root parent
		// is the node that this node renders relative to in the flat tree
		// (composed tree).
		private __shadowRootParent: DeclarativeBase | null = null

		private __isComposed = false

		// If this element has a child <slot> element while in
		// a shadow root, then this will be a Set of the nodes distributed
		// into the <slot>, and those nodes render relatively
		// to this node in the flat tree. We instantiate this later, only
		// when/if needed.
		private declare __distributedChildren?: Set<DeclarativeBase>

		private __shadowRootChildAdded(child: HTMLElement) {
			// NOTE Logic here is similar to childConnectedCallback

			if (child instanceof DeclarativeBase) {
				child.__shadowRootParent = this
				this.__childComposedCallback(child, 'root')
			} else if (child instanceof HTMLSlotElement) {
				child.addEventListener('slotchange', this.__onChildSlotChange)
				this.__handleDistributedChildren(child /*, true*/)
			}
		}

		private __shadowRootChildRemoved(child: HTMLElement) {
			// NOTE Logic here is similar to childDisconnectedCallback

			if (child instanceof DeclarativeBase) {
				child.__shadowRootParent = null
				this.__childUncomposedCallback(child, 'root')
			} else if (child instanceof HTMLSlotElement) {
				child.removeEventListener('slotchange', this.__onChildSlotChange)
				this.__handleDistributedChildren(child)
				this.__previousSlotAssignedNodes.delete(child)
			}
		}

		private __onChildSlotChange = (event: Event) => {
			const slot = event.target as HTMLSlotElement // must be a <slot> element, if the event is slotchange
			this.__handleDistributedChildren(slot)
		}

		childComposedCallback?(child: Element, connectionType: ConnectionType): void
		childUncomposedCallback?(child: Element, connectionType: ConnectionType): void

		private __childComposedCallback(child: DeclarativeBase, connectionType: ConnectionType) {
			if (child.__isComposed) return
			child.__isComposed = true

			this.childComposedCallback && this.childComposedCallback(child, connectionType)
		}

		private __childUncomposedCallback(child: DeclarativeBase, connectionType: ConnectionType) {
			if (!child.__isComposed) return
			child.__isComposed = false

			this.childUncomposedCallback && this.childUncomposedCallback(child, connectionType)
		}

		private __handleDistributedChildren(slot: HTMLSlotElement) {
			const diff = this.__getDistributedChildDifference(slot)

			const {added} = diff
			for (let l = added.length, i = 0; i < l; i += 1) {
				const addedNode = added[i]

				if (!(addedNode instanceof DeclarativeBase)) continue

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

				this.__childComposedCallback(addedNode, 'slot')
			}

			const {removed} = diff
			for (let l = removed.length, i = 0; i < l; i += 1) {
				const removedNode = removed[i]

				if (!(removedNode instanceof DeclarativeBase)) continue

				removedNode.__distributedParent = null
				this.__distributedChildren!.delete(removedNode)
				if (!this.__distributedChildren!.size) this.__distributedChildren = undefined

				this.__childUncomposedCallback(removedNode, 'slot')
			}
		}

		private __getDistributedChildDifference(slot: HTMLSlotElement) {
			let previousNodes = this.__previousSlotAssignedNodes.get(slot) ?? []

			const newNodes = slot.assignedNodes({flatten: true})

			// save the newNodes to be used as the previousNodes for next time.
			this.__previousSlotAssignedNodes.set(slot, newNodes)

			const diff: {added: Node[]; removed: Node[]} = {
				added: newNodes,
				removed: [],
			}

			for (let i = 0, l = previousNodes.length; i < l; i += 1) {
				const oldNode = previousNodes[i]
				const newIndex = newNodes.indexOf(oldNode)

				// if it exists in the previousNodes but not the newNodes, then
				// the node was removed.
				if (!(newIndex >= 0)) {
					diff.removed.push(oldNode)
				}

				// otherwise the node wasn't added or removed.
				else {
					newNodes.splice(i, 1)
				}
			}

			// The remaining nodes in newNodes must have been added.

			return diff
		}
	}
}

type _DeclarativeBase = ReturnType<typeof makeDeclarativeBase>

export var DeclarativeBase: _DeclarativeBase
export interface DeclarativeBase extends InstanceType<_DeclarativeBase> {}

// "as default" style default export is required here. Try it the othe way to see how it breaks.
export {DeclarativeBase as default}
