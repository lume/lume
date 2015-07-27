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

        this.root = null;

        this.specs = {};
        this.objects = {};

        this._eventIO = new EventHandler();
        EventHandler.setInputHandler(this, this._eventIO);
        EventHandler.setOutputHandler(this, this._eventIO);

        if (object) this.set(object);
    }

    function _getRootNode(){
        if (this.root) return this.root;
        if (this.tempRoot) return _getRootNode.call(this.tempRoot);
        return this;
    }

    SceneGraphNode.prototype.add = function add(object) {
        var childNode;

        if (object._isView){
            object._node.root = _getRootNode.call(this);;
            childNode = object;
        }
        else {
            childNode = new SceneGraphNode(object);
            if (this.tempRoot) childNode.tempRoot = this.tempRoot;
            else childNode.root = _getRootNode.call(this);
        }

        childNode.subscribe(this.stream || this);
        childNode.size.subscribe(this.sizeStream || this.size);

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

        if (!object.commit){
            this.stream = Stream.lift(
                function SGLayoutAlgebra (objectSpec, parentSpec, size){
                    return (objectSpec)
                        ? layoutAlgebra(objectSpec, parentSpec, size)
                        : parentSpec;
                },
                [object, this._eventIO, this.size]
            );
        }
        else {
            object.__size.subscribe(this.size);

            var commitStream = Stream.lift(function(layout, size){
                if (size) layout.size = size;
                return layout;
            }.bind(this), [this._eventIO, object.size]);

            commitStream.on('start', function(spec){
                var root = _getRootNode.call(this);
                root.objects[object._id] = object;
                root.specs[object._id] = spec;
            }.bind(this));

            commitStream.on('update', function(spec){
                var root = _getRootNode.call(this);
                root.specs[object._id] = spec;
            }.bind(this));

            commitStream.on('end', function(){
                var root = _getRootNode.call(this);
                delete root.objects[object._id];
                delete root.specs[object._id];
            }.bind(this));
        }
    };

    module.exports = SceneGraphNode;
});
