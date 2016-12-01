/* Copyright © 2015-2016 David Valdman */

define(function(require, exports, module){
    var Camera = require('./Camera');
    var Quaternion = require('./Quaternion');
    var Controller = require('../core/Controller');
    var Transform = require('../core/Transform');
    var Transitionable = require('../core/Transitionable');
    var Stream = require('../streams/Stream');

    var MouseInput = require('../inputs/MouseInput');
    var TouchInput = require('../inputs/TouchInput');
    var ScrollInput = require('../inputs/ScrollInput');
    var PinchInput = require('../inputs/PinchInput');
    var GenericInput = require('../inputs/GenericInput');

    GenericInput.register({
        mouse : MouseInput,
        touch : TouchInput,
        pinch : PinchInput,
        scroll : ScrollInput
    });

    /**
     * A tackball camera. This is a camera that rotates (in place) what is added to its render tree. It can
     *  also zoom in and out. These actions are tied to DOM events. Rotation is connected to mouse and touch events,
     *  and zooming is connected to the scrollwheel and pinch (two-finger touch) input.
     *
     *  @class TrackballCamera
     *  @constructor
     *  @namespace Camera
     *  @extends Core.Controller
     *  @param [options] {Object}                       Options
     *  @param [options.radius=500] {Number}            Radius of the trackball camera
     *  @param [options.rotationScale=1] {Number}       Amount to scale the rotation
     *  @param [options.zoomScale=1] {Number}           Amount to scale the zoom
     *  @param [options.inertia=true] {Boolean}         Include inertia for rotation and zooming
     *  @param [options.position=[0,0,0]] {Array}       Starting position of the camera
     *  @param [options.orientation=[1,0,0,0]] {Array}  Starting orientation of the camera
     */
    var TrackballCamera = Controller.extend({
        defaults : {
            radius: 500,
            rotationScale: 1,
            zoomScale: 1,
            inertia: true,
            position: Camera.DEFAULT_OPTIONS.position,
            orientation: Camera.DEFAULT_OPTIONS.orientation
        },
        initialize : function(options){
            this.camera = new Camera(options);
            this.delta = Quaternion.create();

            this.orientation = this.camera.orientation;
            this.position = this.camera.position;

            // get the coordinates of the center of the camera
            // TODO: make work if inside of ContainerSurfaces
            this.center = [];
            var centerStream = Stream.lift(function(size, layout){
                if (!size || !layout) return false;
                var pos = Transform.getTranslate(layout.transform);
                this.center[0] = pos[0] + 0.5 * size[0];
                this.center[1] = pos[1] + 0.5 * size[1];
            }.bind(this), [this.camera._node._size, this.camera._node.layout]);

            centerStream.on(['set', 'start', 'update', 'end'], function(center){});

            var rotationInertia = options.inertia ? new Transitionable(0) : false;
            var zoomInertia = options.inertia ? new Transitionable(0) : false;

            var rotationInput = new GenericInput(['mouse', 'touch'], {scale : options.rotationScale, limit: 1});
            var zoomInput = new GenericInput({
                pinch : {scale: options.zoomScale},
                scroll : {scale: options.zoomScale, direction: ScrollInput.DIRECTION.Y}
            });

            rotationInput.subscribe(this.input);
            zoomInput.subscribe(this.input);

            // update rotation based on mouse and touch dragging
            rotationInput.on('set', function(data){
                if (rotationInertia && rotationInertia.isActive()) rotationInertia.halt();

                this.emit('set', {
                    position: this.getPosition(),
                    orientation: this.getOrientation()
                });
            }.bind(this));

            var hasMoved = false;
            rotationInput.on('start', function(data){
                hasMoved = false;
                if (rotationInertia && rotationInertia.isActive()) rotationInertia.halt();

                this.emit('start', {
                    position: this.getPosition(),
                    orientation: this.getOrientation()
                });
            }.bind(this));

            rotationInput.on('update', function(data){
                hasMoved = true;
                var angleAxis = convertInputToAngleAxis.call(this, data);
                Quaternion.fromAngleAxis(angleAxis, this.delta);
                this.rotateBy(this.delta);

                this.emit('update', {
                    position: this.getPosition(),
                    orientation: this.getOrientation()
                });
            }.bind(this));

            // at end of rotation, apply inertia to Quaternion if inertia is allowed
            rotationInput.on('end', function(data){
                if (!hasMoved || !rotationInertia) {
                    this.emit('end', {
                        position: this.getPosition(),
                        orientation: this.getOrientation()
                    });
                }
                else {
                    var angle = Quaternion.getAngle(this.delta);
                    rotationInertia.reset(angle);
                    rotationInertia.set(angle, {
                        curve : 'damp',
                        damping : .9
                    });
                }
            }.bind(this));

            if (rotationInertia){
                rotationInertia.on('update', function(angle){
                    Quaternion.setAngle(this.delta, angle, this.delta);
                    this.rotateBy(this.delta);

                    this.emit('update', {
                        position: this.getPosition(),
                        orientation: this.getOrientation()
                    });
                }.bind(this));

                rotationInertia.on('end', function(value){
                    this.emit('end', {
                        position: this.getPosition(),
                        orientation: this.getOrientation()
                    });
                }.bind(this));
            }

            // update zoom based on mousewheel and pinch events
            zoomInput.on('set', function(data){
                if (zoomInertia && zoomInertia.isActive()) zoomInertia.halt();

                this.emit('set', {
                    position: this.getPosition(),
                    orientation: this.getOrientation()
                });
            }.bind(this));

            zoomInput.on('start', function(data){
                if (zoomInertia && zoomInertia.isActive()) zoomInertia.halt();

                this.emit('start', {
                    position: this.getPosition(),
                    orientation: this.getOrientation()
                });
            }.bind(this));

            zoomInput.on('update', function(data){
                var zoom = data.delta;
                this.zoomBy(zoom);

                this.emit('update', {
                    position: this.getPosition(),
                    orientation: this.getOrientation()
                });
            }.bind(this));

            // at end of zooming (on pinch), apply inertia to zoom
            zoomInput.on('end', function(data){
                if (!zoomInertia || data.velocty === 0){
                    this.emit('end', {
                        position: this.getPosition(),
                        orientation: this.getOrientation()
                    });
                }
                else {
                    var z = this.getPosition()[2];
                    zoomInertia.reset(z);
                    zoomInertia.set(z, {
                        curve : 'inertia',
                        damping: .2,
                        velocity : data.velocity
                    });
                }
            }.bind(this));

            if (zoomInertia){
                zoomInertia.on('update', function(value){
                    this.setZoom(value);
                    this.emit('update', {
                        position: this.getPosition(),
                        orientation: this.getOrientation()
                    });
                }.bind(this));

                zoomInertia.on('end', function(value){
                    this.emit('end', {
                        position: this.getPosition(),
                        orientation: this.getOrientation()
                    });
                }.bind(this));
            }
        },
        _onAdd : function(){
            return Camera.prototype._onAdd.apply(this.camera, arguments);
        },
        /**
         * Extends the render tree subtree with a new node.
         *
         * @method add
         * @param object {SizeNode|LayoutNode|Surface} Node
         * @return {RenderTreeNode}
         */
        add : function(){
            return Camera.prototype.add.apply(this.camera, arguments);
        },
        /**
         * Remove from the RenderTree. All Surfaces added to the View
         *  will also be removed. The Camera can be added back at a later time and
         *  all of its data and Surfaces will be restored.
         *
         * @method remove
         */
        remove : function(){
            return Camera.prototype.remove.apply(this.camera, arguments);
        },
        /**
         * Set the position.
         *
         * @method setPosition
         * @param position {Number[]}               End position
         * @param [transition] {Object}             Transition definition
         * @param [callback] {Function}             Callback
         */
        setPosition : function(position, transition, callback){
            Camera.prototype.setPosition.apply(this.camera, arguments);
        },
        /**
         * Get the position.
         *
         * @method getPosition
         * @return {Array}                          Position
         */
        getPosition : function(){
            return Camera.prototype.getPosition.apply(this.camera);
        },
        /**
         * Set the orientation.
         *
         * @method setOrientation
         * @param orientation {Array}               [angle, x-axis, y-axis, z-axis]
         * @param [transition] {Object}             Transition definition
         * @param [callback] {Function}             Callback
         */
        setOrientation : function(orientation, transition, callback){
            Camera.prototype.setOrientation.apply(this.camera, arguments);
        },
        /**
         * Get the orientation.
         *
         * @method getOrientation
         * @return {Array}                          Orientation as [angle, x-axis, y-axis, z-axis]
         */
        getOrientation : function(){
            return Camera.prototype.getOrientation.apply(this.camera);
        },
        /**
         * Move the position of the camera in the z-direction by a given amount.
         *
         * @method zoomBy
         * @param delta {Number}                    Relative amount to zoom by
         * @param [transition] {Object}             Transition definition
         * @param [callback] {Function}             Callback
         */
        zoomBy : function(delta, transition, callback){
            Camera.prototype.zoomBy.apply(this.camera, arguments);
        },
        /**
         * Move the position of the camera in the z-direction to the given zoom.
         *
         * @method setZoom
         * @param zoom {Number}                     Absolute amount to zoom
         * @param [transition] {Object}             Transition definition
         * @param [callback] {Function}             Callback
         */
        setZoom : function(zoom, transition, callback){
            Camera.prototype.setZoom.apply(this.camera, arguments);
        },
        /**
         * Rotate the orientation of the camera by a given rotation.
         *
         * @method rotateBy
         * @param rotation {Array}                  Rotation as [angle, x-axis, y-axis, z-axis]
         * @param [transition] {Object}             Transition definition
         * @param [callback] {Function}             Callback
         */
        rotateBy : function(rotation, transition, callback){
            Camera.prototype.rotateBy.apply(this.camera, arguments);
        },
        /**
         * Face the camera towards a Transform. The Transform is decomposed into
         *  its position and rotation parts to calulate where to orient the camera.
         *
         * @method lookAt
         * @param transform {Transform}             Transform to face camera toward
         * @param [transition] {Object}             Transition definition
         * @param [callback] {Function}             Callback
         */
        lookAt : function(transform, transition, callback){
            Camera.prototype.lookAt.apply(this.camera, arguments);
        }
    });

    // convert mouse/touch input delta into a rotation for the camera
    function convertInputToAngleAxis(data){
        var delta = data.delta;

        var dx = delta[0];
        var dy = delta[1];

        var px = data.x - this.center[0];
        var py = data.y - this.center[1];
        var pz = this.options.radius;

        var qx = px + dx;
        var qy = py + dy;
        var qz = this.options.radius;

        var dpInv = 1 / Math.hypot(px, py, pz);
        var dqInv = 1 / Math.hypot(qx, qy, qz);

        px *= dpInv;
        py *= dpInv;
        pz *= dpInv;
        qx *= dqInv;
        qy *= dqInv;
        qz *= dqInv;

        var angle = Math.acos(px * qx + py * qy + pz * qz);

        var axisX = py * qz - pz * qy;
        var axisY = pz * qx - px * qz;
        var axisZ = px * qy - py * qx;

        return [angle, axisX, axisY, axisZ];
    }

    module.exports = TrackballCamera;
});
