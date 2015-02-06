define(function(require, exports, module) {
    var Group = require('../core/Group');
    var Transform = require('../core/Transform');
    var ViewSequence = require('../core/ViewSequence');
    var View = require('../views/View');

    /**
     * Scroller lays out a collection of renderables, and will browse through them based on
     * accessed position. Scroller also broadcasts an 'edgeHit' event, with a position property of the location of the edge,
     * when you've hit the 'edges' of it's renderable collection.
     * @class Scroller
     */

    /** @enum */
    var EDGE_STATES = {
        TOP:   -1,
        NONE:   0,
        BOTTOM: 1
    };

    /** @enum */
    var DIRECTION = {
        X : 0,
        Y : 0
    };

    var CONSTANTS = {
        DIRECTION : DIRECTION,
        EDGE_STATES : EDGE_STATES
    };

    module.exports = View.extend({
        defaults : {
            direction: DIRECTION.Y,
            margin: 0,
            clipSize: undefined,
            groupScroll: false
        },
        events : {
            change : _updateOptions
        },
        initialize : function(options){
            this._node = null;
            this._offset = 0;
            this._offsetGetter = null;
            this._outputFunction = null;
            this._masterOutputFunction = null;
            this._edgeState = EDGE_STATES.NONE;

            this.group = new Group();
            this.group.add({render: _innerRender.bind(this)});

            this._size = [undefined, undefined];
            this._contextSize = [undefined, undefined];

            this.outputFrom();
        },
        /**
         * Allows you to overwrite the way Scroller lays out it's renderables. Scroller will
         * pass an offset into the function. By default the Scroller instance just translates each node
         * in it's direction by the passed-in offset.
         * Scroller will translate each renderable down
         * @method outputFrom
         * @param {Function} fn A function that takes an offset and returns a transform.
         * @param {Function} [masterFn]
         */
        outputFrom : function outputFrom(fn, masterFn) {
            if (!fn) {
                fn = function(offset) {
                    return (this.options.direction === DIRECTION.X)
                        ? Transform.translate(offset, 0)
                        : Transform.translate(0, offset);
                }.bind(this);
                if (!masterFn) masterFn = fn;
            }
            this._outputFunction = fn;
            this._masterOutputFunction = (masterFn)
                ? masterFn
                : function(offset) {
                    return Transform.inverse(fn(-offset));
                };
        },
        /**
         * The Scroller instance's method for reading from an external position. Scroller uses
         * the external position to actually scroll through it's renderables.
         * @method positionFrom
         * @param {Getter} offset Can be either a function that returns a position,
         * or an object with a get method that returns a position.
         */
        offsetFrom : function offsetFrom(offset) {
            if (offset instanceof Function) this._offsetGetter = offset;
            else if (offset && offset.get) this._offsetGetter = offset.get.bind(offset);
            else {
                this._offsetGetter = null;
                this._offset = offset;
            }
            if (this._offsetGetter) this._offset = this._offsetGetter.call(this);
        },
        /**
         * Sets the collection of renderables under the Scroller instance's control.
         *
         * @method sequenceFrom
         * @param node {Array|ViewSequence} Either an array of renderables or a Famous viewSequence.
         * @chainable
         */
        sequenceFrom : function sequenceFrom(node) {
            if (node instanceof Array) node = new ViewSequence({array: node});
            this._node = node;
        },
        render : function render(parentSpec) {
            var size = parentSpec.size;
            // reset edge detection on size change
            if (!this.options.clipSize && (size[0] !== this._contextSize[0] || size[1] !== this._contextSize[1])) {
                this._contextSize[0] = size[0];
                this._contextSize[1] = size[1];

                if (this.options.direction === DIRECTION.X) {
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
        }

    }, CONSTANTS);

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

    function _updateOptions(options){
        var key = options.key;
        var value = options.value;
        if (key === "groupScroll") {
            (value)
                ? this.subscribe(this._scroller)
                : this.unsubscribe(this._scroller);
        }
    }

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
            if (this._edgeState !== EDGE_STATES.BOTTOM){
                this._edgeState = EDGE_STATES.BOTTOM;
                this.emit('onEdge', {
                    offset: (nodeOffset + offset - clipSize),
                    edge: this._edgeState
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
            if (this._edgeState !== EDGE_STATES.TOP) {
                this._edgeState = EDGE_STATES.TOP;
                this.emit('onEdge', {
                    offset: 0,
                    edge: this._edgeState
                });
            }
        }

        if (!onEdge && this._edgeState !== EDGE_STATES.NONE){
            this._edgeState = EDGE_STATES.NONE;
            this.emit('offEdge');
        }

        return result;
    }

});
