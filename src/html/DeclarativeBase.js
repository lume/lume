/* global HTMLSlotElement */

import WebComponent from './WebComponent'
import HTMLNode from './HTMLNode'
import { observeChildren, /*getShadowRootVersion,*/ hasShadowDomV0,
    hasShadowDomV1, getAncestorShadowRoot } from '../core/Utility'

var DeclarativeBase

// We use this to Override HTMLElement.prototype.attachShadow in v1, and
// HTMLElement.prototype.createShadowRoot in v0, so that we can make the
// connection between parent and child on the iperative side when the HTML side
// is using shadow roots.
const observers = new WeakMap
function hijack(original) {
    return function(...args) {
        // In v0, shadow roots can be replaced, but in v1 calling attachShadow
        // on an element that already has a root throws. So, we can set this to
        // true, and if the try-catch passes then we know we have a v0 root and
        // that the root was just replaced.
        const oldRoot = this.shadowRoot
        let root = null
        try {
            root = original.call(this, ...args)
        }
        catch (e) { throw e }
        if (this instanceof DeclarativeBase) {
            this._hasShadowRoot = true
            if (oldRoot) {
                onV0ShadowRootReplaced.call(this, oldRoot)
            }
            const observer = observeChildren(root, shadowRootChildAdded.bind(this), shadowRootChildRemoved.bind(this))
            observers.set(root, observer)

            const {children} = this
            for (let l=children.length, i=0; i<l; i+=1) {
                if (!(children[i] instanceof DeclarativeBase)) continue
                children[i]._isPossiblyDistributed = true
            }
        }
        return root
    }
}

function shadowRootChildAdded(child) {

    // NOTE Logic here is similar to childConnectedCallback

    if (child instanceof DeclarativeBase) {
        this.imperativeCounterpart.addChild(child.imperativeCounterpart)
    }
    else if (
        hasShadowDomV0
        && child instanceof HTMLContentElement
    ) {
        // observe <content> elements.
    }
    else if (
        hasShadowDomV1
        && child instanceof HTMLSlotElement
    ) {
        child.addEventListener('slotchange', this)
        this._handleDistributedChildren(child)
    }
}

function shadowRootChildRemoved(child) {

    // NOTE Logic here is similar to childDisconnectedCallback

    if (child instanceof DeclarativeBase) {
        this.imperativeCounterpart.removeChild(child.imperativeCounterpart)
    }
    else if (
        hasShadowDomV0
        && child instanceof HTMLContentElement
    ) {
        // unobserve <content> element
    }
    else if (
        hasShadowDomV1
        && child instanceof HTMLSlotElement
    ) {
        child.removeEventListener('slotchange', this)
        this._handleDistributedChildren(child)
        this._slotElementsAssignedNodes.delete(child)
    }
}

function onV0ShadowRootReplaced(oldRoot) {
    observers.get(oldRoot).disconnect()
    observers.delete(oldRoot)
    const {childNodes} = oldRoot
    for (let l=childNodes.length, i=0; i<l; i+=1) {
        const child = childNodes[i]

        if (!(child instanceof DeclarativeBase)) continue

        // We should disconnect the imperative connection (f.e. so it is not
        // rendered in WebGL)
        this.imperativeCounterpart.removeChild(child.imperativeCounterpart, true)
    }
}

if (HTMLElement.prototype.createShadowRoot instanceof Function)
    HTMLElement.prototype.createShadowRoot = hijack(HTMLElement.prototype.createShadowRoot)
if (HTMLElement.prototype.attachShadow instanceof Function)
    HTMLElement.prototype.attachShadow = hijack(HTMLElement.prototype.attachShadow)

