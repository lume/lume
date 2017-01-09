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

        /**
         * Creates a render task to update this Sizeable and re-render. Also passes the
         * updated size to children, so they can re-render as well, if needed.
         *
         * The HTML API MotorHTMLScene's size might change outside of an animation
         * frame, so that's why we need to create a render task.
         * @private
         *
         * @param {Object} size The new size of the scene, in the form {x:10, y:10}.
         *
         * XXX: We define this method here in order to keep `this` in context
         * without creating a new reference like we would when using
         * Function#bind when we pass this method as an event handler. The
         * downside of this is more memory usage since it is no longer located
         * on the prototype chain and a new method created for each instance.
         * TODO: Is there a better way?
         */
        this._onParentSizeChange = (newSize) => {

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

                || (this._properties.sizeMode.x === "proportional" && this._properties.mountPoint.x !== 0)
                || (this._properties.sizeMode.y === "proportional" && this._properties.mountPoint.y !== 0)
                || (this._properties.sizeMode.z === "proportional" && this._properties.mountPoint.z !== 0)
            ) {
                this._calcSize()
                this._needsToBeRendered()
            }
        }

        // TODO: We need to render one time each time mountPromise is resolved,
        // not just this one time in the constructor.
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
     *
     * @override see Transformable#override
     *
     * TODO If a setter is called over and over in a render task before the node
     * is mounted, then each tick will cause an await this.mountPromise, and
     * eventually all the bodies will fire all at once. I don't think we want
     * this to happen. However, it's harmless since the calls to
     * super._needsToBeRendered after the first call are basically no-ops when
     * the code path reaches Motor._setNodeToBeRendered. We need to evaluate
     * this a little more...
     */
    async _needsToBeRendered() {
        if (!this._mounted) {
            await this.mountPromise
        }
        super._needsToBeRendered()
    }
}

export {Node as default}
