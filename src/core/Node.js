import Class from 'lowclass'
import Mixin from './Mixin'
import 'geometry-interfaces'
import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import { default as HTMLInterface } from '../html/HTMLNode'
import Scene from './Scene'
import {
    Object3D,
} from 'three'

const radiansPerDegree = 1 / 360 * 2*Math.PI

initImperativeBase()

let Node = Mixin(base =>

    Class('Node').extends( ImperativeBase.mixin( base ), ({ Super }) => ({
        static: {
            defaultElementName: 'i-node',
        },

        /**
         * @constructor
         *
         * @param {Object} options Initial properties that the node will
         * have. This can be used when creating a node, alternatively to using the
         * setters/getters for position, rotation, etc.
         *
         * @example
         * var node = new Node({
         *   size: {x:100, y:100, z:100},
         *   rotation: {x:30, y:20, z:25}
         * })
         */
        construct(options = {}) {
            Super(this).construct(options)

            // This was when using my `multiple()` implementation, we could call
            // specific constructors using specific arguments. But, we're using
            // class-factory style mixins for now, so we don't have control over the
            // specific arguments we can pass to the constructors, so we're just
            // using a single `options` parameter in all the constructors.
            //this.callSuperConstructor(Transformable, options)
            //this.callSuperConstructor(TreeNode)
            //this.callSuperConstructor(ImperativeBase)

            this._scene = null // stores a ref to this Node's root Scene.

            // This is an internal promise that resolves when this Node is added to
            // to a scene graph that has a root Scene TreeNode. The resolved value
            // is the root Scene.
            this._scenePromise = null
            this._resolveScenePromise = null

            /**
             * @private
             * This method is defined here in the consructor as an arrow function
             * because parent Nodes pass it to Observable#on and Observable#off. If
             * it were a prototype method, then it would need to be bound when
             * passed to Observable#on, which would require keeping track of the
             * bound function reference in order to be able to pass it to
             * Observable#off later. See ImperativeBase#add and
             * ImperativeBase#remove.
             */
            this._onParentSizeChange = () => {

                // We only need to recalculate sizing and matrices if this node has
                // properties that depend on parent sizing (proportional size,
                // align, and mountPoint). mountPoint isn't obvious: if this node
                // is proportionally sized, then the mountPoint will depend on the
                // size of this element which depends on the size of this element's
                // parent. Align also depends on parent sizing.
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
        },

        makeThreeObject3d() {
            return new Object3D
        },

        /**
         * @private
         */
        async _waitForMountThenResolveMountPromise() {
            if (this._awaitingScenePromise) return
            try {
                this._awaitingScenePromise = true
                await this._getScenePromise()
                await this._scene.mountPromise
            } catch (e) {
                if (e == 'mountcancel') return
                else throw e
            } finally {
                this._awaitingScenePromise = false
            }

            this._mounted = true
            this._resolveMountPromise()
            this._elementOperations.shouldRender()
        },

        /**
         * @private
         * Get a promise for the node's eventual scene.
         */
        _getScenePromise() {
            if (!this._scenePromise) {
                this._scenePromise = new Promise((a, b) => {
                    this._resolveScenePromise = a
                })
            }

            if (this._scene)
                this._resolveScenePromise()

            return this._scenePromise
        },

        /**
         * Get the Scene that this Node is in, null if no Scene. This is recursive
         * at first, then cached.
         *
         * This traverses up the scene graph tree starting at this Node and finds
         * the root Scene, if any. It caches the value for performance. If this
         * Node is removed from a parent node with parent.remove(), then the
         * cache is invalidated so the traversal can happen again when this Node is
         * eventually added to a new tree. This way, if the scene is cached on a
         * parent Node that we're adding this Node to then we can get that cached
         * value instead of traversing the tree.
         *
         * @readonly
         */
        get scene() {
            // NOTE: this._scene is initally null, created in the constructor.

            // if already cached, return it. Or if no parent, return it (it'll be null).
            if (this._scene || !this.parent) return this._scene

            // if the parent node already has a ref to the scene, use that.
            if (this.parent._scene) {
                this._scene = this.parent._scene
            }
            else if (this.parent instanceof Scene) {
                this._scene = this.parent
            }
            // otherwise call the scene getter on the parent, which triggers
            // traversal up the scene graph in order to find the root scene (null
            // if none).
            else {
                this._scene = this.parent.scene
            }

            return this._scene
        },

        /**
         * @private
         * This method to be called only when this Node has this.scene.
         * Resolves the _scenePromise for all children of the tree of this Node.
         */
        _giveSceneRefToChildren() {
            const children = this.subnodes;
            for (let i=0, l=children.length; i<l; i+=1) {
                const childNode = children[i]
                childNode._scene = this._scene
                if (childNode._resolveScenePromise)
                    childNode._resolveScenePromise(childNode._scene)
                childNode._giveSceneRefToChildren();
            }
        },

        _resetSceneRef() {
            this._scene = null
            this._scenePromise = null
            this._resolveScenePromise = null
            const children = this.subnodes;
            for (let i=0, l=children.length; i<l; i+=1) {
                children[i]._resetSceneRef();
            }
        },
    }))

)

// TODO for now, hard-mixin the HTMLInterface class. We'll do this automatically later.
Node = Node.mixin(HTMLInterface)

export {Node as default}
