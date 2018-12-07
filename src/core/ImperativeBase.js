import Class from 'lowclass'
import {Camera as ThreeCamera} from 'three'
import Mixin from './Mixin'
import ElementOperations from './ElementOperations'
import Transformable from './Transformable'
import Node from './Node'
import Scene from './Scene'
import Motor from './Motor'
import {isInstanceof} from './Utility'

let threeObject3d = null
let domPlane = null

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

        Class('ImperativeBase').extends( Transformable.mixin( Base ), ({ Super }) => ({
            constructor(options = {}) {
                const self = Super(this).constructor(options)

                self._lastKnownParent = null

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

                if (!(self instanceof Scene)) self.initWebGl()

                return self
            },

            connectedCallback() {
                Super(this).connectedCallback()

                // If a subclass needs to initialize values in its Three.js
                // object, it will have the passInitialValuesToThree method for
                // that.
                //
                // TODO we shouldn't need to define passInitialValuesToThree in
                // sub classes, the default values of the props should
                // automatically be in place.
                this.passInitialValuesToThree && this.passInitialValuesToThree()
            },

            _onPropertyChange(prop) {
                if ( prop == 'sizeMode' || prop == 'size' ) {
                    this._calcSize()
                }

                this._needsToBeRendered()
            },

            initWebGl() {
                this.threeObject3d = this.makeThreeObject3d()

                // we don't let Three update local matrices, we provide world
                // matrices ourselves.
                this.threeObject3d.matrixAutoUpdate = false
            },

            disposeWebGL() {
                console.log( 'TODO: dispose WebGL when it is no longer needed' )
            },

            makeThreeObject3d() {
                throw new Error('The makeThreeObject3d method should be defined by sub classes.')
            },

            // TODO use one of init/deinit, or connected/connected, or
            // connectedCallback/disconnectedCallback, instead of being
            // inconsistent across classes, so we can better understand order of
            // operations more easily.
            connected() {
                this._lastKnownParent = this.parent
                this.parent.threeObject3d.add(this.threeObject3d)
                this.on('worldMatrixUpdate', this._onWorldMatrixUpdate, this)
            },
            disconnected() {
                this._lastKnownParent.threeObject3d.remove(this.threeObject3d)
                this.off('worldMatrixUpdate', this._onWorldMatrixUpdate)
            },

            _onWorldMatrixUpdate() {
                threeObject3d = this.threeObject3d
                domPlane = this.threeDOMPlane

                // Three Matrix4#elements is in the same major order as our
                // DOMMatrix#_matrix. If we were to use Matrix4#set here, we'd have
                // to swap the order when passing in our DOMMatrix#_matrix.
                // Three.js r88, Issue #12602
                for (let i=0; i<16; i+=1) {
                    threeObject3d.matrixWorld.elements[i] = this._worldMatrix._matrix[i]
                    if ( domPlane )
                        domPlane.matrixWorld.elements[i] = this._worldMatrix._matrix[i]
                }

                // Since we're not letting Three auto update matrices, we also need
                // to update the inverse matrix for cameras.
                if ( threeObject3d instanceof ThreeCamera )
                    threeObject3d.matrixWorldInverse.getInverse( threeObject3d.matrixWorld );
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
             * @readonly
             */
            get element() {
                return this._elementOperations.element
            },

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
                if (!isInstanceof(childNode, ImperativeBase)) return

                // We cannot add Scenes to Nodes, for now.
                if (childNode instanceof Scene) {
                    throw new Error(`
                        A Scene cannot be added to another Node or Scene (at
                        least for now). To place a Scene in a Node, just mount
                        a new Scene onto a MotorHTMLNode with Scene.mount().
                    `)
                }

                Super(this).add(childNode)

                // Pass this parent node's Scene reference (if any, checking this cache
                // first) to the new child and the child's children.
                if (childNode._scene || childNode.scene) {
                    childNode._giveSceneRefToChildren()
                }

                // Calculate sizing because proportional size might depend on
                // the new parent.
                childNode._calcSize()
                childNode._needsToBeRendered()

                // child should watch the parent for size changes.
                this.on('sizechange', childNode._onParentSizeChange)

                this._elementOperations.connectChildElement(childNode)

                return this
            },

            remove(childNode, /*private use*/leaveInDom) {
                if (!(childNode instanceof Node)) return

                Super(this).remove(childNode)

                this.off('sizechange', childNode._onParentSizeChange)

                childNode._resetSceneRef()

                if (!leaveInDom)
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
            _getAncestorThatShouldBeRendered() {
                let parent = this.parent

                while (parent) {
                    if (parent._willBeRendered) return parent
                    parent = parent.parent
                }

                return false
            },

            _render(timestamp) {
                if ( Super(this)._render ) Super(this)._render()
                // applies the transform matrix to the element's style property.
                this._elementOperations.applyImperativeNodeProperties(this)
            },

            // TODO make a classes prop?
            // set properties(properties = {}) {
            //     Super(this).properties = properties
            //
            //     if (properties.classes)
            //         this._elementOperations.setClasses(...properties.classes);
            // },
        }))

    )

}

export {ImperativeBase as default}
