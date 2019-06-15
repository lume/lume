import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'
import {observeChildren} from '../core/Utility'

// polyfill for Node.isConnected based on Ryosuke Niwa's
// https://github.com/w3c/webcomponents/issues/789#issuecomment-459858405
if (!Object.getOwnPropertyDescriptor(Node.prototype, 'isConnected')) {
    let rootNode = null

    if (Node.prototype.getRootNode) rootNode = node => node.getRootNode({composed: true})
    else {
        rootNode = node => {
            for (let ancestor = node, ancestorParent; ancestor; ancestor = ancestorParent) {
                ancestorParent = ancestor.parentNode || ancestor.host
                if (!ancestorParent) return ancestor
            }
            return node
        }
    }

    Object.defineProperty(Node.prototype, 'isConnected', {
        get() {
            return rootNode(this).nodeType === Node.DOCUMENT_NODE
        },
        enumerable: true,
        configurable: true,
    })
}

const Brand = {}

export default Mixin(Base =>
    Class('WithChildren').extends(
        Base,
        ({Super, Private, Public}) => ({
            constructor(...args) {
                const self = super(...args)

                this.__createObserver()

                if (!self.isConnected) {
                    this.__handleChildrenWhenConnected = true
                    return self
                }

                this.__handleConnectedChildren()

                return self
            },

            connectedCallback() {
                super.connectedCallback && super.connectedCallback()

                if (priv.__handleChildrenWhenConnected) {
                    priv.__handleConnectedChildren()
                }

                priv.__createObserver()
            },

            disconnectedCallback() {
                super.disconnectedCallback && super.disconnectedCallback()

                this.__destroyObserver()
                this.__handleChildrenWhenConnected = true
            },

            private: {
                __handleChildrenWhenConnected: false,
                __observer: null,

                __createObserver() {
                    if (this.__observer) return

                    // observeChildren returns a MutationObserver observing childList
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

                __handleConnectedChildren() {
                    if (!self.isConnected) return

                    for (let element = self.firstElementChild; element; element = element.nextElementSibling) {
                        this.__handleConnectedChild(element)
                    }
                },

                __handleConnectedChild(element) {
                    Promise.resolve().then(() => {
                        if (isNotPossiblyCustom(element) || element.matches(':defined')) {
                            self.childConnectedCallback && self.childConnectedCallback(element)
                        } else {
                            setTimeout(() => {
                                self.childConnectedCallback && self.childConnectedCallback(element)
                            })
                        }
                    })
                },
            },
        }),
        Brand
    )
)

function isNotPossiblyCustom(element) {
    return !element.localName.includes('-')
}
