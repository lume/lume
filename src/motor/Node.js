import 'geometry-interfaces'
import Transformable from './Transformable'
import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import MotorHTMLNode from '../motor-html/node'

initImperativeBase()

class Node extends ImperativeBase.mixin(Transformable) {

    /**
     * @constructor
     *
     * @param {Object} options Initial properties that the node will
     * have. This can be used when creating a node, alternatively to using the
     * setters/getters for position, rotation, etc.
     *
     * @example
     * var node = new Node({
     *   absoluteSize: {x:100, y:100, z:100},
     *   rotation: {x:30, y:20, z:25}
     * })
     */
    constructor (options = {}) {
        super(options)

        // This was when using my `multiple()` implementation, we could call
        // specific constructors using specific arguments. But, we're using
        // class-factory style mixins for now, so we don't have control over the
        // specific arguments we can pass to the constructors, so we're just
        // using a single `options` parameter in all the constructors.
        //this.callSuperConstructor(Transformable, options)
        //this.callSuperConstructor(TreeNode)
        //this.callSuperConstructor(ImperativeBase)

        this._waitingMountPromiseToRender = false

        /**
         * @private
         * This method is defined here in the consructor as an arrow function
         * because parent Nodes pass it to Observable#on and Observable#off. If
         * it were a prototype method, then it would need to be bound when
         * passed to Observable#on, which would require keeping track of the
         * bound function reference in order to be able to pass it to
         * Observable#off later. See ImperativeBase#addChild and
         * ImperativeBase#removeChild.
         */
        this._onParentSizeChange = () => {

            // We only need to recalculate sizing and matrices if this node has
            // properties that depend on parent sizing (proportional size,
            // align, and mountPoint). mountPoint isn't obvious: if this node
            // is proportionally sized, then the mountPoint will depend on the
            // size of this element which depends on the size of this element's
            // parent.
            if (
                this._properties.sizeMode.x === "proportional"
                || this._properties.sizeMode.y === "proportional"
                || this._properties.sizeMode.z === "proportional"

                || this._properties.align.x !== 0
                || this._properties.align.y !== 0
                || this._properties.align.z !== 0
            ) {
                this._calcSize()
                this._needsToBeRendered()
            }
        }

        this._calcSize()
        this._needsToBeRendered()
    }

    /**
     * @override
     */
    _makeElement() {
        return new MotorHTMLNode
    }

    /**
     * Trigger a re-render for this node (wait until mounted if not nounted
     * yet).
     */
    async _needsToBeRendered() {
        if (this._waitingMountPromiseToRender) return
        if (!this._mounted) {
            this._waitingMountPromiseToRender = true
            await this.mountPromise
            this._waitingMountPromiseToRender = false
        }
        super._needsToBeRendered()
    }

    _render(timestamp) {
        // applies the transform matrix to the element's style property.
        this._properties.transform = this._calculateMatrix()
        super._render(timestamp)
    }
}

export {Node as default}
