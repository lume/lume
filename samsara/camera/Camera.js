/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Quaternion = require('./_Quaternion');
    var QuatTransitionable = require('./_QuatTransitionable');
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var LayoutNode = require('../core/nodes/LayoutNode');
    var RenderTreeNode = require('../core/nodes/RenderTreeNode');
    var Stream = require('../streams/Stream');

    function Camera(){
        this.orientationState = Quaternion.create();

        this.position = new Transitionable([0, 0, 0]);
        this.orientation = new QuatTransitionable(this.orientationState);

        var transform = Stream.lift(function(position, orientation){
            var transform = Quaternion.toTransform(orientation);
            return Transform.inverse(Transform.moveThen(position, transform));
        }, [this.position, this.orientation]);

        var layout = new LayoutNode({transform : transform});
        this._node = new RenderTreeNode(layout);
    }

    Camera.prototype.setPosition = function(position, transition, callback){
        this.position.set(position, transition, callback);
    }

    Camera.prototype.getPosition = function(){
        return this.position.get();
    }

    Camera.prototype.setOrientation = function(orientation, transition, callback){
        Quaternion.fromAngleAxis(orientation, this.orientationState);
        this.orientation.set(this.orientationState, transition, callback);
    }

    Camera.prototype.getOrientation = function(){
        return this.orientation.get();
    }

    Camera.prototype.zoomBy = function(delta, transition, callback){
        var position = this.position.get();
        var newPosition = [position[0], position[1], position[2] + delta];
        this.position.set(newPosition, transition, callback);
    }

    Camera.prototype.rotateBy = function(rotation){
        var currentOrientation = this.orientation.get();
        Quaternion.multiply(currentOrientation, rotation, this.orientationState);
        this.orientation.set(this.orientationState);
    }

    Camera.prototype.translateBy = function(delta){
        var currentPosition = this.position.get();
        var newPosition = [
            currentPosition[0] + delta[0],
            currentPosition[1] + delta[1],
            currentPosition[2] + delta[2]
        ];
        this.position.set(newPosition);
    }

    Camera.prototype.lookAt = function(position, orientation, transition, callback){
        this.set(
            [-position[0], -position[1], -position[2]],
            [-orientation[0], -orientation[1], -orientation[2], -orientation[3]],
            transition,
            callback
        );
    }

    Camera.prototype.lookAtTransform = function(transform, transition, callback){
        var result = Transform.interpret(transform);
        var position = result.translate;
        var rotation = result.rotation;

        var orientation = [];
        Quaternion.fromEulerAngles(rotation, orientation);

        this.lookAt(position, orientation, transition, callback);
    }

    Camera.prototype._onAdd = function(parent){
        return parent.add(this._node);
    }

    Camera.prototype.add = function(){
        return RenderTreeNode.prototype.add.apply(this._node, arguments);
    }

    Camera.prototype.remove = function(){
        return RenderTreeNode.prototype.remove.apply(this._node, arguments);
    }

    module.exports = Camera;
});
