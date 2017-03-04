import ElementManager from './ElementManager'
import Node from './Node'
import Scene from './Scene'
import Motor from './Motor'

// We explicitly use `var` instead of `let` here because it is hoisted for the
// Node and Scene modules. This, along with the following initImperativeBase
// function, allows the circular dependency between this module and the Node and
// Scene modules to work. For details on why, see
// https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem.
var ImperativeBase

// Here we wrap the definition of the ImperativeBase class with this function in
// order to solve the circular depdendency problem caused by the
// Node<->ImperativeBase and Scene<->ImperativeBase circles. The Node and Scene
// modules call initImperativeBase to ensure that the ImperativeBase declaration
// happens first, and then those modules can use the live binding in their
// declarations.
initImperativeBase()
export function initImperativeBase() {
    if (ImperativeBase) return

    const instanceofSymbol = Symbol('instanceofSymbol')

    /**
     * The ImperativeBase class is the base class for the Imperative version of the
     * API, for people who chose to take the all-JavaScript approach and who will
     * not use the HTML-based API (infamous/motor-html).
     *
     * In the future when there is an option to disable the HTML-DOM rendering (and
     * render only WebGL, for example) then the imperative API will be the only API
     * available since the HTML API will be turned off as a result of disabling
     * HTML rendering. Disabling both WebGL and HTML won't make sense, as we'll need
     * at least one of those to render with.
     */
    const ImperativeBaseMixin = base => {
        class ImperativeBase extends base {
            constructor(options = {}) {

                // The presence of a _motorHtmlCounterpart argument signifies that
                // the HTML interface is being used, otherwise the imperative interface
                // here is being used. For example, see MotorHTMLNode. This means the
                // Node and MotorHTMLNode classes are coupled together, but it's in the
                // name of the API that we're supporting.
                const {_motorHtmlCounterpart} = options

                super(options)

                // Here we create the DOM HTMLElement associated with this
                // Imperative-API Node.
                this._elementManager = new ElementManager(
                    _motorHtmlCounterpart || this._makeElement()
                )
                this._elementManager.element._associateImperativeNode(this)

                // True when this Node is added to a parent AND it has
                // an anancestor Scene that is mounted into DOM.
                this._mounted = false;

                this._scene = null // stores a ref to this Node's root Scene.

                // This is an internal promise that resolves when this Node is added to
                // to a scene graph that has a root Scene TreeNode. The resolved value
                // is the root Scene.
                this._resolveScenePromise = null
                this._scenePromise = new Promise(r => this._resolveScenePromise = r)

                // A promise that resolves when this Node is attached
                // to a tree that has a root Scene TreeNode *and* when that root Scene
                // has been mounted into the DOM (Note, the _scenePromise resolves only
                // when the first condition is true and the root Scene hasn't
                // necessarily been mounted).
                this._mountPromise = null
                this._resolveMountPromise = null
                this._rejectMountPromise = null

                this._awaitingMountPromiseToRender = false
                this._waitingForMountConditions = false

                // See Transformable/Sizeable propertychange event.
                this.on('propertychange', prop => {
                    if (
                        prop == 'sizeMode' ||
                        prop == 'absoluteSize' ||
                        prop == 'proportionalSize'
                    ) {
                        this._calcSize()
                    }

                    this._needsToBeRendered()
                })
            }

            /**
             * Subclasses are required to override this. It should return the HTML-API
             * counterpart for this Imperative-API instance. See Node or Scene classes
             * for example.
             *
             * @private
             */
            _makeElement() {
                throw new Error('Subclasses need to override ImperativeBase#_makeElement.')
            }

            /**
             * @private
             * Get a promise for the node's eventual scene.
             */
            _getScenePromise() {
                if (!this._scene && !this._scenePromise)
                    this._scenePromise = new Promise(r => this._resolveScenePromise = r)

                return this._scenePromise
            }

            /**
             * @readonly
             */
            get mountPromise() {
                if (!this._mountPromise) {
                    this._mountPromise = new Promise((a, b) => {
                        this._resolveMountPromise = a
                        this._rejectMountPromise = b
                    })
                }

                if (!this._mounted)
                    this._waitForMountThenResolveMountPromise()
                else if (this._mounted)
                    this._resolveMountPromise()

                return this._mountPromise
            }

            _waitForMountThenResolveMountPromise() {
                // extended in Node or Scene to await for anything that mount
                // depends on.
            }

            /**
             * @readonly
             */
            get element() {
                return this._elementManager.element
            }

            /**
             * Get the Scene that this Node is in, null if no Scene. This is recursive
             * at first, then cached.
             *
             * This traverses up the scene graph tree starting at this Node and finds
             * the root Scene, if any. It caches the value for performance. If this
             * Node is removed from a parent node with parent.removeChild(), then the
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
                if (this._scene || !this._parent) return this._scene

                // if the parent node already has a ref to the scene, use that.
                if (this._parent._scene) {
                    this._scene = this._parent._scene
                }
                else if (this._parent instanceof Scene) {
                    this._scene = this._parent
                }
                // otherwise call the scene getter on the parent, which triggers
                // traversal up the scene graph in order to find the root scene (null
                // if none).
                else {
                    this._scene = this._parent.scene
                }

                return this._scene
            }

            /**
             * @override
             */
            addChild(childNode) {
                if (!(childNode instanceof ImperativeBase)) return

                // We cannot add Scenes to Nodes, for now.
                if (childNode instanceof Scene) {
                    throw new Error(`
                        A Scene cannot be added to another Node (at least for now). To
                        place a Scene in a Node, just mount a new Scene onto a
                        MotorHTMLNode with Scene.mount().
                    `)
                }

                super.addChild(childNode)

                // Pass this parent node's Scene reference (if any, checking this cache
                // first) to the new child and the child's children.
                //
                // NOTE: Order is important: this needs to happen after previous stuff
                // in this method, so that the childNode.scene getter works.
                if (childNode._scene || childNode.scene) {
                    childNode._resolveScenePromise(childNode._scene)
                    childNode._giveSceneRefToChildren()
                }

                // Calculate sizing because proportional size might depend on
                // the new parent.
                childNode._calcSize()
                childNode._needsToBeRendered()

                // child should watch the parent for size changes.
                this.on('sizechange', childNode._onParentSizeChange)

                this._elementManager.connectChildElement(childNode)

                return this
            }

            /**
             * @private
             * This method to be called only when this Node has this.scene.
             * Resolves the _scenePromise for all children of the tree of this Node.
             */
            _giveSceneRefToChildren() {
                for (const childNode of this._children) {
                    childNode._scene = this._scene
                    childNode._resolveScenePromise(childNode._scene)
                    childNode._giveSceneRefToChildren();
                }
            }

            removeChild(childNode) {
                if (!(childNode instanceof Node)) return

                super.removeChild(childNode)

                this.off('sizechange', childNode._onParentSizeChange)

                childNode._scene = null
                childNode._scenePromise = null
                if (childNode._mountPromise) childNode._rejectMountPromise('mountcancel')
                childNode._mounted = false
                childNode._resolveMountPromise = null
                childNode._rejectMountPromise = null
                childNode._mountPromise = null

                this._elementManager.disconnectChildElement(childNode)
            }

            /**
             * Set all properties of an ImperativeBase instance in one method.
             *
             * @param {Object} properties Properties object - see example.
             *
             * @example
             * node.properties = {
             *   classes: ['open', 'big'],
             * }
             */
            set properties (properties = {}) {
                super.properties = properties

                if (properties.classes)
                    this._elementManager.setClasses(...properties.classes);
            }

            async _needsToBeRendered() {
                if (this._awaitingMountPromiseToRender) return

                if (!this._mounted) {
                    try {
                        this._awaitingMountPromiseToRender = true
                        await this.mountPromise
                    } catch(e) {
                        if (e == 'mountcancel') return
                        else throw e
                    } finally {
                        this._awaitingMountPromiseToRender = false
                    }
                }

                Motor._setNodeToBeRendered(this)
            }

            _render(timestamp) {
                this._elementManager.applyImperativeNodeProperties(this)
            }
        }

        Object.defineProperty(ImperativeBase, Symbol.hasInstance, {
            value: function(obj) {
                if (this !== ImperativeBase) return Object.getPrototypeOf(ImperativeBase)[Symbol.hasInstance].call(this, obj)

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

        ImperativeBase[instanceofSymbol] = true

        return ImperativeBase
    }

    ImperativeBase = ImperativeBaseMixin(class{})
    ImperativeBase.mixin = ImperativeBaseMixin

}

export {ImperativeBase as default}
