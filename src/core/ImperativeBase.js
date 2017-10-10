import ElementOperations from './ElementOperations'
import Sizeable from './Sizeable'
import Node from './Node'
import Scene from './Scene'
import Motor from './Motor'
import {isInstanceof} from './Utility'

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
            construct(options = {}) {
                super.construct(options)

                // we don't need this, keep for backward compatibility (mainly
                // all my demos at trusktr.io).
                this.imperativeCounterpart = this

                this._willBeRendered = false

                // Here we create the DOM HTMLElement associated with this
                // Imperative-API Node.
                this._elementOperations = new ElementOperations(this)

                // For Nodes, true when this Node is added to a parent AND it
                // has an anancestor Scene that is mounted into DOM. For
                // Scenes, true when mounted into DOM.
                this._mounted = false;

                // For Nodes, a promise that resolves when this Node is
                // attached to a tree that has a root Scene TreeNode *and* when
                // that root Scene has been mounted into the DOM. For Scenes,
                // resolves when mounted into DOM.
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
             * @readonly
             */
            get mountPromise() {
                if (!this._mountPromise) {
                    this._mountPromise = new Promise((resolve, reject) => {
                        this._resolveMountPromise = resolve
                        this._rejectMountPromise = reject
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
                return this._elementOperations.element
            }

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

                super.add(childNode)

                // Pass this parent node's Scene reference (if any, checking this cache
                // first) to the new child and the child's children.
                if (childNode._scene || childNode.scene) {
                    if (childNode._resolveScenePromise)
                        childNode._resolveScenePromise(childNode._scene)
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
            }

            remove(childNode, /*private use*/leaveInDom) {
                if (!(childNode instanceof Node)) return

                super.remove(childNode)

                this.off('sizechange', childNode._onParentSizeChange)

                childNode._resetSceneRef()

                if (childNode._mountPromise) childNode._rejectMountPromise('mountcancel')
                if (childNode._mounted) childNode._elementOperations.shouldNotRender()
                childNode._resetMountPromise()

                if (!leaveInDom)
                    this._elementOperations.disconnectChildElement(childNode)
            }

            _resetMountPromise() {
                this._mounted = false
                this._mountPromise = null
                this._resolveMountPromise = null
                this._rejectMountPromise = null
                const children = this._children
                for (let i=0, l=children.length; i<l; i+=1) {
                    children[i]._resetMountPromise();
                }
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

                this._willBeRendered = true
                Motor._setNodeToBeRendered(this)
            }

            // This method is used by Motor._renderNodes().
            _getAncestorToBeRendered() {
                let parent = this._parent

                while (parent) {
                    if (parent._willBeRendered) return parent
                    parent = parent._parent
                }

                return false
            }

            _render(timestamp) {
                super._render()
                // applies the transform matrix to the element's style property.
                this._elementOperations.applyImperativeNodeProperties(this)
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
            set properties(properties = {}) {
                super.properties = properties

                if (properties.classes)
                    this._elementOperations.setClasses(...properties.classes);
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

    ImperativeBase = ImperativeBaseMixin(Sizeable)
    ImperativeBase.mixin = ImperativeBaseMixin

}

export {ImperativeBase as default}
