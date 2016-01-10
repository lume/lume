import jss from '/app/src/both/jss-configured'
import {epsilon} from './Utility'

const CSS_CLASS_NODE = 'motor-dom-node';

let stylesheet = jss.createStyleSheet({
    motorDomNode: {
        position:        'absolute',
        transformOrigin: 'left top 0px',
        transformStyle:  'preserve-3d',
    },
}).attach()

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
     *     modes: ['absolute', 'proportional'],
     *     absolute: [300, null],
     *     proportional: [null, .5]
     *   },
     *   opacity: .9
     * })
     */
    constructor (properties = {}) {

        // DOM representation of Node
        this._element = document.createElement('div');
        this._element.classList.add(stylesheet.classes.motorDomNode)

        this._mounted = false;
        this._removedChildren = [] // FIFO

        this.parent = null // default to no parent.

        // Property Cache, with default values
        this._properties = {
            position: [0,0,0],
            size: {
                modes: ['absolute', 'absolute', 'absolute'],
                absolute: [0,0,0],
                proportional: [1,1,1]
            },
            align: [0,0,0],
            mountPoint: [0,0,0],
        };

        // Style Cache
        this._style = _.extend({
            transform:{
                matrix3d: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        }, properties.style);

        this._children = [];

        this.setProperties(properties);
    }

    /**
     * [applySize description]
     *
     * @method
     * @private
     * @memberOf Node
     */
    _applySize () {
        var modes = this._properties.size.modes;
        var absolute = this._properties.size.absolute;
        var proportional = this._properties.size.proportional;

        if (modes[0] === 'absolute')
            this._applyStyle('width', `${absolute[0]}px`);
        else if (modes[0] === 'proportional')
            this._applyStyle('width', `${proportional[0] * 100}%`);

        if (modes[1] === 'absolute')
            this._applyStyle('height', `${absolute[1]}px`);
        else if (modes[1] === 'proportional')
            this._applyStyle('height', `${proportional[1] * 100}%`);
    }

    /**
     * [applyTransform description]
     *
     * @method
     * @private
     * @memberOf Node
     */
    _calculateMatrix () {

        let alignAdjustment = [0,0,0]

        if (this.parent) { // The root Scene doesn't have a parent.
            let parentSize = this.parent.getActualSize()
            alignAdjustment[0] = parentSize[0] * this._properties.align[0]
            alignAdjustment[1] = parentSize[1] * this._properties.align[1]
            alignAdjustment[2] = parentSize[2] * this._properties.align[2]
        }

        let mountPointAdjustment = [0,0,0]

        let thisSize = this.getActualSize()
        mountPointAdjustment[0] = thisSize[0] * this._properties.mountPoint[0]
        mountPointAdjustment[1] = thisSize[1] * this._properties.mountPoint[1]
        mountPointAdjustment[2] = thisSize[2] * this._properties.mountPoint[2]

        let appliedPosition = []
        appliedPosition[0] = this._properties.position[0] + alignAdjustment[0] - mountPointAdjustment[0] || 0
        appliedPosition[1] = this._properties.position[1] + alignAdjustment[1] - mountPointAdjustment[1] || 0
        appliedPosition[2] = this._properties.position[2] + alignAdjustment[2] - mountPointAdjustment[2] || 0

        // put together a 4x4 matrix (3D).
        return [

            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,

            // translation
            appliedPosition[0], appliedPosition[1], appliedPosition[2], 1

        ];
    }

    /**
     * [applyTransform description]
     *
     * @method
     * @private
     * @memberOf Node
     */
    _applyTransform (){
        var matrix3d = this._style.transform.matrix3d;

        var transform = `matrix3d(
            ${ epsilon(  matrix3d[0]  ) },
            ${ epsilon(  matrix3d[1]  ) },
            ${ epsilon(  matrix3d[2]  ) },
            ${ epsilon(  matrix3d[3]  ) },
            ${ epsilon(  matrix3d[4]  ) },
            ${ epsilon(  matrix3d[5]  ) },
            ${ epsilon(  matrix3d[6]  ) },
            ${ epsilon(  matrix3d[7]  ) },
            ${ epsilon(  matrix3d[8]  ) },
            ${ epsilon(  matrix3d[9]  ) },
            ${ epsilon(  matrix3d[10] ) },
            ${ epsilon(  matrix3d[11] ) },
            ${ epsilon(  matrix3d[12] ) },
            ${ epsilon(  matrix3d[13] ) },
            ${ epsilon(  matrix3d[14] ) },
            ${ epsilon(  matrix3d[15] ) }
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
     * [applyStyle description]
     *
     * @method
     * @private
     * @memberOf Node
     * @param  {String} property [description]
     * @param  {String} value    [description]
     */
    _applyStyle (property, value) {
        this._element.style[property] = value;
    }

    /**
     * [setMatrix3d description]
     *
     * @method
     * @private
     * @memberOf Node
     * @param {Array} matrix [description]
     */
    _setMatrix3d (matrix){
        if (true || ! _.isEqual(this._style.transform.matrix3d, matrix)) {
            this._style.transform.matrix3d = matrix;
            this._applyTransform();
        }
    }

    /**
     * Set the position of the Node.
     *
     * @param {Array.number} position An array of three numbers which are the X,
     * Y, and Z positions to apply.
     * @chainable
     */
    setPosition (position) {
        if (! _.isEqual(position, this._properties.position))
            this._properties.position = position;

        return this
    }

    /**
     * Get the position of the Node.
     *
     * @return {Array.number} An array of 3 numbers, each one representing the X,
     * Y, and Z position of the Node (in that order).
     */
    getPosition() {
        return this._properties.position
    }

    /**
     * @param {Array.number} rotation [description]
     */
    setRotation (rotation) {
        this._properties.rotation = rotation;
        return this
    }

    /**
     * @param {Array.number} scale [description]
     */
    setScale (scale) {
        this.scale.set(scale[0], scale[1], scale[2]);
        return this
    }

    /**
     * Set this Node's opacity.
     *
     * @param {Number} opacity A number between 0 and 1 (inclusive). 0 is fully transparent, 1 is fully opaque.
     */
    setOpacity (opacity) {
        this._style.opacity = opacity;
        return this
    }

    /**
     * Get this Node's opacity.
     *
     * @return {number} The opacity of the Node, a number between 0 and 1.
     */
    getOpacity() {
        return this._properties.opacity
    }

    /**
     * Set the size modes for each axis. Possible size modes are "absolute" and "proportional".
     *
     * @param {Array.string} size A three-item array of strings, each item corresponding to the x, y, and z axes respectively.
     */
    setSizeModes (modes) {
        if (! _.isEqual(modes, this._properties.size.modes)) {
            this._properties.size.modes = modes;
            this._applySize();
        }

        return this
    }

    /**
     * @param {Array} size [description]
     */
    setAbsoluteSize (size) {
        if (! _.isEqual(size, this._properties.size.absolute)) {
            this._properties.size.absolute = size;

            if (this._properties.size.modes.indexOf('absolute') > -1)
                this._applySize();
        }

        return this
    }

    /**
     * Get an array containing the size of each axis of this node.
     * @return {Array.number} A three-item array of numbers, each item corresponding to the x, y, and z axes respectively.
     */
    getAbsoluteSize() {
        return this._properties.size.absolute
    }

    /**
     * Get the actual size of the Node. When size is proportional, the actual size
     * depends on querying the DOM for the size of the Node's DOM element.
     */
    getActualSize() {
        let actualSize = []

        if (this._properties.size.modes[0] === 'absolute') {
            actualSize[0] = this._properties.size.absolute[0]
        }
        else if (this._properties.size.modes[0] === 'proportional') {
            actualSize[0] = parseInt(getComputedStyle(this._element).getPropertyValue('width'))
        }

        if (this._properties.size.modes[1] === 'absolute') {
            actualSize[1] = this._properties.size.absolute[1]
        }
        else if (this._properties.size.modes[1] === 'proportional') {
            actualSize[1] = parseInt(getComputedStyle(this._element).getPropertyValue('height'))
        }

        // TODO: handle Z axis for 3D objects (i.e. WebGL objects)

        return actualSize
    }

    /**
     * Set the size of a Node proportional to the size of it's parent Node.
     *
     * @param {Array.number} size A three-item array of numbers, each item corresponding to the x, y, and z axes respectively.
     */
    setProportionalSize (size) {
        if (! _.isEqual(size, this._properties.size.proportional)) {
            this._properties.size.proportional = size;

            if (this._properties.size.modes.indexOf('proportional') > -1)
                this._applySize();
        }

        return this
    }

    /**
     * Set the alignment of the Node. This determines at which point in this Node's parent that this Node is mounted.
     * @param {Array.number} alignment Array of three alignment values, one for each axis.
     */
    setAlign (alignment) {
        if (! _.isEqual(alignment, this._properties.align))
            this._properties.align = alignment;

        return this
    }

    /**
     * Set the mount point of the Node. How do we put this into words?
     * @param {Array.number} mountPoint Array of three mount point values, one for each axis.
     */
    setMountPoint (mountPoint) {
        if (! _.isEqual(mountPoint, this._properties.mountPoint))
            this._properties.mountPoint = mountPoint;

        return this
    }

    /**
     * @param {Array.string} classes An array of class names to add to this
     * Node's _element.
     *
     * Note: updating class names with `el.classList.add()` won't thrash the
     * layout. See: http://www.html5rocks.com/en/tutorials/speed/animations/
     */
    setClasses (classes = []) {
        if (typeof classes !== 'array') classes = [classes]
            if (classes.length) this._element.classList.add(...classes);
        return this
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
     *     modes: ['absolute', 'proportional'],
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
            this.setPosition(properties.position);

        // Rotation
        if (properties.rotation && properties.rotation.length === 3)
            this.setRotation(properties.rotation);

        // Scale
        if (properties.scale && properties.scale.length === 3)
            this.setScale(properties.scale);

        // Align
        if (properties.align && properties.align.length === 3)
            this.setAlign(properties.align);

        // Size
        if (properties.size) {

            // Size Modes
            if (properties.size.modes && properties.size.modes.length === 2)
                this.setSizeModes(properties.size.modes);

            // Absolute Size
            if (properties.size.absolute && properties.size.absolute.length === 2)
                this.setAbsoluteSize(properties.size.absolute);

            // Proportional Size
            if (properties.size.proportional && properties.size.proportional.length === 2)
                this.setProportionalSize(properties.size.proportional);

        }

        // Opacity
        if (typeof properties.opacity != 'undefined')
            this.setOpacity(properties.opacity);

        // Apply Styles
        this._applyStyles();

        return this
    }

    /**
     * Add Child
     *
     * @param {[type]} node [description]
     */
    addChild (node) {

        if (node.parent)
            node.parent.removeChild(node)

        // Add parent
        node.parent = this;

        // Add to children array
        this._children.push(node);

        return this
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
     * @param {Node} node The node to remove.
     */
    removeChild(node) {
        let hasNode = this._children.includes(node)

        if (node instanceof Node && hasNode) {

            this._removedChildren.push(node)

            // Remove parent
            node.parent = null

            // unmount
            node._mounted = false

            // Remove from children array
            this._children.splice(this._children.indexOf(node), 1);
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
     * @return {number} How many children this Node has.
     */
    get childCount() {
        return this._children.length
    }

    /**
    */
    render () {
        this._setMatrix3d(this._calculateMatrix());

        this._applyStyles()

        //If Node isn't mounted.. mount it to the camera element
        if (! this._mounted) {
            if (this.parent) {
                // Mount to parent if parent is a Node
                // if (this.parent instanceof Node) {
                this.parent._element.appendChild(this._element);
                this._mounted = true;

                // Mount to camera if top level Node
                // } else {
                //   //scene.camera.element.appendChild(this._element);
                //   this._mounted = true;
                // }
            }
        }

        while (this._removedChildren.length) {
            let child = this._removedChildren.shift()

            // the removeChild methods set this._mounted to false, and we use
            // it as a hint that the child _element needs to be removed.
            if (!child._mounted) {

                // XXX Only remove the child _element if it has an actual parent
                // (it's possible for it not to have one if removeChild was
                // called before the child was ever rendered, in which case
                // it's _element will never have been mounted in the previous).
                if (child._element.parentNode)
                    child._element.parentNode.removeChild(child._element)
            }
        }

        // Render Children
        for (let child of this._children){
            child.render();
        }

        return this
    }
}
