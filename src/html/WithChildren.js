import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'
import { observeChildren } from '../core/Utility'

// polyfill for Node.isConnected based on a blend of Ryosuke Niwa's and ShadyDOM's
// https://github.com/w3c/webcomponents/issues/789#issuecomment-459858405
// https://github.com/webcomponents/webcomponentsjs/issues/1065
if (!Object.getOwnPropertyDescriptor(Node.prototype, 'isConnected')) {
    let rootNode = null

    if (Node.prototype.getRootNode)
        rootNode  = (node) => node.getRootNode({composed: true})
    else {
        rootNode = (node) => {
            for (let ancestor = node, ancestorParent; ancestor; ancestor = ancestorParent) {
                ancestorParent = ancestor.parentNode || ancestor.host
                if (!ancestorParent)
                    return ancestor
            }
            return node
        }
    }

    Object.defineProperty(Node.prototype, 'isConnected', {
        get() {
            if (document.contains) return document.contains(this)
            return rootNode(this).nodeType === Node.DOCUMENT_NODE
        },
        enumerable: true,
        configurable: true,
    })
}

// we use this to detect when elements are upgraded while they are already
// connected in the DOM (i.e. when customElements.define is called after a piece
// of DOM has already been parsed), in which case the customElements.define() call
// will upgrade (call constructor on) existing elements synchronously.
let isCustomElementsDefineCall = false
// const upgradedElements = []
{
    const oldDefine = customElements.define
    customElements.define = function(tagName, Constructor) {
        isCustomElementsDefineCall = true

        oldDefine.call(this, tagName, Constructor)

        // Promise.resolve().then(() => {
        //     for (let l=upgradedElements.length, i=0; i<l; i+=1) {
        //         const el = upgradedElements[i]
        //         const currentChildren = el.children
        //
        //         for (let l=currentChildren.length, i=0; i<l; i+=1) {
        //             const child = currentChildren[i]
        //             debugger
        //             el.childConnectedCallback && el.childConnectedCallback(currentChildren[i])
        //         }
        //     }
        // })

        isCustomElementsDefineCall = false
    }
}

export default
Mixin(Base => Class('WithChildren').extends(Base, ({ Super, Private, Public }) => ({
    constructor(...args) {
        const self = Super(this).constructor(...args)

        Private(self).__createObserver()

        // If we're in a customElements.define call, then this constructor is
        // runnning synchronously in that call, and in this case the MutationObserver
        // created in the previous line will not fire callbacks because the children are
        // technically already connected, so we fire the callbacks manually here.
        if (isCustomElementsDefineCall) {
            Private(self).__queueChildConnectedCallbacks()
            // upgradedElements.push(self)
        }

        return self
    },

    connectedCallback() {
        Super(this).connectedCallback && Super(this).connectedCallback()

        const priv = Private(this)

        // NOTE! This specifically handles the case that if the node was previously
        // disconnected from the document, then it won't have an __observer when
        // reconnected. This is not the case when the element is first created,
        // in which case the constructor already created the __observer.
        //
        // So in this case we have to manually trigger childConnectedCallbacks
        if (!priv.__observer) {
            Private(this).__queueChildConnectedCallbacks()
        }

        Private(this).__createObserver()
    },

    disconnectedCallback() {
        Super(this).disconnectedCallback && Super(this).disconnectedCallback()

        // Here we have to manually trigger childDisconnectedCallbacks
        // because the observer will be disconnected.
        Private(this).__queueChildDisconnectedCallbacks()

        Private(this).__destroyObserver()
    },

    private: {
        __observer: null,

        __createObserver() {
            if (this.__observer) return

            const self = Public(this)

            this.__observer = observeChildren(
                self,
                child => {
                    if (!self.isConnected) return
                    self.childConnectedCallback && self.childConnectedCallback(child)
                },
                child => {
                    if (!self.isConnected) return
                    self.childDisconnectedCallback && self.childDisconnectedCallback(child)
                },
                true
            )
        },

        __destroyObserver() {
            if (!this.__observer) return
            this.__observer.disconnect()
            this.__observer = null
        },

        __queueChildConnectedCallbacks() {
            const self = Public(this)
            const currentChildren = self.children

            // NOTE! Luckily Promise.resolve() fires AFTER all children
            // connectedCallbacks (and thus after children have been upgraded),
            // which makes it similar to the MutationObserver events!
            Promise.resolve().then(() => {
                for (let l=currentChildren.length, i=0; i<l; i+=1) {
                    debugger
                    self.childConnectedCallback && self.childConnectedCallback(currentChildren[i])
                }
            })
        },

        __queueChildDisconnectedCallbacks() {
            const self = Public(this)

            const lastKnownChildren = self.children

            // NOTE! Luckily Promise.resolve() fires AFTER all children disconnectedCallbacks,
            // which makes it similar to the MutationObserver events!
            Promise.resolve().then(() => {
                for (let l=lastKnownChildren.length, i=0; i<l; i+=1) {
                    self.childDisconnectedCallback && self.childDisconnectedCallback(lastKnownChildren[i])
                }
            })
        },
    },
})))
