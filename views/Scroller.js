/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var Group = require('famous/core/Group');
    var Transform = require('famous/core/Transform');
    var ViewSequence = require('famous/core/ViewSequence');
    var View = require('famous/core/View');
    var Getter = require('famous/core/GetHelper');
    var Observable = require('famous/core/Observable');

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

    var Scroller = module.exports = View.extend({
        defaults : {
            direction: DIRECTION.Y,
            margin: 0,
            clipSize: undefined,
            groupScroll: false
        },
        events : {
            resize : onResize,
            change : _updateOptions
        },
        setup : function(){
            var offsetGetter = new Getter(this.offset);

            var masterTransform = offsetGetter.map(function(offset){
                return this._masterOutputFunction(-offset);
            }.bind(this));

            this.add({transform : masterTransform}).add(this.group);
        },
        initialize : function(options){
            this.initializeState(options);
            this.initializeSubviews(options);
            this.initializeEvents(options);
        },
        initializeState : function initializeState(options){
            this._currentNode = null;

            this._outputFunction = function(offset) {
                return (options.direction === DIRECTION.X)
                    ? Transform.translate(offset, 0)
                    : Transform.translate(0, offset);
            };

            this._masterOutputFunction = function(offset) {
                return (options.direction === DIRECTION.X)
                    ? Transform.translate(-offset, 0)
                    : Transform.translate(0, -offset);
            };

            this._edgeState = EDGE_STATES.NONE;
            this._size = [undefined, undefined];
            this._contextSize = [undefined, undefined];
        },
        initializeSubviews : function initializeSubviews(){
            this.group = new Group();
            this.group.add(_innerRender.bind(this));
        },
        initializeEvents : function initializeEvents(options){
            if (options.groupScroll)
                this._eventOutput.subscribe(this.group);
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
            this._outputFunction = (fn)
                ? fn
                : function(offset) {
                    return (this.options.direction === DIRECTION.X)
                        ? Transform.translate(offset, 0)
                        : Transform.translate(0, offset);
                }.bind(this);

            this._masterOutputFunction = (masterFn)
                ? masterFn
                : function(offset) {
                    return Transform.inverse(this._outputFunction(-offset));
                }.bind(this);
        },
        /**
         * The Scroller instance's method for reading from an external position. Scroller uses
         * the external position to actually scroll through it's renderables.
         * @method positionFrom
         * @param {Getter} offset Can be either a function that returns a position,
         * or an object with a get method that returns a position.
         */
        offsetFrom : function offsetFrom(offset) {
            if (offset && offset.get) this.offset = offset;
            else this.offset = new Observable(offset);
        },
        /**
         * Sets the collection of renderables under the Scroller instance's control.
         *
         * @method sequenceFrom
         * @param node {Array|ViewSequence} Either an array of renderables or a Famous viewSequence.
         * @chainable
         */
        //TODO: add sequence to state
        sequenceFrom : function sequenceFrom(node) {
            if (node instanceof Array) node = new ViewSequence({array: node});
            this._currentNode = node;
        }

    }, CONSTANTS);

    function onResize(size){
        this._contextSize = size;
        this._size[this.options.direction] = _getClipSize.call(this);
        this._size[1 - this.options.direction] = undefined;
    }

    function _nodeSizeForDirection(node) {
        var direction = this.options.direction;
        var size = node.getSize();
        return (size) ? size[direction] : null;
    }

    function _output(node, nodeOffset, target) {
        var transform = this._outputFunction(nodeOffset);
        target.push({transform: transform, target: node.render()});
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
                ? this.subscribe(this.group)
                : this.unsubscribe(this.group);
        }
    }

    function _innerRender() {
        var offset = this.offset.get();
        var onEdge = false;
        var clipSize = _getClipSize.call(this);
        var result = [];

        // forwards
        var currNode = this._currentNode;
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
        currNode = this._currentNode;
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
