define(function(require, exports, module) {
    var Group = require('../core/Group');
    var OptionsManager = require('../core/OptionsManager');
    var Transform = require('../core/Transform');
    var Utility = require('../core/Utility');
    var ViewSequence = require('../core/ViewSequence');
    var EventHandler = require('../core/EventHandler');

    /**
     * Scroller lays out a collection of renderables, and will browse through them based on
     * accessed position. Scroller also broadcasts an 'edgeHit' event, with a position property of the location of the edge,
     * when you've hit the 'edges' of it's renderable collection.
     * @class Scroller
     * @constructor
      * @event error
     * @param {Options} [options] An object of configurable options.
     * @param {Number} [options.direction=Utility.Direction.Y] Using the direction helper found in the famous Utility
     * module, this option will lay out the Scroller instance's renderables either horizontally
     * (x) or vertically (y). Utility's direction is essentially either zero (X) or one (Y), so feel free
     * to just use integers as well.
     * @param {Number} [clipSize=undefined] The size of the area (in pixels) that Scroller will display content in.
     * @param {Number} [margin=undefined] The size of the area (in pixels) that Scroller will process renderables' associated calculations in.
     */
    function Scroller(options) {
        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        this._optionsManager = new OptionsManager(this.options);
        if (options) this._optionsManager.setOptions(options);

        this._node = null;
        this._offset = 0;

        this._offsetGetter = null;
        this._outputFunction = null;
        this._masterOutputFunction = null;
        this.outputFrom();

        this._onEdge = 0; // -1 for top, 1 for bottom

        this.group = new Group();
        this.group.add({render: _innerRender.bind(this)});

        this._size = [undefined, undefined];
        this._contextSize = [undefined, undefined];

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();

        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);
    }

    Scroller.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        margin: 0,
        clipSize: undefined,
        groupScroll: false
    };

    Scroller.EDGE_STATES = {
        TOP:   -1,
        NONE:   0,
        BOTTOM: 1
    };

    function _nodeSizeForDirection(node) {
        var direction = this.options.direction;
        var size = node.getSize();
        return (size) ? size[direction] : null;
    }

    function _output(node, offset, target) {
        var transform = this._outputFunction(offset);
        target.push({transform: transform, target: node.render(null, this._size)});
    }

    function _getClipSize() {
        return (this.options.clipSize !== undefined)
            ? this.options.clipSize
            : this._contextSize[this.options.direction] || 0;
    }

    /**
     * Patches the Scroller instance's options with the passed-in ones.
     * @method setOptions
     * @param {Options} options An object of configurable options for the Scroller instance.
     */
    Scroller.prototype.setOptions = function setOptions(options) {
        if (options.groupScroll !== this.options.groupScroll) {
            (options.groupScroll)
                ? this._eventOutput.subscribe(this.group)
                : this._eventOutput.unsubscribe(this.group);
        }
        this._optionsManager.setOptions(options);
    };

    /**
     * Tells you if the Scroller instance is on an edge.
     * @method onEdge
     * @return {Boolean} Whether the Scroller instance is on an edge or not.
     */
    Scroller.prototype.onEdge = function onEdge() {
        return this._onEdge;
    };

    /**
     * Allows you to overwrite the way Scroller lays out it's renderables. Scroller will
     * pass an offset into the function. By default the Scroller instance just translates each node
     * in it's direction by the passed-in offset.
     * Scroller will translate each renderable down
     * @method outputFrom
     * @param {Function} fn A function that takes an offset and returns a transform.
     * @param {Function} [masterFn]
     */
    Scroller.prototype.outputFrom = function outputFrom(fn, masterFn) {
        if (!fn) {
            fn = function(offset) {
                return (this.options.direction === Utility.Direction.X) ? Transform.translate(offset, 0) : Transform.translate(0, offset);
            }.bind(this);
            if (!masterFn) masterFn = fn;
        }
        this._outputFunction = fn;
        this._masterOutputFunction = masterFn ? masterFn : function(offset) {
            return Transform.inverse(fn(-offset));
        };
    };

    /**
     * The Scroller instance's method for reading from an external position. Scroller uses
     * the external position to actually scroll through it's renderables.
     * @method positionFrom
     * @param {Getter} offset Can be either a function that returns a position,
     * or an object with a get method that returns a position.
     */
    Scroller.prototype.offsetFrom = function offsetFrom(offset) {
        if (offset instanceof Function) this._offsetGetter = offset;
        else if (offset && offset.get) this._offsetGetter = offset.get.bind(offset);
        else {
            this._offsetGetter = null;
            this._offset = offset;
        }
        if (this._offsetGetter) this._offset = this._offsetGetter.call(this);
    };

    /**
     * Sets the collection of renderables under the Scroller instance's control.
     *
     * @method sequenceFrom
     * @param node {Array|ViewSequence} Either an array of renderables or a Famous viewSequence.
     * @chainable
     */
    Scroller.prototype.sequenceFrom = function sequenceFrom(node) {
        if (node instanceof Array) node = new ViewSequence({array: node});
        this._node = node;
    };

    /**
     * Generate a render spec from the contents of this component.
     *
     * @private
     * @method render
     * @return {number} Render spec for this component
     */
    Scroller.prototype.render = function render(parentSpec) {
        var size = parentSpec.size;
        // reset edge detection on size change
        if (!this.options.clipSize && (size[0] !== this._contextSize[0] || size[1] !== this._contextSize[1])) {
            this._contextSize[0] = size[0];
            this._contextSize[1] = size[1];

            if (this.options.direction === Utility.Direction.X) {
                this._size[0] = _getClipSize.call(this);
                this._size[1] = undefined;
            }
            else {
                this._size[0] = undefined;
                this._size[1] = _getClipSize.call(this);
            }
        }

        if (!this._node) return null;
        if (this._offsetGetter) this._offset = this._offsetGetter.call(this);

        var scrollTransform = this._masterOutputFunction(-this._offset);

        return {
            transform : scrollTransform,
            target : Group.prototype.render.apply(this.group, arguments)
        };
    };

    function _innerRender() {
        var offset = this._offset;
        var onEdge = false;
        var clipSize = _getClipSize.call(this);
        var result = [];

        // forwards
        var currNode = this._node;
        var nodeOffset = -offset; //distance from first node

        while (currNode && nodeOffset < clipSize + this.options.margin) {
            _output.call(this, currNode, nodeOffset + offset, result);
            nodeOffset += _nodeSizeForDirection.call(this, currNode);
            currNode = currNode.getNext();
        }

        //offset : distance of first node from beginning of viewport
        //nodeOffset : node's distance from beginning of viewport
        //nodeOffset + offset : node's distance from first node

        if (!currNode && nodeOffset < clipSize) {
            onEdge = true;
            if (this._onEdge !== Scroller.EDGE_STATES.BOTTOM){
                this._onEdge = Scroller.EDGE_STATES.BOTTOM;
                this.emit('onEdge', {
                    offset: (nodeOffset + offset - clipSize),
                    edge: this._onEdge
                });
            }
        }

        // backwards
        currNode = this._node;
        nodeOffset = -offset;

        while (currNode && nodeOffset > -this.options.margin - clipSize) {
            currNode = currNode.getPrevious();
            if (!currNode) break;
            nodeOffset -= _nodeSizeForDirection.call(this, currNode);
            _output.call(this, currNode, nodeOffset + offset, result);
        }

        if (!currNode && nodeOffset > 0) {
            onEdge = true;
            if (this._onEdge !== Scroller.EDGE_STATES.TOP) {
                this._onEdge = Scroller.EDGE_STATES.TOP;
                this.emit('onEdge', {
                    offset: 0,
                    edge: this._onEdge
                });
            }
        }

        if (!onEdge && this._onEdge !== Scroller.EDGE_STATES.NONE){
            this._onEdge = Scroller.EDGE_STATES.NONE;
            this.emit('offEdge');
        }

        return result;
    }

    module.exports = Scroller;
});
