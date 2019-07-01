import {Mixin} from 'lowclass'
import WithUpdate from '../html/WithUpdate'
import {Constructor} from './Utility'
// import TreeNode from './TreeNode'

// function TreeNodeMixin<T extends Constructor>(Base: T) {
export function TreeNodeMixin<T extends Constructor>(Base: T) {
    // TODO WithUpdate.mixin isn't enforcing that we pass Constructor
    // constrained to extend from HTMLElement
    class TreeNode extends WithUpdate.mixin(Constructor<HTMLElement>(Base)) {
        private __parent: TreeNode | null = null
        private __children: TreeNode[] = []

        /**
         * @readonly
         */
        get parent() {
            return this.__parent
        }

        /**
         * This is named "subnodes" to avoid conflict with HTML's Element.children
         * @readonly
         */
        get subnodes() {
            // return a new array, so that the user modifying it doesn't affect
            // this node's actual children.
            return [...this.__children]
        }

        /**
         * Add a child node to this TreeNode.
         *
         * @param {TreeNode} childNode The child node to add.
         */
        add(childNode: TreeNode): this {
            if (!(childNode instanceof TreeNode))
                throw new TypeError('TreeNode.add() expects the childNode argument to be a TreeNode instance.')

            if (childNode.__parent === this) throw new ReferenceError('childNode is already a child of this parent.')

            if (childNode.__parent) childNode.__parent.removeNode(childNode)

            childNode.__parent = this

            this.__children.push(childNode)

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
        addChildren(nodes: TreeNode[]) {
            nodes.forEach(node => this.add(node))
            return this
        }

        /**
         * Remove a child node from this node.
         *
         * @param {TreeNode} childNode The node to remove.
         */
        removeNode(childNode: TreeNode): this {
            if (!(childNode instanceof TreeNode)) {
                throw new Error(`
                    TreeNode.remove expects the childNode argument to be an
                    instance of TreeNode. There should only be TreeNodes in the
                    tree.
                `)
            }

            if (childNode.__parent !== this) throw new ReferenceError('childNode is not a child of this parent.')

            childNode.__parent = null
            this.__children.splice(this.__children.indexOf(childNode), 1)

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
        removeChildren(nodes: TreeNode[]) {
            for (let i = nodes.length - 1; i >= 0; i -= 1) {
                this.removeNode(nodes[i])
            }
            return this
        }

        /**
         * Shortcut to remove all children.
         */
        removeAllChildren() {
            if (!this.__children.length) throw new ReferenceError('This node has no children.')
            this.removeChildren(this.__children)
            return this
        }

        /**
         * How many children this TreeNode has.
         * @readonly
         */
        get childCount() {
            return this.__children.length
        }

        // generic life cycle methods
        connected() {}
        disconnected() {}
        childConnected(_child: TreeNode) {}
        childDisconnected(_child: TreeNode) {}

        // traverse the tree at this node
        traverse(fn: (n: TreeNode) => void) {
            fn(this)

            const children = this.__children
            for (let i = 0, l = children.length; i < l; i++) {
                children[i].traverse(fn)
            }
        }
    }

    // return TreeNode as typeof TreeNode & Omit<typeof WithUpdate, 'mixin'> & T
    // return TreeNode as typeof TreeNode & typeof WithUpdate & T
    return TreeNode as typeof TreeNode & T
}

export const TreeNode = Mixin(TreeNodeMixin)
export type TreeNode = InstanceType<typeof TreeNode>
export default TreeNode

// const t: TreeNode = new TreeNode()
// t.asdfasdf
// t.asdfasdfadfasdf()
// t.childCount
// t.removeNode()
// t.removeNode(new TreeNode())
// t.innerHTML = 123
// t.innerHTML = 'asdf'
// t.setAttribute('foo', 123)
// t.setAttribute('foo', 'bar')
