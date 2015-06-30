/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var SpecManager = require('./../SpecManager');
    var EventHandler = require('famous/core/EventHandler');
    var Stream = require('famous/streams/Stream');
    var Spec = require('famous/core/Spec');
    var EventMapper = require('famous/events/EventMapper');
    var SizeStream = require('famous/streams/SizeStream');
    var ResizeStream = require('famous/streams/ResizeStream');
    var SizeNode = require('famous/core/nodes/SizeNode');
    var LayoutNode = require('famous/core/nodes/LayoutNode');

    function SceneGraphNode(object) {
        this.stream = null;
        this.sizeStream = null;
        this.size = new EventHandler();

        this.child = null;

        this.specs = [];
        this.objects = [];
        this.dirtyObjects = [];  // for discretely dirty objects

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function(spec){
            this._eventOutput.emit('start', spec);
        }.bind(this));

        this._eventInput.on('update', function(spec){
            this._eventOutput.emit('update', spec);
        }.bind(this));

        this._eventInput.on('end', function(spec){
            this._eventOutput.emit('end', spec);
        }.bind(this));

        if (object) this.set(object);
    }

    SceneGraphNode.prototype.add = function add(object) {
        var childNode = (object._isView)
            ? object
            : new SceneGraphNode(object);

        childNode.subscribe(this.stream || this);
        childNode.size.subscribe(this.sizeStream || this.size);

        if (!this.child)
            this.child = childNode;
        else if (this.child instanceof Array)
            this.child.push(childNode);
        else
            this.child = [this.child, childNode];

        return childNode;
    };

    SceneGraphNode.prototype.set = function set(object) {
        if (object instanceof SizeNode){
            this.sizeStream = ResizeStream.lift(
                function(objectSpec, parentSize){
                    return (objectSpec)
                        ? SpecManager.getSize(objectSpec, parentSize)
                        : parentSize;
                }.bind(this),
                [object, this.size]
            );

            this.stream = this._eventOutput;
        }
        else if (!object.commit){
            this.stream = Stream.lift(
                function(objectSpec, parentSpec, size){
                    return (objectSpec)
                        ? SpecManager.merge(objectSpec, parentSpec, size)
                        : parentSpec;
                }.bind(this),
                [object, this._eventOutput, this.size]
            );
        }

        if (object.commit){
            var spec = new Spec();

            spec.subscribe(this._eventInput);
            spec.subscribe(this.size);

            spec.on('start', function(spec){
                this.objects.push(object);
                this.specs.push(spec);
            }.bind(this));

            spec.on('end', function(spec){
                var index = this.specs.indexOf(spec);
                this.specs.splice(index, 1);
                this.objects.splice(index, 1);
            }.bind(this));

            object.on('clean', function(){
                var index = this.dirtyObjects.indexOf(object);
                this.dirtyObjects.splice(index, 1);
            }.bind(this));

            object.on('dirty', function(){
                this.dirtyObjects.push(object);
            }.bind(this));

//            if (object.__size){
//                object.__size.subscribe(this.size);
//            }
        }
    };

    SceneGraphNode.prototype.commit = function commit(allocator){
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

    module.exports = SceneGraphNode;
});
