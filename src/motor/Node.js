import 'geometry-interfaces'
import ElementManager from './ElementManager'
import Transformable from './Transformable'
import MotorHTMLNode from '../motor-html/node'
import { proxyGettersSetters } from './Utility'

import MultiClass from './MultiClass'

class Node extends Transformable {

    /**
     * @constructor
     *
     * @param {Object} initialProperties Initial properties that the node will
     * have. This can be used when creating a node, alternatively to using the
     * setters/getters for position, rotation, etc.
     *
     * @example
     * var node = new Node({
     *   absoluteSize: {x:100, y:100, z:100},
     *   rotation: {x:30, y:20, z:25}
     * })
     */
    constructor (initialProperties = {}, _motorHtmlNode) {
        // XXX The presence of a _motorHtmlNode argument signifies that the HTML interface
        // is being used, otherwise the imperative interface here is being
        // used. See MotorHTMLNode. This means the Node and MotorHTMLNode classes are
        // coupled together, but it's in the name of the API that we're supporting. We've
        // gotta make sure it's well documented.

        super(initialProperties, _motorHtmlNode)

        // DOM representation of Node
        // TODO: remove this and handle it in the "DOMRenderer". The DOMRender
        // will handle the HTML-side of the API, but for now it is here.
        this._el = new ElementManager(
            _motorHtmlNode || this._makeElement()
        )
        this._el.element._associateImperativeNode(this)

        this._mounted = false;

        this._parent = null // default to no parent.
        this._children = [];
        this._scene = null // stores a ref to this Node's root Scene.

        // an internal promise that resolves when this Node finally belongs to
        // a scene graph with a root Scene. The resolved value is the root
        // Scene.
        //
        // TODO: Reset this._scenePromise when the node is removed from it's
        // scene, or instead make _scenePromise a function that returns a
        // promise waiting for the next scene that the node will belong to, and
        // returns the existing promise if currently attached on a scene. For
        // now, this only works for the first scene that this Node is attached
        // to (which is not ultimately what we want).
        this._resolveScenePromise = null
        this._scenePromise = new Promise(r => this._resolveScenePromise = r)

        // Provide the user a promise that resolves when this Node is attached
        // to a tree and when this Node's eventual root Scene is mounted.
        // Users can await this in order to do something after this Node is
        // mounted in a scene graph that is live in the DOM.
        // _resolveMountPromise holds the current _mountPromise's resolve
        // method.
        //
        // TODO: Maybe we should rename this to `.ready`, matching with the
        // HTML API. See motor-html/node createdCallback.
        // TODO: We need to reset this when a Node is removed, as it will be
        // mounted again if it is ever added back into a scene graph. For now,
        // this only works on this Node's first mount.
        this._resolveMountPromise = null
        this._mountPromise = new Promise(r => this._resolveMountPromise = r)

        this._waitForSceneThenResolveMountPromise()

        this._init()
    }

    /**
     * @private
     */
    _init() {
        this._needsToBeRendered()
    }

    /**
     * @private
     */
    _makeElement() {
        return new MotorHTMLNode
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
     * @private
     */
    async _waitForSceneThenResolveMountPromise() {

        // TODO: this conditional check should work with child classes who's
        // constructor is no longer named "Node". This should not fire for
        // Scene or child classes of Scene.
        if (this.constructor.name == 'Node') {
            await this._getScenePromise()
            await this._scene.mountPromise

            // TODO TODO: also wait for this._mounted so this.element is actually
            // mounted in the DOM.
            this._resolveMountPromise(true)
        }

    }

    /**
     * @readonly
     *
     * TODO: needs to be overriden for Scene, because Scene mounts/unmounts
     * differently.
     */
    get mountPromise() {
        if (!this._mounted && !this._mountPromise) {
            this._mountPromise = new Promise(r => this._resolveMountPromise = r)
            this._waitForSceneThenResolveMountPromise()
        }

        return this._mountPromise
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
     * @readonly
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
            // TODO: We shouldn't rely on constructor.name, as this is different for
            // classes that extend Scene.
            // if (this.constructor.name == 'Scene') this._scene = this
            // else if (this._parent) this._scene = this._parent.scene
            if (this._parent) this._scene = this._parent.scene

            return this._scene
        }
    }

