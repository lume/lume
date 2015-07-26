/* Copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var EventHandler = require('famous/core/EventHandler');
    var Stream = require('famous/streams/Stream');
    var Spec = require('famous/core/Spec');
    var EventMapper = require('famous/events/EventMapper');
    var ResizeStream = require('famous/streams/ResizeStream');
    var SizeNode = require('famous/core/nodes/SizeNode');
    var LayoutNode = require('famous/core/nodes/LayoutNode');
    var layoutAlgebra = require('famous/core/algebras/layout');
    var sizeAlgebra = require('famous/core/algebras/size');

    function SceneGraphNode(object) {
        this.stream = null;
        this.sizeStream = null;
        this.size = new EventHandler();

        this.child = null;

        this.specs = [];
        this.objects = [];
        this.dirtyObjects = [];  // for discretely dirty objects
        this.dirtySpecs = [];

        this._eventIO = new EventHandler();
        EventHandler.setInputHandler(this, this._eventIO);
        EventHandler.setOutputHandler(this, this._eventIO);

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
                function SGSizeAlgebra (objectSpec, parentSize){
                    return (objectSpec)
                        ? sizeAlgebra(objectSpec, parentSize)
                        : parentSize;
                },
                [object, this.size]
            );

            this.stream = this._eventIO;
        }
        else if (!object.commit){
            this.stream = Stream.lift(
                function SGLayoutAlgebra (objectSpec, parentSpec, size){
                    return (objectSpec)
                        ? layoutAlgebra(objectSpec, parentSpec, size)
                        : parentSpec;
                },
                [object, this._eventIO, this.size]
            );
        }

        if (object.commit){
            object.__size.subscribe(this.size);

            var commitStream = Stream.lift(function(layout, size){
                if (size) layout.size = size;
                return layout;
            }, [this._eventIO, object.size]);

            commitStream.on('start', function(spec){
                this.objects.push(object);
                this.specs.push(spec);
            }.bind(this));

            commitStream.on('update', function(spec){
                var index = this.objects.indexOf(object);
                this.specs[index] = spec;
            }.bind(this));

            commitStream.on('end', function(spec){
                var index = this.specs.indexOf(spec);
                this.specs.splice(index, 1);
                this.objects.splice(index, 1);
            }.bind(this));

            object.on('dirty', function(){
                this.dirtySpecs.push(undefined);
                this.dirtyObjects.push(object);
            }.bind(this));

            object.on('clean', function(){
                var index = this.dirtyObjects.indexOf(object);
                this.dirtyObjects.splice(index, 1);
                this.dirtySpecs.splice(index, 1);
            }.bind(this));
        }
    };

    SceneGraphNode.prototype.commit = function commit(allocator){
        for (var i = 0; i < this.objects.length; i++){
            var object = this.objects[i];
            var spec = this.specs[i];

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
