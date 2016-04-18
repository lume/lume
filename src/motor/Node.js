import 'geometry-interfaces'

import {
    epsilon,
    makeLowercaseSetterAliases,
} from './Utility'

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

export default
class Node {

    /**
     * @constructor
     *
     * @param {Object} properties Properties object -- see example
     *
     * @example
     * var node = new Node({
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
     * })
     */
    constructor (properties = {}, _motorHtmlNode) {
        // The presence of the _motorHtmlNode signifies that the HTML interface
        // is being used, otherwise the imperative interface here is being
        // used.

        // DOM representation of Node
        // TODO: remove this and handle it in the "DOMRenderer"
        this._el = new ElManager(
            _motorHtmlNode || this.makeElement()
        )
        this._el.element._init(this)
        //this._el.setClasses(stylesheet.classes.motorDomNode)

        this._mounted = false;

        this._parent = null // default to no parent.
        this._scene = null // stores a ref to this Node's root Scene.

        // Property Cache, with default values
        this._properties = {

            // XXX: remove these in favor of storing them directly in the
            // DOMMatrix?
            position: [0,0,0],
            rotation: [0,0,0],

            origin: [0.5,0.5,0.5], // TODO, handle origin.
            align: [0,0,0],
            mountPoint: [0,0,0],
            size: {
                mode: ['absolute', 'absolute', 'absolute'],
                absolute: [0,0,0],
                proportional: [1,1,1]
            },
            opacity: 1,
        };

        // Style Cache
        this._style = Object.assign({
            transform: {
                domMatrix: new DOMMatrix
            }
        }, properties.style);

        this._children = [];

        this.setProperties(properties);

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
        //
        // TODO: Maybe we should rename this to `.ready`, matching with the
        // HTML API. See motor-html/node createdCallback.
        // TODO: We need to reset this when a Node is removed, as it will be
        // mounted again if it is ever added back into a scene graph. For now,
        // this only work on this Node's first mount.
        this._resolveMountPromise = null
        this.mountPromise = new Promise(r => this._resolveMountPromise = r)

        // TODO: this conditional check should work with child classes who's
        // constructor is no longer named "Node". This should not fire for
        // Scene or child classes of Scene.
        if (this.constructor.name == 'Node') {
            this.waitForSceneThenResolveMountPromise()
        }

        this._init()
    }

    async _init() {
        this._renderTasks = new Map

        await this._scenePromise
        await this._scene.mountPromise

        // render a node one time initially, once it's mounted.
        let initialRender = timestamp => this.removeRenderTask(initialRender)
        this.addRenderTask(initialRender)
    }

    makeElement() {
        return document.createElement('motor-node')
    }

