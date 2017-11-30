import {isInstanceof} from './Utility'

const instanceofSymbol = Symbol('instanceofSymbol')

const TreeNodeMixin = base => {
    class TreeNode extends base {

        construct(...args) {
            super.construct(...args)
            this._parent = null // default to no parent.
            this._children = [];
        }

        /**
         * this._parent is protected (node's can access other node._parent).
         * The user should use the add() method, which automatically handles
         * setting a parent.
         *
         * @readonly
         */
        get parent() {
            return this._parent
        }

        /**
         * @readonly
         */
        get children() {
            // return a new array, so that the user modifying it doesn't affect
            // this node's actual children.
            return [...this._children]
        }

        /**
         * Add a child node to this TreeNode.
         *
         * @param {TreeNode} childNode The child node to add.
         */
        add(childNode) {
            if (! isInstanceof(childNode, TreeNode))
                throw new TypeError('TreeNode.add() expects the childNode argument to be a TreeNode instance.')

            if (childNode._parent === this)
                throw new ReferenceError('childNode is already a child of this parent.')

            if (childNode._parent)
                childNode._parent.remove(childNode)

            childNode._parent = this;

            this._children.push(childNode);

            Promise.resolve().then(() => {
                childNode.connected()
                this.childConnected(childNode)
            })

            return this
        }

        /**
         * Add all the child nodes in the given array to this node.
         *
         * @param {Array.TreeNode} nodes The nodes to add.
         */
        addChildren(nodes) {
            nodes.forEach(node => this.add()(node))
            return this
        }

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

            if (childNode._parent !== this)
                throw new ReferenceError('childNode is not a child of this parent.')

            childNode._parent = null
            this._children.splice(this._children.indexOf(childNode), 1);

            Promise.resolve().then(() => {
                childNode.disconnected()
                this.childDisconnected(childNode)
            })

            return this
        }

        /**
         * Remove all the child nodes in the given array from this node.
         *
         * @param {Array.TreeNode} nodes The nodes to remove.
         */
        removeChildren(nodes) {
            nodes.forEach(node => this.remove(node))
            return this
        }

        /**
         * Shortcut to remove all children.
         */
        removeAllChildren() {
            this.removeChildren(this._children)
            return this
        }

        /**
         * @readonly
         * @return {number} How many children this TreeNode has.
         */
        get childCount() {
            return this._children.length
        }

        // generic life cycle methods
        connected() {}
        disconnected() {}
        childConnected(child) {}
        childDisconnected(child) {}
        propertyChanged() {}
    }

    Object.defineProperty(TreeNode, Symbol.hasInstance, {
        value: function(obj) {
            if (this !== TreeNode) return Object.getPrototypeOf(TreeNode)[Symbol.hasInstance].call(this, obj)

            let currentProto = obj

            while(currentProto) {
                const desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                if (desc && desc.value && desc.value.hasOwnProperty(instanceofSymbol))
                    return true

                currentProto = Object.getPrototypeOf(currentProto)
            }

            return false
        }
    })

    TreeNode[instanceofSymbol] = true

    return TreeNode
}

const TreeNode = TreeNodeMixin(class{})
TreeNode.mixin = TreeNodeMixin

export {TreeNode as default}
