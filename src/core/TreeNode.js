import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'
import WithUpdate from '../html/WithUpdate'
import {instanceOf} from './Utility'
import TreeNode from './TreeNode'

const TreeNodeBrand = {brand: 'TreeNode'}

export default Mixin(Base =>
    Class('TreeNode').extends(
        WithUpdate.mixin(Base),
        ({Super, Private}) => ({
            constructor(...args) {
                const self = super(...args)
                this.__children = []
                return self
            },

            /**
             * @readonly
             */
            get parent() {
                return this.__parent
            },

            /**
             * This is named "subnodes" to avoid conflict with HTML's Element.children
             * @readonly
             */
            get subnodes() {
                // return a new array, so that the user modifying it doesn't affect
                // this node's actual children.
                return [...this.__children]
            },

            /**
             * Add a child node to this TreeNode.
             *
             * @param {TreeNode} childNode The child node to add.
             */
            add(childNode) {
                if (!instanceOf(childNode, TreeNode))
                    throw new TypeError('TreeNode.add() expects the childNode argument to be a TreeNode instance.')

                if (childNode.__parent === this)
                    throw new ReferenceError('childNode is already a child of this parent.')

                if (childNode.__parent) childNode.__parent.remove(childNode)

                childNode.__parent = this

                this.__children.push(childNode)

                Promise.resolve().then(() => {
                    childNode.connected()
                    this.childConnected(childNode)
                })

                return this
            },

            /**
             * Add all the child nodes in the given array to this node.
             *
             * @param {Array.TreeNode} nodes The nodes to add.
             */
            addChildren(nodes) {
                nodes.forEach(node => this.add(node))
                return this
            },

            /**
             * Remove a child node from this node.
             *
             * @param {TreeNode} childNode The node to remove.
             */
            remove(childNode) {
                if (!instanceOf(childNode, TreeNode))
                    throw new Error(`
                    TreeNode.remove expects the childNode argument to be an
                    instance of TreeNode. There should only be TreeNodes in the
                    tree.
                `)

                if (childNode.__parent !== this) throw new ReferenceError('childNode is not a child of this parent.')

                childNode.__parent = null
                this.__children.splice(this.__children.indexOf(childNode), 1)

                Promise.resolve().then(() => {
                    childNode.disconnected()
                    this.childDisconnected(childNode)
                })

                return this
            },

            /**
             * Remove all the child nodes in the given array from this node.
             *
             * @param {Array.TreeNode} nodes The nodes to remove.
             */
            removeChildren(nodes) {
                nodes.forEach(node => this.remove(node))
                return this
            },

            /**
             * Shortcut to remove all children.
             */
            removeAllChildren() {
                this.removeChildren(this.__children)
                return this
            },

            /**
             * @readonly
             * @return {number} How many children this TreeNode has.
             */
            get childCount() {
                return this.__children.length
            },

            // generic life cycle methods
            connected() {},
            disconnected() {},
            childConnected(child) {},
            childDisconnected(child) {},

            // traverse the tree at this node
            traverse(fn) {
                fn(this)

                const children = this.__children
                for (let i = 0, l = children.length; i < l; i++) {
                    children[i].traverse(fn)
                }
            },

            protected: {TreeNode: 'TreeNode'},

            private: {
                __parent: null,
                __children: null,
            },
        }),
        TreeNodeBrand
    )
)
