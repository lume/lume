import Class from 'lowclass'
import native from 'lowclass/native'
import {withUpdate} from '@trusktr/skatejs'
import Mixin from './Mixin'
import {isInstanceof} from './Utility'
import TreeNode from './TreeNode'

export default
Mixin(Base =>

    Class('TreeNode').extends( native( withUpdate( Base ) ), ({ Super, Public: Private }) => ({

        // TODO, make Private work with Mixin+lowclass. The problem is when
        // using `Private` on instance of the same class created by a different
        // mixin application. We may have to do something similar to the
        // hasInstance Mixin helper.
        //private: {
            _parent: null,
            _children: null,

            __traverse(fn) {
                fn(this)

                const children = this._children
                for (let i = 0, l = children.length; i < l; i++) {
                    console.log( 'CHILD!', children[i] )
                    Private(children[i]).__traverse(fn)
                }
            },
        //},

        // traverse the tree at this node
        traverse(fn) {
            Private(this).__traverse(fn)
        },

        constructor(...args) {
            const self = Super(this).constructor(...args)
            Private(self)._children = []
            return self
        },

        /**
         * @readonly
         */
        get parent() {
            return Private(this)._parent
        },

        /**
         * This is named "subnodes" to avoid conflict with HTML's Element.children
         * @readonly
         */
        get subnodes() {
            // return a new array, so that the user modifying it doesn't affect
            // this node's actual children.
            return [...Private(this)._children]
        },

        /**
         * Add a child node to this TreeNode.
         *
         * @param {TreeNode} childNode The child node to add.
         */
        add(childNode) {
            if (! isInstanceof(childNode, TreeNode))
                throw new TypeError('TreeNode.add() expects the childNode argument to be a TreeNode instance.')

            if (Private(childNode)._parent === this)
                throw new ReferenceError('childNode is already a child of this parent.')

            if (Private(childNode)._parent)
                Private(childNode)._parent.remove(childNode)

            Private(childNode)._parent = this;

            Private(this)._children.push(childNode);

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
            if (! isInstanceof(childNode, TreeNode))
                throw new Error(`
                    TreeNode.remove expects the childNode argument to be an
                    instance of TreeNode. There should only be TreeNodes in the
                    tree.
                `)

            if (Private(childNode)._parent !== this)
                throw new ReferenceError('childNode is not a child of this parent.')

            Private(childNode)._parent = null
            Private(this)._children.splice(Private(this)._children.indexOf(childNode), 1);

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
            this.removeChildren(Private(this)._children)
            return this
        },

        /**
         * @readonly
         * @return {number} How many children this TreeNode has.
         */
        get childCount() {
            return Private(this)._children.length
        },

        // generic life cycle methods
        connected() {},
        disconnected() {},
        childConnected(child) {},
        childDisconnected(child) {},
    }))

)
