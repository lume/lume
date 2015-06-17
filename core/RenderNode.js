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
    var Spec = require('famous/core/Spec');
    var EventMapper = require('famous/events/EventMapper');
    var SizeStream = require('famous/core/SizeStream');

    function RenderNode(object) {
        this.stream = null;
        this.sizeStream = new SizeStream();

        this.child = null;
        this._cachedSize = null;

        this.specs = [];
        this.objects = [];
        this.dirtyObjects = [];  // for discretely dirty objects

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventOutput.subscribe(this._eventInput);

        if (object) this.set(object);
    }

    RenderNode.prototype.add = function add(object) {
        var childNode;
        if (object._isView){
            childNode = object;
        }
        else
            childNode = new RenderNode(object);

        if (this.stream){
            childNode.subscribe(this.stream);
        }
        else{
            childNode.subscribe(this);
        }


        childNode.sizeStream.subscribe(this.sizeStream);

        if (!this.child) {
            this.child = childNode;
        }
        else if (this.child instanceof Array){
            this.child.push(childNode);
        }
        else this.child = [this.child, childNode];

        return childNode;
    };

    RenderNode.prototype.set = function set(object) {
        this.stream = Stream.lift(
            function(objectSpec, parentSpec){
                return (objectSpec)
                    ? SpecManager.merge(objectSpec, parentSpec)
                    : parentSpec;
            },
            [object, this._eventOutput]
        );

        //TODO: sizeNodes should emit resize events
//        this.sizeStream = Stream.lift(
//            function(objectSpec, parentSize){
//                return (parentSize && objectSpec)
//                    ? SpecManager.getSize(objectSpec, parentSize)
//                    : parentSize;
//            },
//            [object, this.sizeStream]
//        );

        if (object.commit){
            var spec = new Spec();
            spec.subscribe(this.stream);

            this.stream.on('start', function(spec){
                this.objects.push(object);
                this.specs.push(spec);
            }.bind(this, spec));

            this.stream.on('end', function(spec){
                var index = this.specs.indexOf(spec);
                this.specs.splice(index, 1);
                this.objects.splice(index, 1);
            }.bind(this, spec));

            object.on('clean', function(){
                var index = this.dirtyObjects.indexOf(object);
                this.dirtyObjects.splice(index, 1);
            }.bind(this));

            object.on('dirty', function(){
                this.dirtyObjects.push(object);
            }.bind(this));

            this.sizeStream.on('update', function(size){
                console.log(size)
            });
        }
    };

    RenderNode.prototype.getSize = function(){
        return this._cachedSize;
    };

    RenderNode.prototype.commit = function commit(allocator){
        for (var i = 0; i < this.objects.length; i++){
            var object = this.objects[i];
            var spec = this.specs[i].get();
            object.commit(spec, allocator);

            var dirtyIndex = this.dirtyObjects.indexOf(object);
            if (dirtyIndex !== -1) this.dirtyObjects.splice(dirtyIndex, 1);
        }

        for (var i = 0; i < this.dirtyObjects.length; i++){
            this.dirtyObjects[i].commit(null, allocator);
        }

        if (this.child) {
            if (this.child instanceof Array){
                for (var i = 0; i < this.child.length; i++)
                    this.child[i].commit(allocator);
            }
            else this.child.commit(allocator);
        }
    };

    module.exports = RenderNode;
});
