import {Class, Mixin, instanceOf} from 'lowclass'
import {Camera as ThreeCamera, Object3D} from 'three'
import ElementOperations from './ElementOperations'
import Transformable from './Transformable'
import Node from './Node'
import Scene from './Scene'
import Motor from './Motor'
import {CSS3DObjectNested} from '../lib/three/CSS3DRendererNested'
import {disposeObject} from '../utils/three'
import {Events} from './Events'

window.addEventListener('error', (event) => {
    const error = event.error
    if (/Illegal constructor/i.test(error.message)) {
        console.error(`
            One of the reasons the following error can happen is if a Custom
            Element is called with 'new' before being defined.
            For other reasons, see: https://www.google.com/search?q=chrome%20illegal%20constructor
        `)
    }
})

let three = null
let domPlane = null

// We explicitly use `var` instead of `let` here because it is hoisted for the
// Node and Scene modules. This, along with the following initImperativeBase
// function, allows the circular dependency between this module and the Node and
// Scene modules to work. For details on why, see
// https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem.
var ImperativeBase

// A "gateway" pattern is in play here, so that the Scene module is the only
// module that can get access to the ImperativeBaseProtected helper.
// https://esdiscuss.org/topic/share-a-secret-across-es6-specific-modules-so-that-other-modules-cannot-access-the-secret
export var ImperativeBaseProtected
var ImperativeBaseProtectedImportCount
export function getImperativeBaseProtectedHelper() {
    // note, ImperativeBaseProtectedImportCount can be initially undefined,
    // because it is hoisted above all modules
    ImperativeBaseProtectedImportCount = (ImperativeBaseProtectedImportCount || 0) + 1

    // this function should be called at most once, by the Scene module.
    if (ImperativeBaseProtectedImportCount > 1) {
        throw new Error('getImperativeBaseProtectedHelper should be called only once, by the Scene module')
    }

    return ImperativeBaseProtected
}

