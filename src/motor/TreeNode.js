import ImperativeBase from './ImperativeBase'

class TreeNode extends ImperativeBase {

    constructor() {
        super()

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
        let thisHasChild = this._children.indexOf(childNode) >= 0

        if (childNode instanceof TreeNode && thisHasChild) {
            childNode._parent = null
            childNode._scene = null // not part of a scene anymore.
            childNode._scenePromise = null // reset so that it can be awaited again for when the node is re-mounted.
            childNode._mounted = false
            childNode._mountPromise = null // reset so that it can be awaited again for when the node is re-mounted.

            // Remove from children array
            this._children.splice(this._children.indexOf(childNode), 1);

            this._detachElement(childNode)
        }

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
}

export {TreeNode as default}