    async waitForSceneThenResolveMountPromise() {
        await this._scenePromise
        await this._scene.mountPromise

        // TODO TODO: also wait for this._mounted so this.element is actually
        // mounted in the DOM.
        this._resolveMountPromise(true)
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
     * XXX Should we let the element be set, so that it's possible to apply
     * transforms to arbitrary elements?
     */
    get element() {
        return this._el
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

        if (this._parent && this._parent._scene) {
            this._scene = this._parent._scene

            return this._scene
        }
        else {
            if (this.constructor.name == 'Scene') this._scene = this
            else if (this._parent) this._scene = this._parent.scene

            return this._scene
        }
    }

    /**
     * Set the position of the Node.
     *
     * @param {Array.number} position An array of three numbers which are the X,
     * Y, and Z positions (translations) to apply.
     * @chainable
     */
    setPosition (position) {
        this.position = position
        return this
    }
    set position(position) {
        if (!(position instanceof Array)) throw new Error('Expected an array for the Node.position property.')
        if (! Object.is(position, this._properties.position)) // TODO: test array values against each other instead of checking array references?
            this._properties.position = defaultZeros(position)
        this._renderIfNotInFrame()
    }

    /**
     * Get the position of the Node.
     *
     * @return {Array.number} An array of 3 numbers, each one representing the X,
     * Y, and Z position of the Node (in that order).
     */
    get position() {
        return this._properties.position
    }

    /**
     * @param {Array.number} rotation A 3-item array, each item the rotation
     * about each axis X, Y, Z, respectively, in degrees.
     *
     * TODO: We should also provide a setRotationAxis method to rotate about a
     * particular axis.
     */
    setRotation (rotation) {
        this.rotation = rotation
        return this
    }
    set rotation(rotation) {
        this._properties.rotation = rotation
        this._renderIfNotInFrame()
    }

    /**
     * Get the rotation of the Node.
     *
     * @return {Array.number} An array of 3 numbers, each number representing the X,
     * Y, and Z rotation of the Node (in that order) in degrees.
     */
    get rotation() {
        return this._properties.rotation
    }

    /**
     * @return {Array.number} An array of 3 numbers, each number representing
     * the X, Y, and Z scale of the Node (in that order).
     */
    setScale (scale) {
        this.scale = scale
        return this
    }
    set scale(scale) {
        this._properties.scale = scale
        this._renderIfNotInFrame()
    }

    /**
     * @return {Array.number} An array of 3 numbers, each number representing the X,
     * Y, and Z scale of the Node (in that order).
     */
    get scale() {
        return this._properties.scale
    }

    /**
     * Set this Node's opacity.
     *
     * @param {number} opacity A floating point number between 0 and 1
     * (inclusive). 0 is fully transparent, 1 is fully opaque.
     */
    setOpacity (opacity) {
        this.opacity = opacity
        return this
    }
    set opacity(opacity) {
        if (!isRealNumber(opacity)) throw new Error('Expected a real number.')
        this._style.opacity = opacity;
        this._renderIfNotInFrame()
    }

    /**
     * Get this Node's opacity.
     *
     * @return {number} The opacity of the Node, a floating point number between 0 and 1.
     */
    get opacity() {
        return this._style.opacity
    }

    /**
     * Set the size mode for each axis. Possible size modes are "absolute" and "proportional".
     *
     * @param {Array.string} mode A three-item array of strings, each item
     * corresponding to the x, y, and z axes respectively.
     */
    setSizeMode (mode) {
        this.sizeMode = mode
        return this
    }
    set sizeMode(mode) {
        if (! Object.is(mode, this._properties.size.mode)) {
            this._properties.size.mode = mode
            this._applySize()
        }
        this._renderIfNotInFrame()
    }

    /**
     * @return {Array.number} An array of 3 numbers, each number representing the X,
     * Y, and Z scale of the Node (in that order).
     */
    get sizeMode() {
        return this._properties.size.mode
    }

    /**
     * @param {Array} size [description]
     */
    setAbsoluteSize (size) {
        this.absoluteSize = size
        return this
    }
    set absoluteSize(size) {
        if (! Object.is(size, this._properties.size.absolute)) {
            this._properties.size.absolute = size;

            if (this._properties.size.mode.indexOf('absolute') > -1)
                this._applySize();
        }
        this._renderIfNotInFrame()
    }

    /**
     * Get an array containing the size of each axis of this node.
     * @return {Array.number} A three-item array of numbers, each number
     * representing the absolute size of the x, y, and z axes respectively.
     * @readonly
     */
    get absoluteSize() {
        return this._properties.size.absolute
    }

    /**
     * Get the actual size of the Node. This can be useful when size is
     * proportional, as the actual size of the Node depends on querying the DOM
     * for the size of the Node's DOM element relative to it's parent.
     *
     * @return {Array.number} A three-item array of numbers, each number
     * representing the computed size of the x, y, and z axes respectively.
     * @readonly
     */
    get actualSize() {
        let actualSize = []

        if (this._properties.size.mode[0] === 'absolute') {
            actualSize[0] = this._properties.size.absolute[0]
        }
        else if (this._properties.size.mode[0] === 'proportional') {
            actualSize[0] = parseInt(getComputedStyle(this._el.element).getPropertyValue('width'))
        }

        if (this._properties.size.mode[1] === 'absolute') {
            actualSize[1] = this._properties.size.absolute[1]
        }
        else if (this._properties.size.mode[1] === 'proportional') {
            actualSize[1] = parseInt(getComputedStyle(this._el.element).getPropertyValue('height'))
        }

        // TODO: handle Z axis for 3D objects (i.e. WebGL objects)
        actualSize[2] = 0

        return actualSize
    }

    /**
     * Set the size of a Node proportional to the size of it's parent Node.
     *
     * ```
     * node.proportionalSize = [100,100,100]
     * console.log(node.proportionalSize)
     * ```
     *
     * @param {Array.number} size A three-item array of numbers, each item
     * representing the proprtional size of the x, y, and z axes respectively.
     */
    setProportionalSize (size) {
        this.proportionalSize = size
        return this
    }
    set proportionalSize(size) {
        if (! Object.is(size, this._properties.size.proportional)) {
            this._properties.size.proportional = size

            if (this._properties.size.mode.indexOf('proportional') > -1)
                this._applySize()
        }
        this._renderIfNotInFrame()
    }

    get proportionalSize() {
        return this._properties.size.proportional
    }

    /**
     * Set the alignment of the Node. This determines at which point in this
     * Node's parent that this Node is mounted.
     * @param {Array.number} alignment Array of three alignment values, one for each axis.
     */
    setAlign (alignment) {
        this.align = alignment
        return this
    }
    set align(alignment) {
        if (!(alignment instanceof Array)) throw new Error('Expected an array for the Node.align property.')
        if (! Object.is(alignment, this._properties.align))
            this._properties.align = defaultZeros(alignment)
        this._renderIfNotInFrame()
    }

    get align() {
        return this._properties.align
    }

    /**
     * Set the mount point of the Node. TODO: put "mount point" into words.
     *
     * @param {Array.number} mountPoint Array of three mount point values, one
     * for each axis.
     */
    setMountPoint (mountPoint) {
        this.mountPoint = mountPoint
        return this
    }
    set mountPoint(mountPoint) {
        if (!(mountPoint instanceof Array)) throw new Error('Expected an array for the Node.mountPoint property.')
        if (! Object.is(mountPoint, this._properties.mountPoint))
            this._properties.mountPoint = defaultZeros(mountPoint)
        this._renderIfNotInFrame()
    }

    get mountPoint() {
        return this._properties.mountPoint
    }

    /**
     * Set all properties of the Node in one method.
     *
     * @param {Object} properties Properties object - see example
     *
     * @example
     * node.setProperties({
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
     * })
     */
    setProperties (properties) {
        // Classes
        if (properties.classes)
            this.setClasses(properties.classes);

        // Position
        if (properties.position && properties.position.length === 3)
            this.position = properties.position

        // Rotation
        if (properties.rotation && properties.rotation.length === 3)
            this.rotation = properties.rotation

        // Scale
        if (properties.scale && properties.scale.length === 3)
            this.scale = properties.scale

        // Align
        if (properties.align && properties.align.length === 3)
            this.align = properties.align

        // Size
        if (properties.size) {

            // Size Modes
            if (properties.size.mode && properties.size.mode.length === 2)
                this.sizeMode = properties.size.mode

            // Absolute Size
            if (properties.size.absolute && properties.size.absolute.length === 2)
                this.absoluteSize = properties.size.absolute

            // Proportional Size
            if (properties.size.proportional && properties.size.proportional.length === 2)
                this.proportionalSize = properties.size.proportional

        }

        // Opacity
        if (typeof properties.opacity != 'undefined')
            this.opacity = properties.opacity

        // Apply Styles
        this._applyStyles();

        return this
    }

    async _renderIfNotInFrame() {
        if (!this._mounted) await this.mountPromise

        if (!this._scene._inFrame) {
            let render = timestamp => this.removeRenderTask(render)
            this.addRenderTask(render)
        }
    }

    /**
     * Add Child
     *
     * @param {[type]} childNode [description]
     */
    addChild (childNode) {

        // We cannot add Scenes to Nodes, for now.
        //
        // TODO: If someone extends Scene, constructor.name is different. We
        // need to catch those cases too, without using instanceof Scene in
        // order to avoid a circular dependency in this module.
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

        // Pass the child node's Scene reference (if any, checking it's cache
        // first) to the new child and sub children.
        //
        // Order is important: this needs to happen after previous stuff in
        // this method, so that the childNode.scene getter works.
        if (childNode._scene || childNode.scene) {
            childNode._resolveScenePromise(childNode._scene)
            childNode._giveSceneRefToChildren()
        }

        this._mountChildElement(childNode)

        return this
    }

    // @private
    // This method to be called only when this Node has this.scene.
    // Resolves the _scenePromise for all children of the tree of this Node.
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
            childNode._mounted = false

            // Remove from children array
            this._children.splice(this._children.indexOf(childNode), 1);

            this._removeChildElement(childNode)
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

    addRenderTask(fn) {
        this._renderTasks.set(fn, timestamp => {
            if (fn && typeof fn == 'function') fn.call(this, timestamp)

            //TODO if (certain criteria indicating render is needed) {
            this._render(timestamp)
            //}
        })

        this._scene._addRenderTask(this._renderTasks.get(fn))
    }

    removeRenderTask(fn) {
        this._scene._removeRenderTask(this._renderTasks.get(fn))
        this._renderTasks.delete(fn)
    }

    // TODO: separate stuff out of here into different parts, so we can
    // eventually progress to having a separate DOMRenderer and have a dynamic
    // rAF loop. Tracking at https://github.com/infamous/infamous/issues/3
    _render(timestamp) {
        // applies the transform matrix to the element's style property.
        // TODO: We shouldn't need to re-calculate the matrix every render?
        this._setMatrix3d(this._calculateMatrix());

        // TODO move to DOMRenderer
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

    _removeChildElement(childNode) {
        // TODO: move this out, into DOMRenderer

        if (!childNode._mounted) {

            // XXX Only remove the childNode _el if it has an actual parent
            if (childNode._el.element.parentNode)
                childNode._el.element.parentNode.removeChild(childNode._el.element)
        }
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
        // transforms and how to update the scene. Node.render here will be
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
        var mode = this._properties.size.mode;
        var absolute = this._properties.size.absolute;
        var proportional = this._properties.size.proportional;

        if (mode[0] === 'absolute')
            this._applyStyle('width', `${absolute[0]}px`);
        else if (mode[0] === 'proportional')
            this._applyStyle('width', `${proportional[0] * 100}%`);

        if (mode[1] === 'absolute')
            this._applyStyle('height', `${absolute[1]}px`);
        else if (mode[1] === 'proportional')
            this._applyStyle('height', `${proportional[1] * 100}%`);
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
        let matrix = new DOMMatrix

        let alignAdjustment = [0,0,0]
        if (this._parent) { // The root Scene doesn't have a parent, for example.
            let parentSize = this._parent.actualSize
            alignAdjustment[0] = parentSize[0] * this._properties.align[0]
            alignAdjustment[1] = parentSize[1] * this._properties.align[1]
            alignAdjustment[2] = parentSize[2] * this._properties.align[2]
        }

        let mountPointAdjustment = [0,0,0]
        let thisSize = this.actualSize
        mountPointAdjustment[0] = thisSize[0] * this._properties.mountPoint[0]
        mountPointAdjustment[1] = thisSize[1] * this._properties.mountPoint[1]
        mountPointAdjustment[2] = thisSize[2] * this._properties.mountPoint[2]

        let appliedPosition = []
        appliedPosition[0] = this._properties.position[0] + alignAdjustment[0] - mountPointAdjustment[0]
        appliedPosition[1] = this._properties.position[1] + alignAdjustment[1] - mountPointAdjustment[1]
        appliedPosition[2] = this._properties.position[2] + alignAdjustment[2] - mountPointAdjustment[2]

        matrix.translateSelf(appliedPosition[0], appliedPosition[1], appliedPosition[2])

        // TODO: move by negative origin before rotating.
        // XXX Should we calculate origin here, or should we leave that to the
        // DOM renderer (in the style property)? WebGL renderer will need
        // manual calculations. Maybe we don't do it here, and delegate it to
        // DOM and WebGL renderers.

        // apply each axis rotation, in the x,y,z order. TODO: This is
        // restrictive, and we should let the user apply any axis rotation in
        // any order.
        let rotation = this._properties.rotation
        matrix.rotateAxisAngleSelf(1,0,0, rotation[0]) // x-axis rotation
        matrix.rotateAxisAngleSelf(0,1,0, rotation[1]) // y-axis rotation
        matrix.rotateAxisAngleSelf(0,0,1, rotation[2]) // z-axis rotation

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
        var matrix = this._style.transform.domMatrix;

        // XXX: is this in the right order? UPDATE: It is.
        // TODO: Apply DOMMatrix directly to the Element once browser APIs
        // support it. Maybe we can polyfill this?
        var transform = `matrix3d(
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

        this._applyStyle('transform', transform);
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
        for (let key of Object.keys(this._style)) {
            if (key != 'transform')
                this._applyStyle(key, this._style[key]);
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
     * matrix. See "W3C Geometry Interfaces".
     */
    _setMatrix3d (matrix) {
        if (true || ! Object.is(this._style.transform.domMatrix, matrix)) {

            this._style.transform.domMatrix = matrix
            // ^ TODO: What's faster? Setting a new DOMMatrix (as we do here
            // currently, the result of _calculateMatrix) or applying all
            // transform values to the existing DOMMatrix?

            this._applyTransform();
        }
    }
}

// for use by MotorHTML, convenient since HTMLElement attributes are all
// converted to lowercase by default.
makeLowercaseSetterAliases(Node.prototype)

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
