let instanceofSymbol = Symbol('instanceofSymbol')

const TreeNodeMixin = base => {
    class TreeNode extends base {

        constructor(options) {
            super(options)
            this._parent = null // default to no parent.
            this._children = [];
        }

        /**
         * this._parent is protected (node's can access other node._parent).
         * The user should use the addChild methods, which automatically handles
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
        addChild (childNode) {

            // TODO: make sure instanceof works using Symbol.hasInstance
            if (! (childNode instanceof TreeNode))
                throw new Error('TreeNode.addChild expects the childNode argument to be a TreeNode instance.')

            // Do nothing if the child TreeNode is already added to this TreeNode.
            //
            // After adding a TreeNode to a parent using this imperative API, the
            // MotorHTMLNode ends up calling addChild on this TreeNode's parent a second time
            // in the element's attachedCallback, but the code stops at this line (which is
            // good).
            //
            // TODO TODO: prevent the second call altogether.
            if (childNode._parent === this) return

            if (childNode._parent)
                childNode._parent.removeChild(childNode)

            // Add parent
            childNode._parent = this;

            // Add to children array
            this._children.push(childNode);

            return this
        }

        /**
         * Add all the child nodes in the given array to this node.
         *
         * @param {Array.TreeNode} nodes The nodes to add.
         */
        addChildren(nodes) {
            nodes.forEach(node => this.addChild(node))
            return this
        }

        /**
         * Remove a child node from this node. Silently fails if the node doesn't
         * exist, etc.
         *
         * XXX Should this be silent? Or should we throw?
         *
         * @param {TreeNode} childNode The node to remove.
         */
        removeChild(childNode) {
            // TODO: make sure instanceof works using Symbol.hasInstance
            if (! (childNode instanceof TreeNode)) return this

            let thisHasChild = this._children.indexOf(childNode) >= 0
            if (! thisHasChild) return this

            childNode._parent = null
            this._children.splice(this._children.indexOf(childNode), 1);

            return this
        }

        /**
         * Remove all the child nodes in the given array from this node.
         *
         * @param {Array.TreeNode} nodes The nodes to remove.
         */
        removeChildren(nodes) {
            nodes.forEach(node => this.removeChild(node))
            return this
        }

        /**
         * @readonly
         * @return {number} How many children this TreeNode has.
         */
        get childCount() {
            return this._children.length
        }

        static [Symbol.hasInstance](obj) {
            if (this !== TreeNode) return super[Symbol.hasInstance](obj)

            let currentProto = obj

            while(currentProto) {
                let desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                if (desc && desc.value && desc.value.hasOwnProperty(instanceofSymbol))
                    return true

                currentProto = Object.getPrototypeOf(currentProto)
            }

            return false
        }
    }

    TreeNode[instanceofSymbol] = true

    return TreeNode
}

const TreeNode = TreeNodeMixin(class{})
TreeNode.mixin = TreeNodeMixin

export {TreeNode as default}
