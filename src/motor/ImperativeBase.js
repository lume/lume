import TreeNode from './TreeNode'
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

    let instanceofSymbol = Symbol('instanceofSymbol')

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
    let ImperativeBaseMixin = base => {
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

                // This should not fire for Scene or child classes of Scene because a
                // Scene's mountPromise is resolved when it is mounted with the
                // `Scene#mount` method.
                if (!(this instanceof Node)) return

                await this._getScenePromise()
                await this._scene.mountPromise

                // TODO TODO: also wait for this._mounted so this.element is
                // actually mounted in the DOM? Maybe not, as that will be moved to
                // the DOMRenderer. Or possibly add that functionality in the HTML
                // API. Revisit later.
                this._resolveMountPromise(true)
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
                if (!(childNode instanceof ImperativeBase)) return

                // We cannot add Scenes to Nodes, for now.
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

                // Calculate sizing because proportional size might depend on
                // the new parent.
                // TODO delegate to animation frame?
                childNode._calcSize()
                childNode._needsToBeRendered()

                // child should watch the parent for size changes.
                this.on('sizechange', childNode._onParentSizeChange)

                // If child Node's HTML element isn't mounted.. mount it.
                // TODO move to DOMRenderer
                // TODO delegate to animation frame?
                if (!childNode._mounted && childNode._parent) {
                    this._appendChildElement(childNode)
                    childNode._mounted = true;
                }

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

            _appendChildElement(childNode) {

                // TODO: camera
                // Mount to parent if parent is a Node
                // if (childNode._parent instanceof Node) {

                    if (

                        // When using the imperative API, this statement is
                        // true, so the DOM elements need to be connected.
                        !childNode._el.element.parentNode

                        // This condition is irrelevant when strictly using the
                        // imperative API. However, it is possible that when
                        // usingthe HTML API that the HTML-API node can be placed
                        // somewhere that isn't another HTML-API node, and the
                        // imperative Node can be gotten and used to add the
                        // node to another imperative Node. In this case, the
                        // HTML-API node will be added to the proper HTMLparent.
                        || (childNode._el.element.parentElement && childNode._el.element.parentElement !== childNode._parent._el.element)

                        // When an HTML-API node is already child of the
                        // relevant parent, or it is child of a shadow root of
                        // the relevant parent, there there's nothing to do,
                        // everything is already as expected, so the following
                        // conditional body is skipped.
                    ) {
                        childNode._parent._el.element.appendChild(childNode._el.element);
                    }

                // Mount to camera if top level Node
                // } else {
                //   //scene.camera.element.appendChild(childNode._el);
                //   childNode._mounted = true;
                // }
            }

            removeChild(childNode) {
                if (!(childNode instanceof ImperativeBase)) return

                super.removeChild(childNode)

                // childNode no longer needs to observe parent for size changes.
                this.off('sizechange', childNode._onParentSizeChange)

                childNode._scene = null // not part of a scene anymore.
                childNode._scenePromise = null // reset so that it can be awaited again for when the node is re-mounted.
                childNode._mounted = false
                childNode._mountPromise = null // reset so that it can be awaited again for when the node is re-mounted.

                // TODO: move this out, into DOMRenderer
                this._detachElement(childNode)
            }

            _detachElement(childNode) {
                // TODO: move this out, into DOMRenderer

                // XXX Only remove the childNode _el if it has an actual parent
                if (childNode._el.element.parentNode)
                    childNode._el.element.parentNode.removeChild(childNode._el.element)
            }

            _needsToBeRendered() {
                Motor._setNodeToBeRendered(this)

                // TODO: Move this logic into Motor (probably to the _setNodeToBeRendered method).
                if (!Motor._inFrame) Motor._startAnimationLoop()
            }

            // TODO Where does _render belong? Probably in the DOMRenderer?
            // TODO: rename to _update? it's not really rendering, it's updating
            // the transform, then the HTML engine renders the DOM elements, and
            // the WebGL renderer will render the meshes.
            _render(timestamp) {
                // Only Node is Transformable, so
                if (this instanceof Node) {
                    // applies the transform matrix to the element's style property.
                    // TODO: We shouldn't need to re-calculate the whole matrix every render?
                    this._setMatrix3d(this._calculateMatrix())

                    // TODO move to DOMRenderer
                    this._applyOpacityToElement()
                }

                // Both Node and Scene are Sizeable
                // TODO move to DOMRenderer
                this._applySizeToElement()

                return this
            }

            /**
             * [setMatrix3d description]
             *
             * @private
             * @param {DOMMatrix} matrix A DOMMatrix instance to set as this node's
             * transform. See "W3C Geometry Interfaces".
             */
            _setMatrix3d (matrix) {
                this._properties.transform = matrix
                // ^ TODO PERFORMANCE: What's faster? Setting a new DOMMatrix (as we do here
                // currently, the result of _calculateMatrix) or applying all
                // transform values to the existing DOMMatrix?

                this._applyTransform();
            }

            /**
             * Apply the DOMMatrix value to the style of this Node's element.
             *
             * @private
             *
             * TODO We'll eventually apply the DOMMatrix directly instead of
             * converting to a string here.
             *
             * TODO move to DOMRenderer
             *
             * TODO: Maybe this should not apply style directly, it should be batched
             * into Motor._nodesToBeRendered, and same for other styles.
             */
            _applyTransform () {
                var matrix = this._properties.transform;

                // XXX: is this in the right order? UPDATE: It is.
                // TODO: Apply DOMMatrix directly to the Element once browser APIs
                // support it. Maybe we can polyfill this?
                var cssMatrixString = `matrix3d(
                    ${ matrix.m11 },
                    ${ matrix.m12 },
                    ${ matrix.m13 },
                    ${ matrix.m14 },
                    ${ matrix.m21 },
                    ${ matrix.m22 },
                    ${ matrix.m23 },
                    ${ matrix.m24 },
                    ${ matrix.m31 },
                    ${ matrix.m32 },
                    ${ matrix.m33 },
                    ${ matrix.m34 },
                    ${ matrix.m41 },
                    ${ matrix.m42 },
                    ${ matrix.m43 },
                    ${ matrix.m44 }
                )`;

                this._applyStyleToElement('transform', cssMatrixString);
            }

            /**
             * [applySize description]
             *
             * @method
             * @private
             * @memberOf Node
             *
             * TODO: move to DOMRenderer
             */
            _applySizeToElement () {
                const {x,y} = this._calculatedSize

                this._applyStyleToElement('width', `${x}px`)
                this._applyStyleToElement('height', `${y}px`)

                // XXX: we ignore the Z axis on elements, since they are flat.
            }

            /**
             * Apply a style property to this node's element.
             *
             * TODO: move into DOMRenderer.
             *
             * @private
             * @param  {string} property The CSS property we will a apply.
             * @param  {string} value    The value the CSS property wil have.
             */
            _applyStyleToElement (property, value) {
                this._el.element.style[property] = value;
            }

            /**
             * @private
             *
             * TODO: move into DOMRenderer.
             */
            _applyOpacityToElement() {
                this._applyStyleToElement('opacity', this._properties.opacity);
            }
        }

        Object.defineProperty(ImperativeBase, Symbol.hasInstance, {
            value: function(obj) {
                if (this !== ImperativeBase) return Object.getPrototypeOf(ImperativeBase)[Symbol.hasInstance].call(this, obj)

                let currentProto = obj

                while(currentProto) {
                    let desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

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
