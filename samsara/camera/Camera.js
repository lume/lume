/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Quaternion = require('./_Quaternion');
    var QuatTransitionable = require('./_QuatTransitionable');
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var LayoutNode = require('../core/nodes/LayoutNode');
    var RenderTreeNode = require('../core/nodes/RenderTreeNode');
    var OptionsManager = require('../core/_OptionsManager');
    var Stream = require('../streams/Stream');

    /**
     * A way to transition numeric values and arrays of numbers between start and end states.
     *  Transitioning happens through one of many possible interpolations, such as easing
     *  curves like 'easeIn', or physics curves like 'spring' and 'inertia'. The choice
     *  of interpolation is specified when `.set` is called. If no interpolation is specified
     *  then the value changes immediately. Non-numeric values in arrays, such as `undefined`
     *  or `true`, are safely ignored.
     *
     *  Transitionables are streams, so they emit `start`, `update` and `end` events, with a payload
     *  that is their current value. As streams, they can also be mapped, filtered, composed, etc.
     *
     * @class Camera
     * @constructor
     * @namespace Camera
     * @param options {Object}                              Options
     * @param [options.orientation=[1,0,0,0]] {Quaternion}  Initial orientation of camera
     * @param [options.position=[0,0,0]] {Array}            Initial position of camera
     */
    function Camera(options){
        this.options = OptionsManager.setOptions(this, options);

        this.orientationState = Quaternion.create(options.orietation);
        this.position = new Transitionable(options.position);
        this.orientation = new QuatTransitionable(this.orientationState);

        var transform = Stream.lift(function(position, orientation){
            Quaternion.conjugate(orientation, this.orientationState);
            var transform = Quaternion.toTransform(this.orientationState);
            return Transform.thenMove(transform, position);
        }.bind(this), [this.position, this.orientation]);

        var layout = new LayoutNode({transform : transform});
        this._node = new RenderTreeNode(layout);
    }

    Camera.DEFAULT_OPTIONS = {
        position: [0, 0, 0],
        orientation: Quaternion.create()
    };

    /**
     * Set the position.
     *
     * @method setPosition
     * @param position {Number[]}               End position
     * @param [transition] {Object}             Transition definition
     * @param [callback] {Function}             Callback
     */
    Camera.prototype.setPosition = function(position, transition, callback){
        this.position.set(position, transition, callback);
    }

    /**
     * Get the position.
     *
     * @method getPosition
     * @return {Array}                          Position
     */
    Camera.prototype.getPosition = function(){
        return this.position.get();
    }

    /**
     * Set the orientation.
     *
     * @method setOrientation
     * @param orientation {Array}               [angle, x-axis, y-axis, z-axis]
     * @param [transition] {Object}             Transition definition
     * @param [callback] {Function}             Callback
     */
    Camera.prototype.setOrientation = function(orientation, transition, callback){
        Quaternion.fromAngleAxis(orientation, this.orientationState);
        this.orientation.set(this.orientationState, transition, callback);
    }

    /**
     * Get the orientation.
     *
     * @method getOrientation
     * @return {Array}                          Orientation as [angle, x-axis, y-axis, z-axis]
     */
    Camera.prototype.getOrientation = function(){
        return Quaternion.toAngleAxis(this.orientation.get());
    }

    /**
     * Move the position of the camera in the z-direction by a given amount.
     *
     * @method zoomBy
     * @param delta {Number}                    Relative amount to zoom by
     * @param [transition] {Object}             Transition definition
     * @param [callback] {Function}             Callback
     */
    Camera.prototype.zoomBy = function(delta, transition, callback){
        var position = this.position.get();
        var newPosition = [position[0], position[1], position[2] + delta];
        this.position.set(newPosition, transition, callback);
    }

    /**
     * Move the position of the camera in the z-direction to the given zoom.
     *
     * @method setZoom
     * @param zoom {Number}                     Absolute amount to zoom
     * @param [transition] {Object}             Transition definition
     * @param [callback] {Function}             Callback
     */
    Camera.prototype.setZoom = function(zoom, transition, callback){
        var position = this.getPosition();
        var previousZoom = position[2];
        var delta = zoom - previousZoom;
        this.zoomBy(delta, transition, callback);
    }

    /**
     * Rotate the orientation of the camera by a given rotation.
     *
     * @method rotateBy
     * @param rotation {Array}                  Rotation as [angle, x-axis, y-axis, z-axis]
     * @param [transition] {Object}             Transition definition
     * @param [callback] {Function}             Callback
     */
    Camera.prototype.rotateBy = function(rotation, transition, callback){
        var currentOrientation = this.orientation.get();
        Quaternion.multiply(currentOrientation, rotation, this.orientationState);
        this.orientation.set(this.orientationState, transition, callback);
    }

    /**
     * Translate relative to current position of camera.
     *
     * @method translateBy
     * @param delta {Array}                     Relative amount to translate by [x, y, z]
     * @param [transition] {Object}             Transition definition
     * @param [callback] {Function}             Callback
     */
    Camera.prototype.translateBy = function(delta, transition, callback){
        var currentPosition = this.position.get();
        var newPosition = [
            currentPosition[0] + delta[0],
            currentPosition[1] + delta[1],
            currentPosition[2] + delta[2]
        ];
        this.position.set(newPosition, transition, callback);
    }

    /**
     * Face the camera towards a Transform. The Transform is decomposed into
     *  its position and rotation parts to calulate where to orient the camera.
     *
     * @method lookAt
     * @param transform {Transform}             Transform to face camera toward
     * @param [transition] {Object}             Transition definition
     * @param [callback] {Function}             Callback
     */
    Camera.prototype.lookAt = function(transform, transition, callback){
        var result = Transform.interpret(transform);
        var rotation = result.rotate;

        Quaternion.fromEulerAngles(rotation, this.orientationState);
        Quaternion.conjugate(this.orientationState, this.orientationState);

        this.orientation.set(this.orientationState, transition);
    }

    Camera.prototype._onAdd = function(parent){
        return parent.add(this._node);
    }

    /**
     * Extends the render tree subtree with a new node.
     *
     * @method add
     * @param object {SizeNode|LayoutNode|Surface} Node
     * @return {RenderTreeNode}
     */
    Camera.prototype.add = function(){
        return RenderTreeNode.prototype.add.apply(this._node, arguments);
    }

    /**
     * Remove the Camera from the RenderTree. All Surfaces added to the View
     *  will also be removed. The Camera can be added back at a later time and
     *  all of its data and Surfaces will be restored.
     *
     * @method remove
     */
    Camera.prototype.remove = function(){
        return RenderTreeNode.prototype.remove.apply(this._node, arguments);
    }

    module.exports = Camera;
});
