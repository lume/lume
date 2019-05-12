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

            privateThis.__shadowRoot = root

            const observer = observeChildren(
                root,
                privateThis.__shadowRootChildAdded.bind(privateThis),
                privateThis.__shadowRootChildRemoved.bind(privateThis),
                true
            )

            observers.set(root, observer)

            const {children} = this

            for (const child of children) {
                // debugger

                if (!(child instanceof DeclarativeBase)) continue

                // TODO replace Private(this) with generic private access for
                // any object, so we can check instanceof HTMLElement instead of
                // DeclarativeBase, and make it more generic?
                Private(child).__isPossiblyDistributedToShadowRoot = true
                console.log('   <<<<<<<<<<<<<<< CHILD SHOULD BE UN COMPOSED, BY ADDING SHADOW ROOT', child.constructor.name, child.id)
                Private(this).__childUncomposedCallback(child, 'slot')
            }

            return root
        },

        childConnectedCallback(child) {
            console.log( '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4' )
            // mirror the DOM connections in the imperative API's virtual scene graph.
            if (child instanceof HTMLNode) {
                console.log(' ----------------------- childConnectedCallback', this.constructor.name, child.constructor.name, child.id)
                if (!this.isScene && Private(this).__shadowRoot) {
                    console.log( ' *************** parent has shadow, dont compose child here', this.tagName )
                    Private(child).__isPossiblyDistributedToShadowRoot = true
                }
                else {
                    // If there's no shadow root, call the childComposedCallback
                    // with connection type "actual". This is effectively
                    // similar to childConnectedCallback.
                    console.log('   >>>>>>>>>>>>>>> CHILD SHOULD BE COMPOSED, NORMALLY', child.constructor.name, child.id)
                    // debugger
                    Private(this).__childComposedCallback(child, 'actual')
                }
            }
            else if (
                hasShadowDomV1
                && child instanceof HTMLSlotElement
            ) {
                if (!Private(this).__slots) Private(this).__slots = []
                Private(this).__slots.push(child)
                child.addEventListener('slotchange', Private(this))
                // TODO do we need __handleDistributedChildren for initial
                // slotted nodes? Or does `slotchange` conver that? Also, does
                // `slotchange` fire for distributed slots? Or do we need to
                // also look at assigned nodes of distributed slots in the
                // initial __handleDistributedChildren call?
                Private(this).__handleDistributedChildren(child, true)
            }
        },

        childDisconnectedCallback(child) {
            // mirror the connection in the imperative API's virtual scene graph.
            if (child instanceof HTMLNode) {
                if (Private(this).__shadowRoot) {
                    Private(child).__isPossiblyDistributedToShadowRoot = false
                }
                else {
                    // If there's no shadow root, call the
                    // childUncomposedCallback with connection type "actual".
                    // This is effectively similar to childDisconnectedCallback.
                    console.log('   <<<<<<<<<<<<<<< CHILD SHOULD BE UN COMPOSED, NORMALLY', child.constructor.name, child.id)
                    Private(this).__childUncomposedCallback(child, 'actual')
                }
            }
            else if (
                hasShadowDomV1
                && child instanceof HTMLSlotElement
            ) {
                child.removeEventListener('slotchange', this)
                const priv = Private(this)
                priv.__slots.splice(priv.__slots.indexOf(child), 1)
                if (!priv.__slots.length) priv.__slots = null
                Private(this).__handleDistributedChildren(child)
                Private(this).__previousSlotAssignedNodes.delete(child)
            }
        },

        get hasHtmlApi() {
            if (this instanceof HTMLElement) return true
            return false
        },

        // Traverses a tree while considering ShadowDOM disribution.
        traverseComposed(isShadowChild) {
            console.log(isShadowChild ? 'distributedNode:' : 'node:', this)

            // in the future, the user will be use a pure-JS API with no HTML
            // DOM API.
            const hasHtmlApi = this.hasHtmlApi

            const {children} = this
            for (let l=children.length, i=0; i<l; i+=1) {
                // skip nodes that are possiblyDistributed, i.e. they have a parent
                // that has a ShadowRoot.
                if (!hasHtmlApi || !Private(children[i]).__isPossiblyDistributedToShadowRoot)
                    children[i].traverseComposed()
            }

            const distributedChildren = Private(this).__distributedChildren
            if (hasHtmlApi && distributedChildren) {
                for (const shadowChild of distributedChildren)
                    shadowChild.traverseComposed(true)
            }
        },

        // TODO: make setAttribute accept non-string values.
        setAttribute(attr, value) {
            //if (this.tagName.toLowerCase() == 'motor-scene')
                //console.log('setting attribute', arguments[1])
            Super(this).setAttribute(attr, value)
        },

        protected: {
            get _hasShadowRoot() {
                return !!Private(this).__shadowRoot
            },

            get _isPossiblyDistributedToShadowRoot() {
                return Private(this).__isPossiblyDistributedToShadowRoot
            },

            get _shadowRootParent() {
                return Private(this).__shadowRootParent
            },

            get _distributedParent() {
                return Private(this).__distributedParent
            },

            get _distributedChildren() {
                return Private(this).__distributedChildren ? [...Private(this).__distributedChildren] : null
            },

            // The composed parent is the parent that this node renders relative
            // to in the flat tree (composed tree).
            get _composedParent() {
                return Private(this).__distributedParent || Private(this).__shadowRootParent || Public(this).parentElement
            },

            // Composed children are the children that render relative to this
            // node in the flat tree (composed tree), whether as children of a
            // shadow root, or distributed children (assigned nodes) of a <slot>
            // element.
            get _composedChildren() {
                if (Private(this).__shadowRoot) {
                    return [
                        ...Array.prototype.filter.call(Private(this).__shadowRoot.children, n => n instanceof DeclarativeBase)
                    ]
                }
                else {
                    return [
                        ...(Private(this).__distributedChildren || []), // TODO perhaps use slot.assignedNodes instead?
                        ...Public(this).children,
                    ]
                }
            },
        },

        private: {

            // This node's shadow root, if any. This always points to the shadow
            // root, even if it is a closed root, unlike the public shadowRoot
            // property.
            __shadowRoot: null,

            // All <slot> elements of this node, if any.
            __slots: null,

            // True when this node has a parent that has a shadow root. When
            // using the HTML API, Imperative API can look at this to determine
            // whether to render this node or not, in the case of WebGL.
            __isPossiblyDistributedToShadowRoot: false,

            // A map of the slot elements that are children of this node and
            // their last-known assigned nodes. When a slotchange happens while
            // this node is in a shadow root and has a slot child, we can
            // detect what the difference is between the last known and the new
            // assignments, and notate the new distribution of child nodes. See
            // issue #40 for background on why we do this.
            __previousSlotAssignedNodes: new WeakMap,

            // If this node is distributed into a shadow tree, this will
            // reference the parent of the <slot> element where this node is
            // distribuetd to. Basically, this node will render as a child of
            // that parent node in the flat tree (composed tree).
            __distributedParent: null,

            // If this node is a top-level child of a shadow root, then this
            // points to the parent of the shadow root. The shadow root parent
            // is the node that this node renders relative to in the flat tree
            // (composed tree).
            __shadowRootParent: null,

            __isComposed: false,
            // get __isComposed() {
            //     return this.__distributedParent || this.__shadowRootParent
            // },

            // If this element has a child <slot> element while in
            // a shadow root, then this will be a Set of the nodes distributed
            // into the <slot>, and those nodes render relatively
            // to this node in the flat tree. We instantiate this later, only
            // when/if needed.
            __distributedChildren: null,

            __shadowRootChildAdded(child) {

                // NOTE Logic here is similar to childConnectedCallback

                if (child instanceof DeclarativeBase) {
                    Private(child).__shadowRootParent = Public(this)

                    // Public(this).add(child)
                    // Public(this).possiblyLoadThree(child)

                    console.log('   >>>>>>>>>>>>>>> CHILD SHOULD BE COMPOSED, SHADOW ROOT', child.constructor.name, child.id)
                    Private(this).__childComposedCallback(child, 'root')
                }
                else if (
                    hasShadowDomV1
                    && child instanceof HTMLSlotElement
                ) {
                    child.addEventListener('slotchange', this)
                    this.__handleDistributedChildren(child, true)
                }
            },

            __shadowRootChildRemoved(child) {

                // NOTE Logic here is similar to childDisconnectedCallback

                if (child instanceof DeclarativeBase) {
                    Private(child).__shadowRootParent = null

                    // Public(this).remove(child)

                    console.log('   <<<<<<<<<<<<<<< CHILD SHOULD BE UN COMPOSED, SHADOW ROOT', child.constructor.name, child.id)
                    Private(this).__childUncomposedCallback(child, 'root')
                }
                else if (
                    hasShadowDomV1
                    && child instanceof HTMLSlotElement
                ) {
                    child.removeEventListener('slotchange', this)
                    this.__handleDistributedChildren(child)
                    this.__previousSlotAssignedNodes.delete(child)
                }
            },

            // This method is called by EventTarget.addEventListener. It cannot
            // be prefixed with double underscores like the other private
            // methods, because EventTarget explicitly looks for and calls the
            // "handleEvent" method.
            handleEvent(event) {
                if (event.type == 'slotchange') {
                    const slot = event.target
                    console.log( '######################### SLOT CHANGE' )
                    this.__handleDistributedChildren(slot)
                }
            },

            __childComposedCallback(child, connectionType) {
                if (Private(child).__isComposed) return
                Private(child).__isComposed = true

                console.log(' ---------------- __childComposedCallback')

                Public(this).childComposedCallback &&
                    Public(this).childComposedCallback(child, connectionType)
            },

            __childUncomposedCallback(child, connectionType) {
                if (!Private(child).__isComposed) return
                Private(child).__isComposed = false

                Public(this).childUncomposedCallback &&
                    Public(this).childUncomposedCallback(child, connectionType)
            },

            __handleDistributedChildren(slot, isInitial = false) {
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
                    // node from the previous distributedParent and add it to the next
                    // one. If we don't do this, then the distributed node will
                    // exist in multiple distributedChildren lists when there is a
                    // chain of assigned slots. For more info, see
                    // https://github.com/w3c/webcomponents/issues/611
                    const distributedParent = Private(addedNode).__distributedParent
                    if (distributedParent) {
                        const distributedChildren = Private(distributedParent).__distributedChildren
                        if (distributedChildren) {
                            distributedChildren.delete(addedNode)
                            if (!distributedChildren.size)
                                Private(distributedParent).__distributedChildren = null
                        }
                    }

                    // The node is now distributed to `this` element.
                    Private(addedNode).__distributedParent = Public(this)
                    if (!this.__distributedChildren) this.__distributedChildren = new Set
                    this.__distributedChildren.add(addedNode)

                    // ********** copied from ImperativeBase#add {{

                    // // Calculate sizing because proportional size might depend on
                    // // the new parent.
                    // Protected(childNode)._calcSize()
                    // childNode.needsUpdate()
                    //
                    // // child should watch the parent for size changes.
                    // this.on('sizechange', Protected(childNode)._onParentSizeChange, Protected(childNode))

                    // ******** }}

                    // Protected(addedNode)._connectThree()

                    console.log('   >>>>>>>>>>>>>>> CHILD SHOULD BE COMPOSED, SLOTTED', addedNode.constructor.name, addedNode.id)
                    // debugger
                    Private(this).__childComposedCallback(addedNode, 'slot')
                }

                const {removed} = diff
                for (let l=removed.length, i=0; i<l; i+=1) {
                    const removedNode = removed[i]

                    if (!(removedNode instanceof DeclarativeBase)) continue

                    Private(removedNode).__distributedParent = null
                    this.__distributedChildren.delete(removedNode)
                    if (!this.__distributedChildren.size) this.__distributedChildren = null

                    console.log('   <<<<<<<<<<<<<<< CHILD SHOULD BE UN COMPOSED, UN SLOTTED', removedNode.constructor.name, removedNode.id)
                    // debugger
                    Private(this).__childUncomposedCallback(removedNode, 'slot')
                }
            },

            __getDistributedChildDifference(slot) {
                let previousNodes

                if (this.__previousSlotAssignedNodes.has(slot))
                    previousNodes = this.__previousSlotAssignedNodes.get(slot)
                else
                    previousNodes = []

                const newNodes = slot.assignedNodes({flatten: true})
                // debugger

                // save the newNodes to be used as the previousNodes for next time.
                this.__previousSlotAssignedNodes.set(slot, newNodes)

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
