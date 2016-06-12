import 'geometry-interfaces'
import Motor from './Motor'
import '../motor-html/node'

/**
 * Manages a DOM element. Exposes a set of recommended APIs for working with
 * DOM efficiently.
 */
class ElManager {
    constructor(element) {
        this.element = element
    }

    /**
     * @param {Array.string} classes An array of class names to add to the
     * managed element.
     *
     * Note: updating class names with `el.classList.add()` won't thrash the
     * layout. See: http://www.html5rocks.com/en/tutorials/speed/animations
     */
    setClasses (...classes) {
        if (classes.length) this.element.classList.add(...classes)
        return this
    }
}

class XYZValues {
    constructor(x = 0, y = 0, z = 0) {
        this._x = x
        this._y = y
        this._z = z
    }

    // override this on the instance to run logic on a property change.
    onChanged() {}

    set x(value) {
        this._x = value
        this.onChanged()
    }
    get x() { return this._x }

    set y(value) {
        this._y = value
        this.onChanged()
    }
    get y() { return this._y }

    set z(value) {
        this._z = value
        this.onChanged()
    }
    get z() { return this._z }
}

export default
class Node {

    /**
     * @constructor
     *
     * @param {Object} initialProperties Properties object -- see example
     *
     * @example
     * var node = new Node({
     * })
     */
    constructor (initialProperties = {}, _motorHtmlNode) {
        // The presence of the _motorHtmlNode signifies that the HTML interface
        // is being used, otherwise the imperative interface here is being
        // used.

        // DOM representation of Node
        // TODO: remove this and handle it in the "DOMRenderer"
        this._el = new ElManager(
            _motorHtmlNode || this._makeElement()
        )
        this._el.element._associateImperativeNode(this)

        this._mounted = false;

        this._parent = null // default to no parent.
        this._children = [];
        this._scene = null // stores a ref to this Node's root Scene.

        // Property Cache, with default values
        const node = this
        this._properties = {

            // XXX: remove these in favor of storing them directly in the
            // DOMMatrix?
            position: new XYZValues(0, 0, 0),
            rotation: new XYZValues(0, 0, 0),

            // TODO: handle scale
            scale: new XYZValues(1, 1, 1),

            // TODO, handle origin, needs a setter/getter pair.
            origin: new XYZValues(0.5, 0.5, 0.5),

            align: new XYZValues(0, 0, 0),
            mountPoint: new XYZValues(0, 0, 0),
            sizeMode: new XYZValues('absolute', 'absolute', 'absolute'),
            absoluteSize: new XYZValues(0, 0, 0),
            proportionalSize: new XYZValues(1, 1, 1),

            transform: new window.DOMMatrix,

            style: {
                opacity: 1,
            },
        };

        const self = this
        const propertyChange = function() {
            self._needsToBeRendered()
        }
        this._properties.position.onChanged = propertyChange
        this._properties.rotation.onChanged = propertyChange
        this._properties.scale.onChanged = propertyChange
        this._properties.origin.onChanged = propertyChange
        this._properties.align.onChanged = propertyChange
        this._properties.mountPoint.onChanged = propertyChange
        this._properties.sizeMode.onChanged = propertyChange
        this._properties.absoluteSize.onChanged = propertyChange
        this._properties.proportionalSize.onChanged = propertyChange

        this.properties = initialProperties

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
        return document.createElement('motor-node')
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
            if (this.constructor.name == 'Scene') this._scene = this
            else if (this._parent) this._scene = this._parent.scene

            return this._scene
        }
    }

    /**
     * Set the position of the Node.
     *
     * @param {Object} newValue
     * @param {number} [newValue.x] The x-axis position to apply.
     * @param {number} [newValue.y] The y-axis position to apply.
     * @param {number} [newValue.z] The z-axis position to apply.
     */
    set position(newValue) {
        if (!(newValue instanceof Object))
            throw new TypeError('Invalid value for Node#position.')

        if (typeof newValue.x != 'undefined') this._properties.position._x = newValue.x
        if (typeof newValue.y != 'undefined') this._properties.position._y = newValue.y
        if (typeof newValue.z != 'undefined') this._properties.position._z = newValue.z

        this._needsToBeRendered()
    }
    get position() {
        return this._properties.position
    }

    /**
     * @param {Object} newValue
     * @param {number} [newValue.x] The x-axis rotation to apply.
     * @param {number} [newValue.y] The y-axis rotation to apply.
     * @param {number} [newValue.z] The z-axis rotation to apply.
     *
     * XXX: We should we also provide a setRotationAxis method to rotate about
     * a particular axis? Or, maybe if a fourth `w` property is specified then
     * x, y, and z can define a rotation axis and w be the angle.
     */
    set rotation(newValue) {
        if (!(newValue instanceof Object))
            throw new TypeError('Invalid value for Node#rotation.')

        if (typeof newValue.x != 'undefined') this._properties.rotation._x = newValue.x
        if (typeof newValue.y != 'undefined') this._properties.rotation._y = newValue.y
        if (typeof newValue.z != 'undefined') this._properties.rotation._z = newValue.z

        this._needsToBeRendered()
    }
    get rotation() {
        return this._properties.rotation
    }

    /**
     * @param {Object} newValue
     * @param {number} [newValue.x] The x-axis scale to apply.
     * @param {number} [newValue.y] The y-axis scale to apply.
     * @param {number} [newValue.z] The z-axis scale to apply.
     *
     * TODO: scale is not handled yet.
     */
    set scale(newValue) {
        if (!(newValue instanceof Object))
            throw new TypeError('Invalid value for Node#scale.')

        if (typeof newValue.x != 'undefined') this._properties.scale._x = newValue.x
        if (typeof newValue.y != 'undefined') this._properties.scale._y = newValue.y
        if (typeof newValue.z != 'undefined') this._properties.scale._z = newValue.z

        this._needsToBeRendered()
    }
    get scale() {
        return this._properties.scale
    }

    /**
     * Set this Node's opacity.
     *
     * @param {number} opacity A floating point number between 0 and 1
     * (inclusive). 0 is fully transparent, 1 is fully opaque.
     */
    set opacity(opacity) {
        if (!isRealNumber(opacity)) throw new Error('Expected a real number for Node#opacity.')
        this._properties.style.opacity = opacity;
        this._needsToBeRendered()
    }
    get opacity() {
        return this._properties.style.opacity
    }

    /**
     * Set the size mode for each axis. Possible size modes are "absolute" and "proportional".
     *
     * @param {Object} newValue
     * @param {number} [newValue.x] The x-axis sizeMode to apply.
     * @param {number} [newValue.y] The y-axis sizeMode to apply.
     * @param {number} [newValue.z] The z-axis sizeMode to apply.
     */
    set sizeMode(newValue) {
        if (!(newValue instanceof Object))
            throw new TypeError('Invalid value for Node#sizeMode.')

        if (typeof newValue.x != 'undefined') this._properties.sizeMode._x = newValue.x
        if (typeof newValue.y != 'undefined') this._properties.sizeMode._y = newValue.y
        if (typeof newValue.z != 'undefined') this._properties.sizeMode._z = newValue.z

        this._needsToBeRendered()
    }
    get sizeMode() {
        return this._properties.sizeMode
    }

    /**
     * @param {Object} newValue
     * @param {number} [newValue.x] The x-axis absoluteSize to apply.
     * @param {number} [newValue.y] The y-axis absoluteSize to apply.
     * @param {number} [newValue.z] The z-axis absoluteSize to apply.
     */
    set absoluteSize(newValue) {
        if (!(newValue instanceof Object))
            throw new TypeError('Invalid value for Node#absoluteSize.')

        if (typeof newValue.x != 'undefined') this._properties.absoluteSize._x = newValue.x
        if (typeof newValue.y != 'undefined') this._properties.absoluteSize._y = newValue.y
        if (typeof newValue.z != 'undefined') this._properties.absoluteSize._z = newValue.z

        this._needsToBeRendered()
    }
    get absoluteSize() {
        return this._properties.absoluteSize
    }

    /**
     * Get the actual size of the Node. This can be useful when size is
     * proportional, as the actual size of the Node depends on querying the DOM
     * for the size of the Node's DOM element relative to it's parent.
     *
     * @readonly
     *
     * @return {Array.number} An Oject with x, y, and z properties, each
     * property representing the computed size of the x, y, and z axes
     * respectively.
     *
     * TODO: traverse up the tree to find parent size when this Node's size is
     * proportional?
     */
    get actualSize() {
        let actualSize = {}

        if (this._properties.sizeMode.x === 'absolute') {
            actualSize.x = this._properties.absoluteSize.x
        }
        else if (this._properties.sizeMode.x === 'proportional') {
            // TODO: avoid getComputedStyle as it causes a layout thrash.
            actualSize.x = parseInt(getComputedStyle(this._el.element).getPropertyValue('width'))
        }

        if (this._properties.sizeMode.y === 'absolute') {
            actualSize.y = this._properties.absoluteSize.y
        }
        else if (this._properties.sizeMode.y === 'proportional') {
            actualSize.y = parseInt(getComputedStyle(this._el.element).getPropertyValue('height'))
        }

        if (this._properties.sizeMode.z === 'absolute') {
            actualSize.z = this._properties.absoluteSize.z
        }
        else if (this._properties.sizeMode.z === 'proportional') {
            //actualSize.z = parseInt(getComputedStyle(this._el.element).getPropertyValue('height'))
            actualSize.z = 0 // TODO
        }

        return actualSize
    }

    /**
     * Set the size of a Node proportional to the size of it's parent Node. The
     * values are a real number between 0 and 1 inclusive where 0 means 0% of
     * the parent size and 1 means 100% of the parent size.
     *
     * @param {Object} newValue
     * @param {number} [newValue.x] The x-axis proportionalSize to apply.
     * @param {number} [newValue.y] The y-axis proportionalSize to apply.
     * @param {number} [newValue.z] The z-axis proportionalSize to apply.
     */
    set proportionalSize(newValue) {
        if (!(newValue instanceof Object))
            throw new TypeError('Invalid value for Node#proportionalSize.')

        if (typeof newValue.x != 'undefined') this._properties.proportionalSize._x = newValue.x
        if (typeof newValue.y != 'undefined') this._properties.proportionalSize._y = newValue.y
        if (typeof newValue.z != 'undefined') this._properties.proportionalSize._z = newValue.z

        this._needsToBeRendered()
    }
    get proportionalSize() {
        return this._properties.proportionalSize
    }

    /**
     * Set the alignment of the Node. This determines at which point in this
     * Node's parent that this Node is mounted.
     *
     * @param {Object} newValue
     * @param {number} [newValue.x] The x-axis align to apply.
     * @param {number} [newValue.y] The y-axis align to apply.
     * @param {number} [newValue.z] The z-axis align to apply.
     */
    set align(newValue) {
        if (!(newValue instanceof Object))
            throw new TypeError('Invalid value for Node#align.')

        if (typeof newValue.x != 'undefined') this._properties.align._x = newValue.x
        if (typeof newValue.y != 'undefined') this._properties.align._y = newValue.y
        if (typeof newValue.z != 'undefined') this._properties.align._z = newValue.z

        this._needsToBeRendered()
    }
    get align() {
        return this._properties.align
    }

    /**
     * Set the mount point of the Node. TODO: put "mount point" into words.
     *
     * XXX possibly rename to "anchor" to avoid confusion with Scene.mount?
     * Could also segway to anchors system like Qt QML.
     *
     * @param {Object} newValue
     * @param {number} [newValue.x] The x-axis mountPoint to apply.
     * @param {number} [newValue.y] The y-axis mountPoint to apply.
     * @param {number} [newValue.z] The z-axis mountPoint to apply.
     */
    set mountPoint(newValue) {
        if (!(newValue instanceof Object))
            throw new TypeError('Invalid value for Node#mountPoint.')

        if (typeof newValue.x != 'undefined') this._properties.mountPoint._x = newValue.x
        if (typeof newValue.y != 'undefined') this._properties.mountPoint._y = newValue.y
        if (typeof newValue.z != 'undefined') this._properties.mountPoint._z = newValue.z

        this._needsToBeRendered()
    }
    get mountPoint() {
        return this._properties.mountPoint
    }

    /**
     * Set all properties of the Node in one method.
     *
     * XXX: Should we change size so it matches structure here and on the node?
     *
     * @param {Object} properties Properties object - see example
     *
     * @example
     * node.properties = {
     *   classes: ['open'],
     *   position: [200, 300, 0],
     *   rotation: [3, 0, 0],
     *   scale: [1, 1, 1],
     *   size: {
     *     mode: ['absolute', 'proportional'],
     *     absolute: [300, null],
     *     proportional: [null, .5]
     *   },
     *   opacity: .9
     * }
     */
    set properties (properties = {}) {
        // Classes
        if (properties.classes)
            this._el.setClasses(properties.classes);

        // Position
        if (properties.position)
            this.position = properties.position

        // Rotation
        if (properties.rotation)
            this.rotation = properties.rotation

        // Scale
        if (properties.scale)
            this.scale = properties.scale

        // Align
        if (properties.align)
            this.align = properties.align

        // Size Modes
        if (properties.sizeMode)
            this.sizeMode = properties.sizeMode

        // Absolute Size
        if (properties.absoluteSize)
            this.absoluteSize = properties.absoluteSize

        // Proportional Size
        if (properties.proportionalSize)
            this.proportionalSize = properties.proportionalSize

        // Opacity
        if (properties.style) {
            if (typeof properties.style.opacity != 'undefined')
                this.opacity = properties.opacity
        }

        this._needsToBeRendered()
    }
    // no need for a properties getter.

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
    async _needsToBeRendered() {
        if (!this._mounted) {
            await this.mountPromise
        }
        Motor._setNodeToBeRendered(this)
        if (!Motor._inFrame) Motor._startAnimationLoop()
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

    _render(timestamp) {
        // applies the transform matrix to the element's style property.
        // TODO: We shouldn't need to re-calculate the whole matrix every render?
        this._setMatrix3d(this._calculateMatrix());

        // TODO move to DOMRenderer
        this._applySize()
        this._applyStyles()

        //this._renderChildren()

        return this
    }

    _mountChildElement(childNode) {
        // If Node's HTML element isn't mounted.. mount it.
        // TODO move to DOMRenderer
        if (! childNode._mounted) {
            if (childNode._parent) {

                // TODO: camera
                // Mount to parent if parent is a Node
                // if (childNode._parent instanceof Node) {
                    if (childNode._el.element.parentNode !== childNode._parent._el.element)
                        childNode._parent._el.element.appendChild(childNode._el.element);
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

    _renderChildren() {
        // Render Children
        // TODO: move this out, into DOMRenderer/WebGLRenderer:
        // We don't need to render children explicitly (recursing through the
        // tree) because the DOMRenderer or WebGLRenderer will know what to do
        // with nodes in the scene graph.
        // For example, in the case of the DOMRenderer, we only need to update
        // this Node's transform matrix, then the renderer figures out the rest
        // (i.e. the browser uses it's nested-DOM matrix caching). DOMRenderer
        // or WebGLRenderer can decide how to most efficiently update child
        // transforms and how to update the scene. Node._render here will be
        // just a way of updating the state of this Node only.
        for (let child of this._children) {
            child._render();
        }
    }

    /**
     * [applySize description]
     *
     * @method
     * @private
     * @memberOf Node
     */
    _applySize () {
        var mode = this._properties.sizeMode;
        var absolute = this._properties.absoluteSize;
        var proportional = this._properties.proportionalSize;

        if (mode.x === 'absolute')
            this._applyStyle('width', `${absolute.x}px`);
        else if (mode.x === 'proportional')
            this._applyStyle('width', `${proportional.x * 100}%`);

        if (mode.y === 'absolute')
            this._applyStyle('height', `${absolute.y}px`);
        else if (mode.y === 'proportional')
            this._applyStyle('height', `${proportional.y * 100}%`);

        //TODO z axis
        //if (mode.z === 'absolute')
            //this._applyStyle('height', `${absolute.z}px`);
        //else if (mode.z === 'proportional')
            //this._applyStyle('height', `${proportional.z * 100}%`);
    }

    /**
     * [applyTransform description]
     *
     * @method
     * @private
     * @memberOf Node
     *
     * TODO: instead of calculating the whole matrix here all at once (which
     * gets called each _render()), apply rotation, translation, etc, directly
     * to the matrix individually when the user gives us those values. It might be
     * more performant. It will also let the user apply x,y,z rotation in their
     * order of choice instead of always x,y,z order as we do here.
     */
    _calculateMatrix () {
        let matrix = new window.DOMMatrix

        let alignAdjustment = [0,0,0]
        if (this._parent) { // The root Scene doesn't have a parent, for example.
            let parentSize = this._parent.actualSize
            alignAdjustment[0] = parentSize.x * this._properties.align.x
            alignAdjustment[1] = parentSize.y * this._properties.align.y
            alignAdjustment[2] = parentSize.z * this._properties.align.z
        }

        let mountPointAdjustment = [0,0,0]
        let thisSize = this.actualSize
        mountPointAdjustment[0] = thisSize.x * this._properties.mountPoint.x
        mountPointAdjustment[1] = thisSize.y * this._properties.mountPoint.y
        mountPointAdjustment[2] = thisSize.z * this._properties.mountPoint.z

        let appliedPosition = []
        appliedPosition[0] = this._properties.position.x + alignAdjustment[0] - mountPointAdjustment[0]
        appliedPosition[1] = this._properties.position.y + alignAdjustment[1] - mountPointAdjustment[1]
        appliedPosition[2] = this._properties.position.z + alignAdjustment[2] - mountPointAdjustment[2]

        matrix.translateSelf(appliedPosition[0], appliedPosition[1], appliedPosition[2])

        // TODO: move by negative origin before rotating.
        // XXX Should we calculate origin here, or should we leave that to the
        // DOM renderer (in the style property)? WebGL renderer will need
        // manual calculations. Maybe we don't do it here, and delegate it to
        // DOM and WebGL renderers.

        // apply each axis rotation, in the x,y,z order.
        // XXX: Does order in which axis rotations are applied matter? If so,
        // which order is best? Maybe we let the user decide (with our
        // recommendation)?
        let rotation = this._properties.rotation
        matrix.rotateAxisAngleSelf(1,0,0, rotation.x)
        matrix.rotateAxisAngleSelf(0,1,0, rotation.y)
        matrix.rotateAxisAngleSelf(0,0,1, rotation.z)

        // TODO: move by positive origin after rotating.

        return matrix
    }

    /**
     * Apply the DOMMatrix value to the style of this Node's element.
     *
     * @private
     *
     * TODO We'll eventually apply the DOMMatrix directly instead of
     * converting to a string here.
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

        this._applyStyle('transform', cssMatrixString);
    }

    /**
     * [applyStyle description]
     *
     * @method
     * @private
     * @memberOf Node
     * @param  {String} property [description]
     * @param  {String} value    [description]
     */
    _applyStyles () {
        for (let key of Object.keys(this._properties.style)) {
            this._applyStyle(key, this._properties.style[key]);
        }
    }

    /**
     * Apply a style property to this node's element.
     *
     * TODO: this will be moved into DOMRenderer.
     *
     * @private
     * @param  {string} property The CSS property we will a apply.
     * @param  {string} value    The value the CSS property wil have.
     */
    _applyStyle (property, value) {
        this._el.element.style[property] = value;
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
}

function defaultZeros(array) {
    array[0] = array[0] || 0
    array[1] = array[1] || 0
    array[2] = array[2] || 0
    return array
}

function isRealNumber(num) {
    if (
        typeof num != 'number'
        || Object.is(num, NaN)
        || Object.is(num, Infinity)
    ) return false
    return true
}