initDeclarativeBase()
export function initDeclarativeBase() {
    if (DeclarativeBase) return

    /**
     * @implements {EventListener}
     */
    DeclarativeBase = class DeclarativeBase extends WebComponent(window.HTMLElement) {
        constructor() {
            super()

            this.imperativeCounterpart = null // to hold the imperative API Node instance.

            // true if this node has a shadow root (even if it is "closed", see
            // hijack function above). Once true always true because shadow
            // roots cannot be removed.
            this._hasShadowRoot = false

            // True when this node has a parent that has a shadow root. When
            // using the HTML API, Imperative API can look at this to determine
            // whether to render this node or not, in the case of WebGL.
            this._isPossiblyDistributed = false

            // A map of the slot elements that are children of this node and
            // their last-known assigned nodes. When a slotchange happens while
            // this node is in a shadow root and has a slot child, we can
            // detect what the difference is between the last known and the new
            // assignments, and notate the new distribution of child nodes. See
            // issue #40 for background on why we do this.
            this._slotElementsAssignedNodes = new WeakMap

            // If this node is distributed into a shadow tree, this will
            // reference the parent of the <slot> or <content> element.
            // Basically, this node will render as a child of that parent node
            // in the flat tree.
            this._shadowParent = null

            // If this element has a child <slot> or <content> element while in
            // a shadow root, then this will be a Set of the nodes distributed
            // into the <slot> or <content>, and those nodes render relatively
            // to this node in the flat tree. We instantiate this later, only
            // when/if needed.
            this._shadowChildren = null

            // We use Promise.resolve here to defer to the next microtask.
            // While we support Custom Elements v0, this is necessary because
            // the imperative Node counterpart will have already called the
            // `_associateImperativeNode` method on this element, causing the
            // next microtask's call to be a no-op. When this MotorHTML element
            // API is used instead of the Imperative counterpart, then the next
            // microtask's `_associateImperativeNode` call will not be a no-op.
            // When we drop support for v0 Custom Elements at some point, we
            // can rely on passing a constructor argument similarly to how we
            // do with motor/Node in order to detect that the constructor is
            // being called from the reciprocal API. See the constructor in
            // motor/Node.js to get see the idea.
            // TODO: renewable promise after unmount.
            this._imperativeCounterpartPromise = Promise.resolve()
                .then(() => this._associateImperativeNode())
            this.mountPromise = this._imperativeCounterpartPromise
                .then(() => this.imperativeCounterpart.mountPromise)
        }

        /**
         * This method creates the association between this HTMLNode instance
         * and the imperative Node instance.
         *
         * This method may get called by this.init, but can also be called by
         * the Node class if Node is used imperatively. See Node#constructor.
         *
         * @private
         *
         * @param {Object} imperativeCounterpart The imperative counterpart to
         * associate with this MotorHTML element. This parameter is only used in the
         * imperative API constructors, and this happens when using the imperative
         * form of infamous instead of the HTML interface to infamous. When the HTML
         * interface is used, this gets called first without an
         * imperativeCounterpart argument and the call to this in an imperative
         * constructor will be a noop. Basically, either this gets called first by a
         * MotorHTML element, or first by an imperative instance, depending on which
         * API is used first.
         */
        _associateImperativeNode(imperativeCounterpart) {
            // if the association is made already, noop
            if (this.imperativeCounterpart) return

            // if called from an imperative-side class' constructor, associate
            // the passed instance.
            if (imperativeCounterpart) this.imperativeCounterpart = imperativeCounterpart

            // otherwise if called from a MotorHTML class without an argument
            else this.imperativeCounterpart = this._makeImperativeCounterpart()
        }

        /**
         * This method should be overriden by child classes. It should return the
         * imperative-side instance that the HTML-side class (this) corresponds to.
         * @abstract
         */
        _makeImperativeCounterpart() {
            throw new TypeError('This method should be implemented by classes extending DeclarativeBase.')
        }

        childConnectedCallback(child) {

            // mirror the DOM connections in the imperative API's virtual scene graph.
            if (child instanceof HTMLNode) {
                if (this._hasShadowRoot) child._isPossiblyDistributed = true

                // If ImperativeBase#addChild was called first, child's
                // _parent will already be set, so prevent recursion.
                if (child.imperativeCounterpart._parent) return

                this.imperativeCounterpart.addChild(child.imperativeCounterpart)
            }
            else if (
                hasShadowDomV0
                && child instanceof HTMLContentElement
                &&
                //getShadowRootVersion(
                    getAncestorShadowRoot(this)
                //) == 'v0'
            ) {
                // observe <content> elements.
            }
            else if (
                hasShadowDomV1
                && child instanceof HTMLSlotElement
                &&
                //getShadowRootVersion(
                    getAncestorShadowRoot(this)
                //) == 'v1'
            ) {
                child.addEventListener('slotchange', this)
                this._handleDistributedChildren(child)
            }
        }

        // This method is part of the EventListener interface.
        handleEvent(event) {
            if (event.type == 'slotchange') {
                const slot = event.target
                this._handleDistributedChildren(slot)
            }
        }

        _handleDistributedChildren(slot) {
            const diff = this._getDistributedChildDifference(slot)

            const {added} = diff
            for (let l=added.length, i=0; i<l; i+=1) {
                const addedNode = added[i]

                if (!(addedNode instanceof DeclarativeBase)) continue

                // We do this because if the given slot is assigned to another
                // slot, then this logic will run again for the next slot on
                // that next slot's slotchange, so we remove the distributed
                // node from the previous shadowParent and add it to the next
                // one. If we don't do this, then the distributed node will
                // exist in multiple shadowChildren lists when there is a
                // chain of assigned slots. For more info, see
                // https://github.com/w3c/webcomponents/issues/611
                const shadowParent = addedNode._shadowParent
                if (shadowParent && shadowParent._shadowChildren) {
                    const shadowChildren = shadowParent._shadowChildren
                    shadowChildren.splice(shadowChildren.indexOf(addedNode), 1)
                    if (!shadowChildren.length)
                        shadowParent._shadowChildren = null
                }

                addedNode._shadowParent = this
                if (!this._shadowChildren) this._shadowChildren = []
                this._shadowChildren.add(addedNode)
            }

            const {removed} = diff
            for (let l=removed.length, i=0; i<l; i+=1) {
                const removedNode = removed[i]

                if (!(removedNode instanceof DeclarativeBase)) continue

                removedNode._shadowParent = null
                this._shadowChildren.delete(removedNode)
                if (!this._shadowChildren.size) this._shadowChildren = null
            }
        }

        _getDistributedChildDifference(slot) {
            let previousNodes

            if (this._slotElementsAssignedNodes.has(slot))
                previousNodes = this._slotElementsAssignedNodes.get(slot)
            else
                previousNodes = []

            const newNodes = slot.assignedNodes({flatten: true})

            // save the newNodes to be used as the previousNodes for next time.
            this._slotElementsAssignedNodes.set(slot, newNodes)

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
        }

        childDisconnectedCallback(child) {
            // mirror the connection in the imperative API's virtual scene graph.
            if (child instanceof HTMLNode) {
                child._isPossiblyDistributed = false

                // If ImperativeBase#removeChild was called first, child's
                // _parent will already be null, so prevent recursion.
                if (!child.imperativeCounterpart._parent) return

                this.imperativeCounterpart.removeChild(child.imperativeCounterpart)
            }
            else if (
                hasShadowDomV0
                && child instanceof HTMLContentElement
                &&
                //getShadowRootVersion(
                    getAncestorShadowRoot(this)
                //) == 'v0'
            ) {
                // unobserve <content> element
            }
            else if (
                hasShadowDomV1
                && child instanceof HTMLSlotElement
                &&
                //getShadowRootVersion(
                    getAncestorShadowRoot(this)
                //) == 'v1'
            ) {
                child.removeEventListener('slotchange', this)
                this._handleDistributedChildren(child)
                this._slotElementsAssignedNodes.delete(child)
            }
        }

        setAttribute(attr, value) {
            //if (this.tagName.toLowerCase() == 'motor-scene')
                //console.log('setting attribute', arguments[1])
            super.setAttribute(attr, value)
        }
    }
}

