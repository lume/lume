import TreeNode from './TreeNode'
import ElementManager from './ElementManager'
import Node from './Node'
import Scene from './Scene'

let ImperativeBase = undefined

// Here we wrap the definition of the ImperativeBase class with this function in
// order to solve the circular depdendency problem caused by the
// Node<->ImperativeBase and Scene<->ImperativeBase circles. The Node and Scene
// modules call initImperativeBase to ensure that the ImperativeBase declaration
// happens first, and then those modules can use the live binding in their
// declarations.
export function initImperativeBase() {

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
    let ImperativeBaseMixin = base =>
    class ImperativeBase extends TreeNode.mixin(base) {
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
            // TODO: move to DOMRenderer
            this._el = new ElementManager(
                _motorHtmlCounterpart || this._makeElement()
            )
            this._el.element._associateImperativeNode(this)

            this._mounted = false;

            this._scene = null // stores a ref to this Node's root Scene.

            // This is an internal promise that resolves when this Node is added to
            // to a scene graph that has a root Scene TreeNode. The resolved value
            // is the root Scene.
            // TODO: Move to Node, only Node needs scenePromise stuff.
            this._resolveScenePromise = null
            this._scenePromise = new Promise(r => this._resolveScenePromise = r)

            // Provide the user a promise that resolves when this Node is attached
            // to a tree that has a root Scene TreeNode *and* when that root Scene
            // has been mounted into the DOM (Note, the _scenePromise resolves only
            // when the first condition is true and the root Scene hasn't
            // necessarily been mounted).
            //
            // TODO: Maybe we should rename this to `.ready`, matching with the
            // HTML API. See motor-html/node createdCallback.
            this._resolveMountPromise = null
            this._mountPromise = new Promise(r => this._resolveMountPromise = r)

            this._waitForSceneThenResolveMountPromise()

            this._init()
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
         * Subclasses can override this to provide extra behavior when constructed.
         * The reason for it is because it is easy to override it and change the
         * order of execution between the overriden method and the super method,
         * unlike with constructors where `super()` must *always* be called before
         * using this.
         *
         * @private
         */
        _init() {}

        /**
         * @private
         * Get a promise for the node's eventual scene.
         * TODO: Move to Node, only Node needs scenePromise stuff.
         */
        _getScenePromise() {
            if (!this._scene && !this._scenePromise)
                this._scenePromise = new Promise(r => this._resolveScenePromise = r)

            return this._scenePromise
        }

        /**
         * @private
         */
        async _waitForSceneThenResolveMountPromise() {

            // TODO: this conditional check should work with child classes who's
            // constructor is no longer named "Node".
            // This should not fire for Scene or child classes of Scene because a
            // Scene's mountPromise is resolved when it is mounted with the
            // `Scene#mount` method.
            if (this instanceof Node) {
                await this._getScenePromise()
                await this._scene.mountPromise

                // TODO TODO: also wait for this._mounted so this.element is
                // actually mounted in the DOM? Maybe not, as that will be moved to
                // the DOMRenderer. Or possibly add that functionality in the HTML
                // API. Revisit later.
                this._resolveMountPromise(true)
            }

        }

        /**
         * @readonly
         */
        get mountPromise() {
            if (!this._mounted && !this._mountPromise) {
                this._mountPromise = new Promise(r => this._resolveMountPromise = r)
                this._waitForSceneThenResolveMountPromise() // This is a noop if `this` is a `Scene`.
            }

            return this._mountPromise
        }

        /**
         * @readonly
         * TODO: get from the DOMRenderer when that is implemented.
         */
        get element() {
            return this._el.element
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

            // if already cached, return it.
            if (this._scene) return this._scene

            // if the parent node already has a ref to the scene, use that.
            if (this._parent && this._parent._scene) {
                this._scene = this._parent._scene

                return this._scene
            }

            // otherwise call the scene getter on the parent, which triggers
            // traversal up the scene graph in order to find the root scene (null
            // if none).
            else {
                if (this._parent) this._scene = this._parent.scene

                return this._scene
            }
        }

        /**
         * @override
         */
        addChild(childNode) {

            // We cannot add Scenes to Nodes, for now.
            //
            // TODO: If someone extends Scene, constructor.name is different. We
            // need to catch those cases too, without using instanceof Scene in
            // order to avoid a circular dependency in this module.
            // Idea: maybe we can traverse the prototype chain looking for each
            // constructor.name.
            //
            // XXX: How will we handle mounting a Scene inside a Node when using only WebGL?
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

            // TODO move to DOMRenderer
            this._mountChildElement(childNode)

            return this
        }

        /**
         * @private
         * This method to be called only when this Node has this.scene.
         * Resolves the _scenePromise for all children of the tree of this Node.
         */
        _giveSceneRefToChildren() {
            for (let childNode of this._children) {
                childNode._scene = this._scene
                childNode._resolveScenePromise(childNode._scene)
                childNode._giveSceneRefToChildren();
            }
        }

        _mountChildElement(childNode) {
            // If Node's HTML element isn't mounted.. mount it.
            // TODO move to DOMRenderer
            if (! childNode._mounted) {
                if (childNode._parent) {

                    // TODO: camera
                    // Mount to parent if parent is a Node
                    // if (childNode._parent instanceof Node) {
                        if (childNode._el.element.parentNode !== childNode._parent._el.element) {
                            childNode._parent._el.element.appendChild(childNode._el.element);
                        }
                        childNode._mounted = true;

                    // Mount to camera if top level Node
                    // } else {
                    //   //scene.camera.element.appendChild(childNode._el);
                    //   childNode._mounted = true;
                    // }
                }
            }
        }

        removeChild(childNode) {
            super.removeChild(childNode)

            if (childNode instanceof ImperativeBase) {
                childNode._scene = null // not part of a scene anymore.
                childNode._scenePromise = null // reset so that it can be awaited again for when the node is re-mounted.
                childNode._mounted = false
                childNode._mountPromise = null // reset so that it can be awaited again for when the node is re-mounted.

                // TODO: move this out, into DOMRenderer
                this._detachElement(childNode)
            }
        }

        _detachElement(childNode) {
            // TODO: move this out, into DOMRenderer

            // XXX Only remove the childNode _el if it has an actual parent
            if (childNode._el.element.parentNode)
                childNode._el.element.parentNode.removeChild(childNode._el.element)
        }
    }

    ImperativeBase = ImperativeBaseMixin(class{})
    ImperativeBase.mixin = ImperativeBaseMixin

}

export {ImperativeBase as default}