// Here we wrap the definition of the ImperativeBase class with this function in
// order to solve the circular depdendency problem caused by the
// Node<->ImperativeBase and Scene<->ImperativeBase circles. The Node and Scene
// modules call initImperativeBase to ensure that the ImperativeBase declaration
// happens first, and then those modules can use the live binding in their
// declarations.
initImperativeBase()
export function initImperativeBase() {
    if (ImperativeBase) return

    const ImperativeBaseBrand = {brand: 'ImperativeBase'}

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
    ImperativeBase = Mixin(Base =>

        Class('ImperativeBase').extends( Transformable.mixin( Base ), ({ Super, Public, Private, Protected }) => {

            // we leak the protected helper so that the Scene class can access
            // the protected members of all nodes in the tree, otherwise the
            // Scene's Protected helper does not allow access to sibling class
            // instance protected members. This is the same limitation as the
            // one designed in TypeScript or C#. See
            // https://github.com/Microsoft/TypeScript/issues/30756
            ImperativeBaseProtected = Protected

            return {

                constructor(options = {}) {
                    if (ImperativeBaseProtectedImportCount > 1) {
                        throw new Error('getImperativeBaseProtectedHelper should be called only once, by the Scene module')
                    }

                    const self = Super(this).constructor(options)

                    // we don't need this, keep for backward compatibility (mainly
                    // all my demos at trusktr.io).
                    self.imperativeCounterpart = self

                    self._willBeRendered = false

                    // Here we create the DOM HTMLElement associated with this
                    // Imperative-API Node.
                    self._elementOperations = new ElementOperations(self)

                    // stores a ref to this Node's root Scene when/if this Node is
                    // in a scene.
                    self._scene = null

                    // See Transformable/Sizeable propertychange event.
                    // TODO: defer size calculation to render task
                    self.on('propertychange', self._onPropertyChange, self)

                    return self
                },

                get glLoaded() {
                    return Protected(this)._glLoaded
                },

                get cssLoaded() {
                    return Protected(this)._cssLoaded
                },

                get three() {
                    // if (!(this.scene && this.scene.experimentalWebgl)) return null

                    if (!Private(this).__three) {
                        const three = Private(this).__three = this.makeThreeObject3d()
                        three.pivot = new THREE.Vector3
                    }

                    return Private(this).__three
                },

                get threeCSS() {
                    // if (!(this.scene && !this.scene.disableCss)) return null

                    if (!Private(this).__threeCSS) {
                        const threeCSS = Private(this).__threeCSS = this.makeThreeCSSObject()
                        threeCSS.pivot = new THREE.Vector3
                    }

                    return Private(this).__threeCSS
                },

                _onPropertyChange(prop) {
                    if ( prop == 'sizeMode' || prop == 'size' ) {
                        this._calcSize()
                    }

                    this._needsToBeRendered()
                },

                loadGL() {
                    if (!(this.scene && this.scene.experimentalWebgl)) return

                    if (Protected(this)._glLoaded) return
                    Protected(this)._glLoaded = true

                    // we don't let Three update local matrices automatically, we do
                    // it ourselves in Transformable._calculateMatrix and
                    // Transformable._calculateWorldMatricesInSubtree
                    this.three.matrixAutoUpdate = false

                    // NOTE, this.parent works here because loadGL is called by
                    // childConnectedCallback at which point a child is already
                    // upgraded and thus has this.parent API ready.
                    this.parent && this.parent.three.add(this.three)

                    // If a subclass needs to initialize values in its Three.js
                    // object, it will have the passInitialValuesToThree method for
                    // that.
                    //
                    // TODO we shouldn't need to define passInitialValuesToThree in
                    // sub classes, the default values of the props should
                    // automatically be in place.
                    this.passInitialValuesToThree && this.passInitialValuesToThree()

                    this._needsToBeRendered()
                },

                unloadGL() {
                    if (!Protected(this)._glLoaded) return
                    Protected(this)._glLoaded = false

                    disposeObject(Private(this).__three)
                    Private(this).__three = null

                    this._needsToBeRendered()
                },

                makeThreeObject3d() {
                    return new Object3D
                },

                loadCSS() {
                    if (!(this.scene && !this.scene.disableCss)) return

                    if (Protected(this)._cssLoaded) return
                    Protected(this)._cssLoaded = true

                    // we don't let Three update local matrices automatically, we do
                    // it ourselves in Transformable._calculateMatrix and
                    // Transformable._calculateWorldMatricesInSubtree
                    this.threeCSS.matrixAutoUpdate = false

                    // NOTE, this.parent works here because loadCSS is called by
                    // childConnectedCallback at which point a child is already
                    // upgraded and thus has this.parent API ready.
                    this.parent && this.parent.threeCSS.add(this.threeCSS)

                    this._needsToBeRendered()
                },

                unloadCSS() {
                    if (!Protected(this)._cssLoaded) return
                    Protected(this)._cssLoaded = false

                    disposeObject(Private(this).__threeCSS)
                    Private(this).__threeCSS = null

                    this._needsToBeRendered()
                },

                makeThreeCSSObject() {
                    return new CSS3DObjectNested(this)
                },

                childConnectedCallback(child) {
                    Super(this).childConnectedCallback(child)

                    // children can be non-lib DOM nodes (f.e. div, h1, etc)
                    if (instanceOf(child, Node)) {
                        Protected(child)._loadGL()
                        Protected(child)._loadCSS()
                    }
                },

                childDisconnectedCallback(child) {
                    Super(this).childDisconnectedCallback(child)

                    // children can be non-lib DOM nodes (f.e. div, h1, etc)
                    if (instanceOf(child, Node)) {
                        Protected(child)._unloadGL()
                        Protected(child)._unloadCSS()
                    }
                },

                /**
                 * Subclasses are required to override this. It should return the HTML-API
                 * counterpart for this Imperative-API instance. See Node or Scene classes
                 * for example.
                 *
                 * @private
                 */
                _makeElement() {
                    throw new Error('Subclasses need to override ImperativeBase#_makeElement.')
                },

                /**
                 * Get the Scene that this Node is in, null if no Scene. This traverses up recursively
                 * at first, then the value is cached.
                 *
                 * @readonly
                 */
                get scene() {
                    // NOTE: this._scene is initally null, created in the constructor.

                    // if already cached, return it. Or if no parent, return it (it'll be null).
                    // Additionally, Scenes have this._scene already set to themselves.
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
                 * @override
                 */
                add(childNode) {
                    if (!instanceOf(childNode, ImperativeBase)) return

                    // We cannot add Scenes to Nodes, for now.
                    if (childNode instanceof Scene) {
                        throw new Error(`
                            A Scene cannot be added to another Node or Scene (at
                            least for now). To place a Scene in a Node, just mount
                            a new Scene onto a MotorHTMLNode with Scene.mount().
                        `)
                    }

                    Super(this).add(childNode)

                    // Calculate sizing because proportional size might depend on
                    // the new parent.
                    childNode._calcSize()
                    childNode._needsToBeRendered()

                    // child should watch the parent for size changes.
                    this.on('sizechange', childNode._onParentSizeChange)

                    this._elementOperations.connectChildElement(childNode)

                    return this
                },

                remove(childNode, /* private */__leaveInDom) {
                    if (!(childNode instanceof Node)) return

                    Super(this).remove(childNode)

                    this.off('sizechange', childNode._onParentSizeChange)

                    if (!__leaveInDom)
                        this._elementOperations.disconnectChildElement(childNode)
                },

                _needsToBeRendered() {
                    // we don't need to render until we're connected into a tree with a scene.
                    if (!this.scene || !this.isConnected) return
                    // TODO make sure we render when connected into a tree with a scene

                    this._willBeRendered = true
                    Motor.setNodeToBeRendered(this)
                },

                // This method is used by Motor._renderNodes().
                _getNearestAncestorThatShouldBeRendered() {
                    let parent = this.parent

                    while (parent) {
                        if (parent._willBeRendered) return parent
                        parent = parent.parent
                    }

                    return false
                },

                _render(timestamp) {
                    if ( Super(this)._render ) Super(this)._render()

                    this._elementOperations.applyImperativeNodeProperties(this)
                },

                // TODO make a classes prop?
                // set properties(properties = {}) {
                //     Super(this).properties = properties
                //
                //     if (properties.classes)
                //         this._elementOperations.setClasses(...properties.classes);
                // },

                private: {
                    __three: null,
                    __threeCSS: null,
                },

                protected: {
                    _glLoaded: false,
                    _cssLoaded: false,

                    _loadGL() {
                        Public(this).loadGL()
                        Public(this).emit(Events.BEHAVIOR_GL_LOAD, Public(this))
                        Promise.resolve().then(() => {
                            Public(this).emit(Events.GL_LOAD, Public(this))
                        })
                    },

                    _unloadGL() {
                        Public(this).unloadGL()
                        Public(this).emit(Events.BEHAVIOR_GL_UNLOAD, Public(this))
                        Promise.resolve().then(() => {
                            Public(this).emit(Events.GL_UNLOAD, Public(this))
                        })
                    },

                    _loadCSS() {
                        Public(this).loadCSS()
                        Public(this).emit(Events.CSS_LOAD, Public(this))
                    },

                    _unloadCSS() {
                        Public(this).unloadCSS()
                        Public(this).emit(Events.CSS_UNLOAD, Public(this))
                    },
                }

            }
        }, ImperativeBaseBrand)

    )

}

export {ImperativeBase as default}
