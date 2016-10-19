/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Quaternion = require('./_Quaternion');
    var QuatTransitionable = require('./_QuatTransitionable');
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var LayoutNode = require('../core/nodes/LayoutNode');
    var RenderTreeNode = require('../core/nodes/RenderTreeNode');
    var Stream = require('../streams/Stream');

    function Camera(options){
        this.orientationState = Quaternion.create(options.orietation);
        this.position = new Transitionable(options.position || [0,0,0]);
        this.orientation = new QuatTransitionable(this.orientationState);

        var transform = Stream.lift(function(position, orientation){
            Quaternion.conjugate(orientation, this.orientationState);
            var transform = Quaternion.toTransform(this.orientationState);
            var invPosition = [-position[0], -position[1], -position[2]];
            return Transform.thenMove(transform, invPosition);
        }.bind(this), [this.position, this.orientation]);

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

    Camera.prototype.rotateBy = function(rotation, transition, callback){
        var currentOrientation = this.orientation.get();
        Quaternion.multiply(currentOrientation, rotation, this.orientationState);
        this.orientation.set(this.orientationState, transition, callback);
    }

    Camera.prototype.translateBy = function(delta, transition, callback){
        var currentPosition = this.position.get();
        var newPosition = [
            currentPosition[0] + delta[0],
            currentPosition[1] + delta[1],
            currentPosition[2] + delta[2]
        ];
        this.position.set(newPosition, transition, callback);
    }

    Camera.prototype.lookAt = function(position, orientation, transition, callback){
        Quaternion.conjugate(this.orientationState, this.orientationState);
        this.setPosition(position, transition);
        this.setOrientation(this.orientationState, transition, callback);
    }

    Camera.prototype.lookAtTransform = function(transform, transition, callback){
        var result = Transform.interpret(transform);
        var rotation = result.rotate;

        Quaternion.fromEulerAngles(rotation, this.orientationState);
        Quaternion.conjugate(this.orientationState, this.orientationState);

        this.orientation.set(this.orientationState, transition);
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