// Creates setters/getters on the TargetClass which proxy to the
// setters/getters on SourceClass.
export function proxyGettersSetters(SourceClass, TargetClass) {

    // Node methods not to proxy (private underscored methods are also detected and
    // ignored).
    const methodProxyBlacklist = [
        'constructor',
        'parent',
        'children', // proxying this one would really break stuff (f.e. React)
        'element',
        'scene',
        'addChild',
        'addChildren',
        'removeChild',
        'removeChildren',
    ]

    const props = Object.getOwnPropertyNames(SourceClass.prototype)

    for (let l=props.length, i=0; i<l; i+=1) {
        const prop = props[i]
        if (
            // skip the blacklisted properties
            methodProxyBlacklist.indexOf(prop) >= 0

            // skip the private underscored properties
            || prop.indexOf('_') == 0

            // skip properties that are already defined.
            || TargetClass.prototype.hasOwnProperty(prop)
        ) continue

        const targetDescriptor = {}
        const sourceDescriptor = Object.getOwnPropertyDescriptor(SourceClass.prototype, prop)

        // if the property has a setter
        if (sourceDescriptor.set) {
            Object.assign(targetDescriptor, {
                set(value) {
                    this.imperativeCounterpart[prop] = value
                }
            })
        }

        // if the property has a getter
        if (sourceDescriptor.get) {
            Object.assign(targetDescriptor, {
                get() {
                    return this.imperativeCounterpart[prop]
                }
            })
        }

        Object.defineProperty(TargetClass.prototype, prop, targetDescriptor)
    }
}

export {DeclarativeBase as default}
