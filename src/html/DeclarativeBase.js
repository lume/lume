/* global HTMLSlotElement */

import Class from 'lowclass'
import WebComponent from './WebComponent'
import HTMLNode from './HTMLNode'
import { observeChildren, /*getShadowRootVersion,*/ hasShadowDomV0,
    hasShadowDomV1, getAncestorShadowRoot } from '../core/Utility'
import {
    Mesh,
    BoxGeometry,
    MeshPhongMaterial,
    Color,
    NoBlending,
    DoubleSide,
} from 'three'

var DeclarativeBase
var DeclarativeBasePrivate

// We use this to Override HTMLElement.prototype.attachShadow in v1, and
// HTMLElement.prototype.createShadowRoot in v0, so that we can make the
// connection between parent and child on the imperative side when the HTML side
// is using shadow roots.
const observers = new WeakMap
function hijack(original) {
    return function(...args) {
        if ( !( this instanceof DeclarativeBase) )
            return original.call(this, ...args)

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

        const privateThis = DeclarativeBasePrivate(this)

        privateThis._hasShadowRoot = true
        if (oldRoot) {
            onV0ShadowRootReplaced.call(this, oldRoot)
        }
        const observer = observeChildren(
            root,
            privateThis._shadowRootChildAdded.bind(privateThis),
            privateThis._shadowRootChildRemoved.bind(privateThis)
        )
        observers.set(root, observer)

        const {children} = this
        for (let l=children.length, i=0; i<l; i+=1) {
            if (!(children[i] instanceof DeclarativeBase)) continue
            Private(children[i])._isPossiblyDistributed = true
        }

        return root
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
        this.remove(child, true)
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
    DeclarativeBase = Class().extends( WebComponent(), ({ Super, Public, Private }) => ( DeclarativeBasePrivate = Private, {

        static: {
            define(name) {
                name = name || this.defaultElementName
                customElements.define(name, this._Class)
                this._definedElementName = name
            },

            get definedElementName() {
                return this._definedElementName || null
            },
        },

        construct() {
            Super(this).construct()

            // If this HTMLNode needs to be visible (f.e. it has non-library
            // HTML children like div, span, img, etc), then we store here a
            // reference to a WebGL plane that is aligned with the DOM element
            // in order to achieve "mixed mode" features like the DOM element
            // intersecting with WebGL meshes.
            this._threeDOMPlane = null
        },

        childConnectedCallback(child) {

            // mirror the DOM connections in the imperative API's virtual scene graph.
            if (child instanceof HTMLNode) {
                if (Private(this)._hasShadowRoot) Private(child)._isPossiblyDistributed = true

                // If ImperativeBase#add was called first, child's
                // _parent will already be set, so prevent recursion.
                if (child._parent) return

                this.add(child)
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
                Private(this)._handleDistributedChildren(child)
            }
            else { // if non-library content was added (div, img, etc).

                // TODO: replace this check with a more general one that
                // detects if anything is visible including from styling, not
                // just content. Perhaps make a specific API for defining that
                // a node should have DOM content, to make it clear.
                if ( this instanceof HTMLNode && !this.isDOMPlane && (
                    ( !( child instanceof Text ) && !( child instanceof Comment ) ) ||
                    ( child instanceof Text && child.textContent.trim().length > 0 )
                ) ) {
                    this._possiblyCreateDOMPlane()
                }
            }
        },

        childDisconnectedCallback(child) {
            // mirror the connection in the imperative API's virtual scene graph.
            if (child instanceof HTMLNode) {
                Private(child)._isPossiblyDistributed = false

                // If ImperativeBase#remove was called first, child's
                // _parent will already be null, so prevent recursion.
                if (!child._parent) return

                this.remove(child)
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
                Private(this)._handleDistributedChildren(child)
                Private(this)._slotElementsAssignedNodes.delete(child)
            }
            else { // if non-library content was removed (div, img, etc).
                if ( this instanceof HTMLNode && !this.isDOMPlane && (
                    ( !( child instanceof Text ) && !( child instanceof Comment ) ) ||
                    ( child instanceof Text && child.textContent.trim().length > 0 )
                ) ) {
                    this._possiblyDestroyDOMPlane()
                }
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
                if (!hasHtmlApi || !Private(children[i])._isPossiblyDistributed)
                    children[i].traverse()
            }

            const shadowChildren = Private(this)._shadowChildren
            if (hasHtmlApi && shadowChildren) {
                for (let l=shadowChildren.length, i=0; i<l; i+=1)
                    shadowChildren[i].traverse(true)
            }
        },

        _possiblyCreateDOMPlane() {
            if ( !this._nonLibraryElementCount ) {
                this._nonLibraryElementCount = 0

                this._createDOMPlane()
            }
            this._nonLibraryElementCount++
        },

        _possiblyDestroyDOMPlane() {
            this._nonLibraryElementCount--
            if ( !this._nonLibraryElementCount ) {
                this._destroyDOMPlane()
            }
        },

        _createDOMPlane() {
            // We have to use a BoxGeometry instead of a
            // PlaneGeometry because Three.js is not capable of
            // casting shadows from Planes, at least until we find
            // another way. Unfortunately, this increases polygon
            // count by a factor of 6. See issue
            // https://github.com/mrdoob/three.js/issues/9315
            const geometry = this._createDOMPlaneGeometry()
            // TODO PERFORMANCE we can re-use a single material for
            // all the DOM planes rather than a new material per
            // plane.
            const material = new MeshPhongMaterial({
                opacity	: 0.5,
                color	: new Color( 0x111111 ),
                blending: NoBlending,
                //side	: DoubleSide,
            })
            const mesh = this._threeDOMPlane = new Mesh( geometry, material )
            mesh.castShadow = true
            mesh.receiveShadow = true
            this.threeObject3d.add(mesh)
            this.on('sizechange', this._updateDOMPlaneOnSizeChange, this)
        },

        _updateDOMPlaneOnSizeChange({ x, y, z }) {
            // TODO PERFORMANCE, destroying and creating a whole new geometry is
            // wasteful, but it works for now. Improve this.
            this._threeDOMPlane.geometry.dispose()
            this._threeDOMPlane.geometry = this._createDOMPlaneGeometry()
        },

        _destroyDOMPlane() {
            this.threeObject3d.remove(this._threeDOMPlane)
            this._threeDOMPlane.geometry.dispose()
            this._threeDOMPlane.material.dispose()
            this._threeDOMPlane = null

            this.off('sizechange', this._updateDOMPlaneOnSizeChange)
        },

        _createDOMPlaneGeometry() {
            return new BoxGeometry( this._calculatedSize.x, this._calculatedSize.y, 1 )
        },

        // TODO: make setAttribute accept non-string values.
        setAttribute(attr, value) {
            //if (this.tagName.toLowerCase() == 'motor-scene')
                //console.log('setting attribute', arguments[1])
            Super(this).setAttribute(attr, value)
        },

        protected: {
        },

        private: {

            // true if this node has a shadow root (even if it is "closed", see
            // hijack function above). Once true always true because shadow
            // roots cannot be removed.
            _hasShadowRoot: false,

            // True when this node has a parent that has a shadow root. When
            // using the HTML API, Imperative API can look at this to determine
            // whether to render this node or not, in the case of WebGL.
            _isPossiblyDistributed: false,

            // A map of the slot elements that are children of this node and
            // their last-known assigned nodes. When a slotchange happens while
            // this node is in a shadow root and has a slot child, we can
            // detect what the difference is between the last known and the new
            // assignments, and notate the new distribution of child nodes. See
            // issue #40 for background on why we do this.
            _slotElementsAssignedNodes: new WeakMap,

            // If this node is distributed into a shadow tree, this will
            // reference the parent of the <slot> or <content> element.
            // Basically, this node will render as a child of that parent node
            // in the flat tree.
            _shadowParent: null,

            // If this element has a child <slot> or <content> element while in
            // a shadow root, then this will be a Set of the nodes distributed
            // into the <slot> or <content>, and those nodes render relatively
            // to this node in the flat tree. We instantiate this later, only
            // when/if needed.
            _shadowChildren: null,

            _shadowRootChildAdded(child) {

                // NOTE Logic here is similar to childConnectedCallback

                if (child instanceof DeclarativeBase) {
                    Public(this).add(child)
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
            },

            _shadowRootChildRemoved(child) {

                // NOTE Logic here is similar to childDisconnectedCallback

                if (child instanceof DeclarativeBase) {
                    Public(this).remove(child)
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
            },

            // This method is part of the EventListener interface.
            handleEvent(event) {
                if (event.type == 'slotchange') {
                    const slot = event.target
                    this._handleDistributedChildren(slot)
                }
            },

            _handleDistributedChildren(slot) {
                const diff = this.getDistributedChildDifference(slot)

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
                    const shadowParent = addedNode._shadowParent
                    if (shadowParent && shadowParent._shadowChildren) {
                        const shadowChildren = shadowParent._shadowChildren
                        shadowChildren.splice(shadowChildren.indexOf(addedNode), 1)
                        if (!shadowChildren.length)
                            shadowParent._shadowChildren = null
                    }

                    // The node is now distributed to `this` element.
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
            },

            getDistributedChildDifference(slot) {
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
            },
        },
    }))
}

// Creates setters/getters on the TargetClass which proxy to the
// setters/getters on SourceClass.
export function proxyGettersSetters(SourceClass, TargetClass) {

    // Node methods not to proxy (private underscored methods are also detected and
    // ignored).
    // TODO TODO: convert to a whitelist rather than a blacklist, so that
    // we explicitly know which accessors we proxy. This already caused a
    // hard-to-debug error, we really need to change to a whitelist.
    const methodProxyBlacklist = [
        'constructor',
        'parent',
        'children', // proxying this one would really break stuff (f.e. React)
        'element',
        'scene',
        'add',
        'addChildren',
        'remove',
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
                    this[prop] = value
                }
            })
        }

        // if the property has a getter
        if (sourceDescriptor.get) {
            Object.assign(targetDescriptor, {
                get() {
                    return this[prop]
                }
            })
        }

        Object.defineProperty(TargetClass.prototype, prop, targetDescriptor)
    }
}

export {DeclarativeBase as default}
