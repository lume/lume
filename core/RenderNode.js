/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var CombinerNode = require('./CombinerNode');
    var Transform = require('./Transform');
    var SpecManager = require('./SpecManager');
    var Modifier = require('./Modifier');
    var EventHandler = require('famous/core/EventHandler');
    var EventMapper = require('famous/events/EventMapper');
    var Stream = require('famous/streams/Stream');

    /**
     * A wrapper for inserting a renderable component (like a Modifer or
     *   Surface) into the render tree.
     *
     * @class RenderNode
     * @constructor
     *
     * @param {Object} object Target renderable component
     */
    function RenderNode(object) {
        this._object = null;
        this._child = null;
        this._root = null;
        this.stream = null;

        this._objectSpec = null;
        this._parentSpec = null;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        var mapper = new EventMapper(function(parentSpec){
            if (!this._objectSpec) return parentSpec;
            else return SpecManager.merge(this._objectSpec, parentSpec);
        }.bind(this));

        this._eventOutput.subscribe(mapper).subscribe(this._eventInput);

        this._eventInput.on('start', function(parentSpec){
           if (!this._child && this._object.commit){
               this._root.emit('register', {
                    committer : this._object,
                    spec : parentSpec
               });
           }
        }.bind(this));

        if (object) this.set(object);
    }

    /**
     * Append a renderable to the list of this node's children.
     *   This produces a new RenderNode in the tree.
     *   Note: Does not double-wrap if child is a RenderNode already.
     *
     * @method add
     * @param {Object} object renderable object
     * @return {RenderNode} new render node wrapping child
     */
    RenderNode.prototype.add = function add(object) {
        var childNode = new RenderNode(object);
        childNode.setRoot(this._root);

        if (this._child instanceof CombinerNode)
            this._child.add(childNode);
        else if (this._child)
            this._child = new CombinerNode([this._child, childNode]);
        else this._child = childNode;

        childNode.subscribe(this._eventOutput);

        return childNode;
    };

    RenderNode.prototype.setRoot = function(root){
        this._root = root;
    };

    /**
     * Return the single wrapped object.  Returns null if this node has multiple child nodes.
     *
     * @method get
     *
     * @return {Ojbect} contained renderable object
     */
    RenderNode.prototype.get = function get() {
        return this._object || (this._child ? this._child.get() : null);
    };

    /**
     * Overwrite the list of children to contain the single provided object
     *
     * @method set
     * @param {Object} child renderable object
     * @return {RenderNode} this render node, or child if it is a RenderNode
     */
    RenderNode.prototype.set = function set(object) {
        this._object = object;

        object.on('start', function(data){
           this._objectSpec = data;
        }.bind(this));

        object.on('update', function(data){
            this._objectSpec = data;
        }.bind(this));

        object.on('end', function(data){
            this._objectSpec = data;
        }.bind(this));

//        this.stream = Stream.lift(
//            function(objectSpec, parentSpec){
//                if (this._child == null && this._object.commit){
//
//                    this._root.emit('register', {
//                        committer : this._object,
//                        spec : parentSpec
//                    });
//                    return;
//                }
//
//                return (parentSpec && objectSpec)
//                    ? SpecManager.merge(objectSpec, parentSpec)
//                    : objectSpec || parentSpec;
//
//            }.bind(this),
//            [object, this._eventOutput]
//        );
    };

    /**
     * Get render size of contained object.
     *
     * @method getSize
     * @return {Array.Number} size of this or size of single child.
     */
    RenderNode.prototype.getSize = function getSize() {
        var result = null;
        var target = this.get();
        if (target && target.getSize) result = target.getSize();
        if (!result && this._child) result = this._child.getSize();
        return result;
    };

    module.exports = RenderNode;
});
