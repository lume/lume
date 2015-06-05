/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
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
        this.stream = null;
        this._commitables = null;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function(data){
            this._eventOutput.emit('start', data)
        }.bind(this));

        this._eventInput.on('update', function(data){
            this._eventOutput.emit('update', data)
        }.bind(this));

        this._eventInput.on('end', function(data){
            this._eventOutput.emit('end', data)
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
        childNode.setCommitables(this.getCommitables());

        if (object.commit){
            var id = this._commitables.register(object);
            this._commitables.getSpec(id).subscribe(this.stream);
        }

        if (this.stream)
            childNode.subscribe(this.stream);
        else
            childNode.subscribe(this);

        return childNode;
    };

    RenderNode.prototype.setCommitables = function(commitables){
        this._commitables = commitables;
    };

    RenderNode.prototype.getCommitables = function(){
        return this._commitables;
    };

    /**
     * Overwrite the list of children to contain the single provided object
     *
     * @method set
     * @param {Object} child renderable object
     * @return {RenderNode} this render node, or child if it is a RenderNode
     */
    RenderNode.prototype.set = function set(object) {
        this.stream = Stream.lift(
            function(objectSpec, parentSpec){
                return (parentSpec && objectSpec)
                    ? SpecManager.merge(objectSpec, parentSpec)
                    : parentSpec;
            }.bind(this),
            [object, this._eventOutput]
        );
    };

    module.exports = RenderNode;
});