    /*
     * Trigger a re-render for this node (wait until mounted if not nounted
     * yet).
     *
     * TODO: We need to render one time each time mountPromise is resolved, not
     * just this one time as currently in constructor's call to this._init.
     *
     * XXX If a setter is called over and over in a render task before the node
     * is mounted, then each tick will cause an await this.mountPromise, and
     * eventually all the bodies will fire all at once. I don't think we want
     * this to happen.
     */
    // TODO: where do we house _needsToBeRendered? In the ImperativeBase class?
    // Transformable? A new Renderable class?
    async _needsToBeRendered() {
        if (!this._mounted) {
            await this.mountPromise
        }
        super._needsToBeRendered() // currently calls Transformable._needsToBeRendered
    }

    /**
     * Add a child node to this Node.
     *
     * @param {Node} childNode The child node to add.
     */
    addChild (childNode) {
        if (! (childNode instanceof Node))
            throw new Error('Node.addChild expects the childNode argument to be a Node instance.')

        // We cannot add Scenes to Nodes, for now.
        //
        // TODO: If someone extends Scene, constructor.name is different. We
        // need to catch those cases too, without using instanceof Scene in
        // order to avoid a circular dependency in this module.
        // Idea: maybe we can traverse the prototype chain looking for each
        // constructor.name.
        if (childNode.constructor.name == 'Scene') {
            throw new Error(`
                A Scene cannot currently be added to another Node.
                This may change in the future. For now, just mount
                a new Scene onto an HTMLElement (which can be the
                element held by a Node).
            `)
        }

        // Do nothing if the child Node is already added to this Node.
        //
        // After adding a Node to a parent using this imperative API, the
        // MotorHTMLNode ends up calling addChild on this Node's parent a second time
        // in the element's attachedCallback, but the code stops at this line (which is
        // good).
        // TODO: prevent the second call altogether.
        if (childNode._parent === this) return

        if (childNode._parent)
            childNode._parent.removeChild(childNode)

        // Add parent
        childNode._parent = this;

        // Add to children array
        this._children.push(childNode);

        // Pass this parent node's Scene reference (if any, checking this cache
        // first) to the new child and the child's children.
        //
        // NOTE: Order is important: this needs to happen after previous stuff
        // in this method, so that the childNode.scene getter works.
        if (childNode._scene || childNode.scene) {
            childNode._resolveScenePromise(childNode._scene)
            childNode._giveSceneRefToChildren()
        }

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

    /**
     * Add all the child nodes in the given array to this node.
     *
     * @param {Array.Node} nodes The nodes to add.
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
     * @param {Node} childNode The node to remove.
     */
    removeChild(childNode) {
        let thisHasChild = this._children.indexOf(childNode) >= 0

        if (childNode instanceof Node && thisHasChild) {
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
     * @param {Array.Node} nodes The nodes to remove.
     */
    removeChildren(nodes) {
        nodes.forEach(node => this.removeChild(node))
        return this
    }

    /**
     * @readonly
     * @return {number} How many children this Node has.
     */
    get childCount() {
        return this._children.length
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

    _detachElement(childNode) {
        // TODO: move this out, into DOMRenderer

        // XXX Only remove the childNode _el if it has an actual parent
        if (childNode._el.element.parentNode)
            childNode._el.element.parentNode.removeChild(childNode._el.element)
    }
}

function defaultZeros(array) {
    array[0] = array[0] || 0
    array[1] = array[1] || 0
    array[2] = array[2] || 0
    return array
}

if (Transformable && MotorHTMLNode)
    proxyGettersSetters(Transformable, MotorHTMLNode)

export {Transformable}
export {Node as default}
