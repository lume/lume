/* global HTMLSlotElement */

import WebComponent from './WebComponent'
import HTMLNode from './HTMLNode'
import {
    observeChildren,
    hasShadowDomV1,
} from '../core/Utility'
import {
    Mesh,
    BoxGeometry,
    MeshPhongMaterial,
    Color,
    NoBlending,
    DoubleSide,
} from 'three'

var DeclarativeBase

const observers = new WeakMap

initDeclarativeBase()

export function initDeclarativeBase() {
    if (DeclarativeBase) return

    /**
     * @implements {EventListener}
     */
    DeclarativeBase = WebComponent.subclass('DeclarativeBase', ({ Super, Public, Private }) => ({

        static: {
            define(name) {
                name = name || this.defaultElementName
                customElements.define(name, this)
                this._definedElementName = name // TODO static protected members in lowclass
            },

            get definedElementName() {
                return this._definedElementName || null
            },
        },

        // We use this to Override HTMLElement.prototype.attachShadow in v1 so
        // that we can make the connection between parent and child on the
        // imperative side when the HTML side is using shadow roots.
        attachShadow(options) {
            const root = Super( this ).attachShadow( options )
            const privateThis = Private(this)

            privateThis.__hasShadowRoot = true

            const observer = observeChildren(
                root,
                privateThis.__shadowRootChildAdded.bind(privateThis),
                privateThis.__shadowRootChildRemoved.bind(privateThis)
            )

            observers.set(root, observer)

            const {children} = this

            for (const child of children) {
                if (!(child instanceof DeclarativeBase)) continue
                Private(child).__isPossiblyDistributedToShadowRoot = true
            }

            return root
        },

        childConnectedCallback(child) {

            // mirror the DOM connections in the imperative API's virtual scene graph.
            if (child instanceof HTMLNode) {
                if (Private(this).__hasShadowRoot) Private(child).__isPossiblyDistributed = true

                // If ImperativeBase#add was called first, child's
                // `parent` will already be set, so prevent recursion.
                if (child.parent) return

                this.add(child)
            }
            else if (
                hasShadowDomV1
                && child instanceof HTMLSlotElement
            ) {
                child.addEventListener('slotchange', this)
                Private(this).__handleDistributedChildren(child)
            }
        },

        childDisconnectedCallback(child) {
            // mirror the connection in the imperative API's virtual scene graph.
            if (child instanceof HTMLNode) {
                Private(child).__isPossiblyDistributed = false

                // If ImperativeBase#remove was called first, child's
                // `parent` will already be null, so prevent recursion.
                if (!child.parent) return

                this.remove(child)
            }
            else if (
                hasShadowDomV1
                && child instanceof HTMLSlotElement
            ) {
                child.removeEventListener('slotchange', this)
                Private(this).__handleDistributedChildren(child)
                Private(this).__slotElementsAssignedNodes.delete(child)
            }
        },

        // Traverses a tree while considering ShadowDOM disribution.
        traverse(isShadowChild) {
            console.log(isShadowChild ? 'distributedNode:' : 'node:', this)

            // in the future, the user will be use a pure-JS API with no HTML
            // DOM API.
            const hasHtmlApi = true

            const {children} = this
            for (let l=children.length, i=0; i<l; i+=1) {
                // skip nodes that are possiblyDistributed, i.e. they have a parent
                // that has a ShadowRoot.
                if (!hasHtmlApi || !Private(children[i]).__isPossiblyDistributed)
                    children[i].traverse()
            }

            const shadowChildren = Private(this).__shadowChildren
            if (hasHtmlApi && shadowChildren) {
                for (let l=shadowChildren.length, i=0; i<l; i+=1)
                    shadowChildren[i].traverse(true)
            }
        },

        // TODO: make setAttribute accept non-string values.
        setAttribute(attr, value) {
            //if (this.tagName.toLowerCase() == 'motor-scene')
                //console.log('setting attribute', arguments[1])
            Super(this).setAttribute(attr, value)
        },

        private: {

            // true if this node has a shadow root (even if it is "closed", see
            // attachShadow method above). Once true always true because shadow
            // roots cannot be removed.
            __hasShadowRoot: false,

            // True when this node has a parent that has a shadow root. When
            // using the HTML API, Imperative API can look at this to determine
            // whether to render this node or not, in the case of WebGL.
            __isPossiblyDistributed: false,

            // A map of the slot elements that are children of this node and
            // their last-known assigned nodes. When a slotchange happens while
            // this node is in a shadow root and has a slot child, we can
            // detect what the difference is between the last known and the new
            // assignments, and notate the new distribution of child nodes. See
            // issue #40 for background on why we do this.
            __slotElementsAssignedNodes: new WeakMap,

            // If this node is distributed into a shadow tree, this will
            // reference the parent of the <slot> or <content> element.
            // Basically, this node will render as a child of that parent node
            // in the flat tree.
            __shadowParent: null,

            // If this element has a child <slot> or <content> element while in
            // a shadow root, then this will be a Set of the nodes distributed
            // into the <slot> or <content>, and those nodes render relatively
            // to this node in the flat tree. We instantiate this later, only
            // when/if needed.
            __shadowChildren: null,

            __shadowRootChildAdded(child) {

                // NOTE Logic here is similar to childConnectedCallback

                if (child instanceof DeclarativeBase) {
                    Public(this).add(child)
                }
                else if (
                    hasShadowDomV1
                    && child instanceof HTMLSlotElement
                ) {
                    child.addEventListener('slotchange', this)
                    this.__handleDistributedChildren(child)
                }
            },

            __shadowRootChildRemoved(child) {

                // NOTE Logic here is similar to childDisconnectedCallback

                if (child instanceof DeclarativeBase) {
                    Public(this).remove(child)
                }
                else if (
                    hasShadowDomV1
                    && child instanceof HTMLSlotElement
                ) {
                    child.removeEventListener('slotchange', this)
                    this.__handleDistributedChildren(child)
                    this.__slotElementsAssignedNodes.delete(child)
                }
            },

            // This method is part of the EventListener interface.
            handleEvent(event) {
                if (event.type == 'slotchange') {
                    const slot = event.target
                    this.__handleDistributedChildren(slot)
                }
            },

            __handleDistributedChildren(slot) {
                const diff = this.__getDistributedChildDifference(slot)

                const {added} = diff
                for (let l=added.length, i=0; i<l; i+=1) {
                    const addedNode = added[i]

                    if (!(addedNode instanceof DeclarativeBase)) continue

                    // Keep track of the final distribution of a node.
                    //
                    // If the given slot is assigned to another
                    // slot, then this logic will run again for the next slot on
                    // that next slot's slotchange, so we remove the distributed
                    // node from the previous shadowParent and add it to the next
                    // one. If we don't do this, then the distributed node will
                    // exist in multiple shadowChildren lists when there is a
                    // chain of assigned slots. For more info, see
                    // https://github.com/w3c/webcomponents/issues/611
                    const shadowParent = addedNode.__shadowParent
                    if (shadowParent && shadowParent.__shadowChildren) {
                        const shadowChildren = shadowParent.__shadowChildren
                        shadowChildren.splice(shadowChildren.indexOf(addedNode), 1)
                        if (!shadowChildren.length)
                            shadowParent.__shadowChildren = null
                    }

                    // The node is now distributed to `this` element.
                    addedNode.__shadowParent = this
                    if (!this.__shadowChildren) this.__shadowChildren = []
                    this.__shadowChildren.add(addedNode)
                }

                const {removed} = diff
                for (let l=removed.length, i=0; i<l; i+=1) {
                    const removedNode = removed[i]

                    if (!(removedNode instanceof DeclarativeBase)) continue

                    removedNode.__shadowParent = null
                    this.__shadowChildren.delete(removedNode)
                    if (!this.__shadowChildren.size) this.__shadowChildren = null
                }
            },

            __getDistributedChildDifference(slot) {
                let previousNodes

                if (this.__slotElementsAssignedNodes.has(slot))
                    previousNodes = this.__slotElementsAssignedNodes.get(slot)
                else
                    previousNodes = []

                const newNodes = slot.assignedNodes({flatten: true})

                // save the newNodes to be used as the previousNodes for next time.
                this.__slotElementsAssignedNodes.set(slot, newNodes)

                const diff = {
                    removed: [],
                }

                for (let i=0, l=previousNodes.length; i<l; i+=1) {
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

                // Remaining nodes in newNodes must have been added.
                diff.added = newNodes

                return diff
            },

        },

    }))
}

export {DeclarativeBase as default}
