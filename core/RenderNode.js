/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var SpecManager = require('./SpecManager');
    var EventHandler = require('famous/core/EventHandler');
    var Stream = require('famous/streams/Stream');

    function RenderNode(object, commitables) {
        this.stream = null;
        this._commitables = commitables || null;
        this._cachedSize = null;

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function(parentSize){
            this._eventOutput.emit('start', parentSize)
        }.bind(this));

        this._eventInput.on('update', function(data){
            this._eventOutput.emit('update', data)
        }.bind(this));

        this._eventInput.on('end', function(data){
            this._eventOutput.emit('end', data)
        }.bind(this));

        if (object) this.set(object);
    }

    RenderNode.prototype.add = function add(object) {
        var childNode;
        if (object._isView)
            childNode = object;
        else
            childNode = new RenderNode(object, this._commitables);

        childNode.subscribe(this.stream || this);
        return childNode;
    };

    RenderNode.prototype.set = function set(object) {
        this.stream = Stream.lift(
            function(objectSpec, parentSpec){

                if (object.trigger){
                    var size = parentSpec.size;
                    var cachedSize = this._cachedSize;
                    if (!cachedSize || cachedSize[0] !== size[0] || cachedSize[1] == size[1]){
                        object.trigger('resize', size);
                    }
                }

                return (parentSpec && objectSpec)
                    ? SpecManager.merge(objectSpec, parentSpec)
                    : parentSpec;
            }.bind(this),
            [object, this._eventOutput]
        );

        if (object.commit){
            var id = this._commitables.register(object);
            this._commitables.getSpec(id).subscribe(this.stream);
        }
    };

    module.exports = RenderNode;
});
