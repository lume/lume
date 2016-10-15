/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Transform = require('./Transform');
    var QuatTransitionable = require('./_QuatTransitionable');
    var Quaternion = require('./_Quaternion');
    var Transitionable = require('./Transitionable');
    var Stream = require('../streams/Stream');
    var LayoutNode = require('./nodes/LayoutNode');
    var RenderTreeNode = require('./nodes/RenderTreeNode');
    var EventHandler = require('../events/EventHandler');

    function Camera(){
        this.orientationState = Quaternion.create();

        this.position = new Transitionable([0, 0, 0]);
        this.orientation = new QuatTransitionable(this.orientationState);

        var transform = Stream.lift(function(position, transform){
            return Transform.inverse(Transform.moveThen(position, transform));
        }, [this.position, this.orientation]);

        this._node = new LayoutNode({transform : transform});

        this._eventInput = new EventHandler();
        this._eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this._eventInput);
        EventHandler.setOutputHandler(this, this._eventOutput);

        this._eventInput.on('start', function(){
            this._eventOutput.emit('start', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));

        this._eventInput.on('end', function(){
            this._eventOutput.emit('end', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));

        this._eventInput.on('rotate', function(rotation){
            this.rotate(rotation);
            this._eventOutput.emit('update', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));

        this._eventInput.on('zoom', function(zoom){
            this.zoom(zoom);
            this._eventOutput.emit('update', {
                position: this.getPosition(),
                orientation: this.getOrientation()
            });
        }.bind(this));
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

    Camera.prototype.zoom = function(delta, transition, callback){
        var position = this.position.get();
        var newPosition = [position[0], position[1], position[2] + delta];
        this.position.set(newPosition, transition, callback);
    }

    Camera.prototype.rotate = function(rotation){
        var currentOrientation = this.orientation.get();
        Quaternion.multiply(currentOrientation, rotation, this.orientationState);
        this.orientation.set(this.orientationState);
    }

    Camera.prototype.lookAt = function(position, orientation, transition, callback){
        this.set(
            [-position[0], -position[1], -position[2]],
            [-orientation[0], -orientation[1], -orientation[2], -orientation[3]],
            transition,
            callback
        );
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
